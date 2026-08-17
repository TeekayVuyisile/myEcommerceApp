import "server-only";
import { cache } from "react";
import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/service-client";
import { createSupabaseServerClient } from "@/lib/supabase/ssr-clients";
import { paystackFeeCents } from "@/lib/paystack";

export const ORDER_STATUSES = [
  "pending",
  "in_progress",
  "preview_ready",
  "paid",
  "delivered",
  "cancelled",
];

// Verifies the freelancer's admin session. Every admin Server Action must
// call this itself — the proxy redirect only optimistically protects pages,
// not Server Actions, which are directly POST-reachable regardless of UI.
export const requireAdminSession = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
});

export function generateOrderToken() {
  return crypto.randomBytes(24).toString("base64url");
}

export async function listOrders() {
  await requireAdminSession();
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// Money actually received always comes from the order_charges ledger (real
// paid charges), never from order status or installments_paid — those can
// drift (e.g. a charge recorded but not yet finalized) while the ledger is
// the same source of truth the webhook itself writes to.
//
// Every figure here is net of Paystack's cut (see lib/paystack.js
// paystackFeeCents) — "Collected" is what actually lands in the bank, not
// what the client was charged. "Awaiting" nets out an *estimate* of the fee
// that will apply once it's actually charged (one flat fee per remaining
// instalment, since each instalment is its own transaction); "Lost" is
// never fee-adjusted since money that was never charged never paid a fee.
export async function getRevenueSummary() {
  await requireAdminSession();
  const supabase = createServiceClient();

  const [{ data: orders, error: ordersError }, { data: charges, error: chargesError }] =
    await Promise.all([
      supabase
        .from("orders")
        .select("id, status, amount_cents, installment_amount_cents, total_installments"),
      supabase.from("order_charges").select("order_id, amount_cents").eq("status", "paid"),
    ]);

  if (ordersError) throw new Error(ordersError.message);
  if (chargesError) throw new Error(chargesError.message);

  const chargesByOrder = new Map();
  for (const charge of charges) {
    const list = chargesByOrder.get(charge.order_id) ?? [];
    list.push(charge.amount_cents);
    chargesByOrder.set(charge.order_id, list);
  }

  let collectedGrossCents = 0;
  let paystackFeesCents = 0;
  let awaitingGrossCents = 0;
  let paystackFeesEstimatedCents = 0;
  let lostCents = 0;

  for (const order of orders) {
    const orderCharges = chargesByOrder.get(order.id) ?? [];
    const collectedGross = orderCharges.reduce((sum, c) => sum + c, 0);
    collectedGrossCents += collectedGross;
    paystackFeesCents += orderCharges.reduce((sum, c) => sum + paystackFeeCents(c), 0);

    // What's still owed on this specific order, regardless of order status.
    const remaining = Math.max(order.amount_cents - collectedGross, 0);

    if (order.status === "cancelled") {
      // Never going to be collected now — this is the potential revenue
      // lost. No fee applies since the money was never charged.
      lostCents += remaining;
    } else if (remaining > 0) {
      const remainingInstallments = Math.max(order.total_installments - orderCharges.length, 1);
      const perChargeAmount = order.installment_amount_cents || remaining;
      const estimatedFees = Math.min(
        remainingInstallments * paystackFeeCents(perChargeAmount),
        remaining
      );

      awaitingGrossCents += remaining;
      paystackFeesEstimatedCents += estimatedFees;
    }
  }

  const collectedCents = collectedGrossCents - paystackFeesCents;
  const awaitingCents = awaitingGrossCents - paystackFeesEstimatedCents;

  return {
    collectedCents,
    awaitingCents,
    lostCents,
    projectedCents: collectedCents + awaitingCents,
    paystackFeesCents,
    paystackFeesEstimatedCents,
  };
}

export async function getOrder(id) {
  await requireAdminSession();
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

// Amounts are always computed server-side from `services` — the current,
// sale-aware pricing resolved by lib/pricing.js at the moment of the call —
// never trust a client-submitted amount. The one exception is the "custom"
// service, which is priced individually per project, so customAmountRand is
// required for that case. Once computed, amount_cents/installment_amount_cents
// are stored directly on the order and never recomputed from pricing again,
// so a later base-price or sale change can never affect an existing order.
export async function createOrder({
  clientName,
  clientContact,
  clientEmail,
  serviceDescription,
  serviceType,
  paymentPlan,
  customAmountRand,
  services,
}) {
  await requireAdminSession();

  const service = services.find((s) => s.key === serviceType);
  const plan = service?.plans.find((p) => p.key === paymentPlan);
  if (!service || !plan) throw new Error("Invalid service/payment plan combination.");

  let totalRand;
  if (serviceType === "custom") {
    if (!Number.isFinite(customAmountRand) || customAmountRand <= 0) {
      throw new Error("A valid negotiated amount is required for custom work.");
    }
    totalRand = customAmountRand;
  } else {
    // Use the service's actual total, not plan.amountRand * installments —
    // amountRand is already rounded per-instalment, so multiplying it back
    // out drifts by a cent (e.g. 866.67 * 3 = 2600.01, not 2600).
    totalRand = service.totalRand;
  }

  const amountCents = Math.round(totalRand * 100);
  const installmentAmountCents = Math.round(amountCents / plan.installments);

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .insert({
      client_name: clientName,
      client_contact: clientContact,
      client_email: clientEmail,
      service_description: serviceDescription,
      service_type: serviceType,
      payment_plan: paymentPlan,
      amount_cents: amountCents,
      installment_amount_cents: installmentAmountCents,
      total_installments: plan.installments,
      currency: "ZAR",
      order_token: generateOrderToken(),
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateOrderStatus(id, status) {
  await requireAdminSession();
  if (!ORDER_STATUSES.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function setPreviewUrl(id, previewUrl) {
  await requireAdminSession();
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("orders")
    .update({ preview_url: previewUrl })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function setClientEmail(id, clientEmail) {
  await requireAdminSession();
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("orders")
    .update({ client_email: clientEmail })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

// Name/contact carry no financial meaning, so these are safe to correct at
// any time regardless of payment progress.
export async function updateClientDetails(id, { clientName, clientContact }) {
  await requireAdminSession();
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("orders")
    .update({ client_name: clientName, client_contact: clientContact })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

// Changing the service/plan after any instalment has been paid would make
// the amount already charged inconsistent with the new plan's numbers, so
// this is only allowed while installments_paid is still 0.
export async function updateServicePlan(id, { serviceType, paymentPlan, customAmountRand, services }) {
  await requireAdminSession();
  const supabase = createServiceClient();

  const { data: existing, error: fetchError } = await supabase
    .from("orders")
    .select("installments_paid")
    .eq("id", id)
    .maybeSingle();
  if (fetchError) throw new Error(fetchError.message);
  if (!existing) throw new Error("Order not found.");
  if (existing.installments_paid > 0) {
    throw new Error(
      "Can't change the plan after a payment has already been made on this order."
    );
  }

  const service = services.find((s) => s.key === serviceType);
  const plan = service?.plans.find((p) => p.key === paymentPlan);
  if (!service || !plan) throw new Error("Invalid service/payment plan combination.");

  let totalRand;
  if (serviceType === "custom") {
    if (!Number.isFinite(customAmountRand) || customAmountRand <= 0) {
      throw new Error("A valid negotiated amount is required for custom work.");
    }
    totalRand = customAmountRand;
  } else {
    totalRand = service.totalRand;
  }

  const amountCents = Math.round(totalRand * 100);
  const installmentAmountCents = Math.round(amountCents / plan.installments);

  const { error } = await supabase
    .from("orders")
    .update({
      service_type: serviceType,
      payment_plan: paymentPlan,
      amount_cents: amountCents,
      installment_amount_cents: installmentAmountCents,
      total_installments: plan.installments,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

// A maintenance request is just another `orders` row (service_type =
// 'maintenance') linked back to the client's original order via
// parent_order_id — it reuses the exact same order_token/Paystack/
// order_charges machinery, so it gets its own payable link, its own status,
// and shows up in revenue calculations automatically. Client details are
// copied from the parent so the admin never has to retype them.
export async function createMaintenanceOrder(parentOrderId, { description, amountRand }) {
  await requireAdminSession();
  const supabase = createServiceClient();

  const { data: parent, error: parentError } = await supabase
    .from("orders")
    .select("client_name, client_contact, client_email")
    .eq("id", parentOrderId)
    .maybeSingle();
  if (parentError) throw new Error(parentError.message);
  if (!parent) throw new Error("Original order not found.");
  if (!parent.client_email) {
    throw new Error(
      "This client doesn't have an email on file — add one in Order settings first (Paystack needs it to charge them)."
    );
  }
  if (!Number.isFinite(amountRand) || amountRand <= 0) {
    throw new Error("Enter a valid amount.");
  }

  const amountCents = Math.round(amountRand * 100);

  const { data, error } = await supabase
    .from("orders")
    .insert({
      client_name: parent.client_name,
      client_contact: parent.client_contact,
      client_email: parent.client_email,
      service_description: description,
      service_type: "maintenance",
      payment_plan: "once_off",
      amount_cents: amountCents,
      installment_amount_cents: amountCents,
      total_installments: 1,
      // No build/preview phase for a maintenance charge — it's payable the
      // moment it's created.
      status: "preview_ready",
      currency: "ZAR",
      order_token: generateOrderToken(),
      parent_order_id: parentOrderId,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getMaintenanceOrders(parentOrderId) {
  await requireAdminSession();
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("parent_order_id", parentOrderId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// Public — no admin session. Callers (the /order/[token] page and payment
// actions) are trusted with only what they already hold: the token itself.
export async function getOrderByToken(token) {
  if (!token) return null;
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_token", token)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

function addOneMonth(date) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

// Called before initiating any Paystack charge — the first hosted-checkout
// payment, or a later admin-triggered instalment charge. Recorded as
// 'pending' up front so the webhook always has a row to match against, and
// so a charge attempt that never gets confirmed still shows up in history.
export async function recordChargeAttempt(orderId, { installmentNumber, amountCents, reference }) {
  const supabase = createServiceClient();

  const { error } = await supabase.from("order_charges").insert({
    order_id: orderId,
    installment_number: installmentNumber,
    amount_cents: amountCents,
    paystack_reference: reference,
    status: "pending",
  });

  if (error) {
    // 23505 = unique_violation — the partial unique index on
    // (order_id, installment_number) WHERE status = 'pending' (see migration
    // 006) caught a second concurrent attempt at the same instalment before
    // it could reach Paystack.
    if (error.code === "23505") {
      throw new Error(
        "A charge for this instalment is already in progress — wait a moment, then check the payment history before retrying."
      );
    }
    throw new Error(error.message);
  }
}

// Called from the Paystack webhook (source of truth for "did this charge
// actually succeed") AND directly from the admin's instalment-charge action
// (so the UI updates without waiting on the webhook). Both paths can race
// for the same reference — Paystack retries webhook delivery, and the
// direct-response path can land at nearly the same moment as the webhook —
// so the pending -> status transition itself has to be the atomic operation,
// not a separate read-then-write. Filtering the UPDATE on status = 'pending'
// means only one concurrent caller can ever actually flip a given row; every
// other caller gets zero rows back and safely no-ops instead of
// double-processing the charge (e.g. crediting installments_paid twice).
export async function finalizeCharge(reference, { status, authorizationCode }) {
  const supabase = createServiceClient();

  const { data: updatedCharges, error: chargeUpdateError } = await supabase
    .from("order_charges")
    .update({ status })
    .eq("paystack_reference", reference)
    .eq("status", "pending")
    .select("id, order_id, installment_number");
  if (chargeUpdateError) throw new Error(chargeUpdateError.message);

  if (!updatedCharges || updatedCharges.length === 0) {
    return { updated: false, reason: "already_finalized_or_unknown" };
  }
  const charge = updatedCharges[0];

  if (status !== "paid") return { updated: true };

  const { data: order, error: orderFetchError } = await supabase
    .from("orders")
    .select("installments_paid, total_installments")
    .eq("id", charge.order_id)
    .single();
  if (orderFetchError) throw new Error(orderFetchError.message);

  const installmentsPaid = order.installments_paid + 1;
  const fullyPaid = installmentsPaid >= order.total_installments;

  const orderUpdate = {
    status: "paid",
    installments_paid: installmentsPaid,
    next_charge_due_at: fullyPaid ? null : addOneMonth(new Date()),
  };
  // The saved-card token only comes back on the first payment (made via
  // Paystack's hosted checkout); later instalments are charged against it,
  // not asked to provide a fresh one.
  if (charge.installment_number === 1 && authorizationCode) {
    orderUpdate.paystack_authorization_code = authorizationCode;
  }

  const { error: orderUpdateError } = await supabase
    .from("orders")
    .update(orderUpdate)
    .eq("id", charge.order_id);
  if (orderUpdateError) throw new Error(orderUpdateError.message);

  return { updated: true };
}

export async function getOrderCharges(orderId) {
  await requireAdminSession();
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("order_charges")
    .select("*")
    .eq("order_id", orderId)
    .order("installment_number", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

// For the daily reminder cron — not admin-session gated, called from a
// secret-protected route instead.
export async function getDueInstallments() {
  const supabase = createServiceClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("orders")
    .select("id, client_name, installment_amount_cents, installments_paid, total_installments, next_charge_due_at")
    .lte("next_charge_due_at", today)
    .not("next_charge_due_at", "is", null)
    .neq("status", "cancelled");

  if (error) throw new Error(error.message);
  // Defensive filter, on top of next_charge_due_at: never surface an order
  // that's already fully paid, even if next_charge_due_at somehow wasn't
  // cleared. (installments_paid/total_installments can't be compared
  // directly in a PostgREST filter, so it's done here instead.)
  return data.filter((o) => o.installments_paid < o.total_installments);
}
