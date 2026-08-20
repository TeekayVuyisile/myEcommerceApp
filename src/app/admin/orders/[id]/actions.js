"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  updateOrderStatus,
  setPreviewUrl,
  setClientEmail,
  updateClientDetails,
  updateServicePlan,
  getOrder,
  recordChargeAttempt,
  finalizeCharge,
  createMaintenanceOrder,
  deleteOrder,
} from "@/lib/dal";
import { chargeAuthorization } from "@/lib/paystack";
import { getResolvedServices } from "@/lib/pricing";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function updateStatus(prevState, formData) {
  const id = formData.get("id")?.toString();
  const status = formData.get("status")?.toString();

  await updateOrderStatus(id, status);
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin");
  return { success: true };
}

export async function updatePreviewUrl(prevState, formData) {
  const id = formData.get("id")?.toString();
  const previewUrl = formData.get("previewUrl")?.toString().trim() || null;

  await setPreviewUrl(id, previewUrl);
  revalidatePath(`/admin/orders/${id}`);
  return { success: true };
}

export async function updateClientEmail(prevState, formData) {
  const id = formData.get("id")?.toString();
  const clientEmail = formData.get("clientEmail")?.toString().trim();

  if (!clientEmail || !EMAIL_PATTERN.test(clientEmail)) {
    return { error: "Enter a valid email address." };
  }

  await setClientEmail(id, clientEmail);
  revalidatePath(`/admin/orders/${id}`);
  return { success: true };
}

export async function updateClientDetailsAction(prevState, formData) {
  const id = formData.get("id")?.toString();
  const clientName = formData.get("clientName")?.toString().trim();
  const clientContact = formData.get("clientContact")?.toString().trim();

  if (!clientName || !clientContact) {
    return { error: "Name and contact can't be empty." };
  }

  await updateClientDetails(id, { clientName, clientContact });
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin");
  return { success: true };
}

export async function updateServicePlanAction(prevState, formData) {
  const id = formData.get("id")?.toString();
  const serviceType = formData.get("serviceType")?.toString();
  const paymentPlan = formData.get("paymentPlan")?.toString();
  const customAmountRandRaw = formData.get("customAmountRand");
  const customAmountRand = customAmountRandRaw ? Number(customAmountRandRaw) : undefined;

  try {
    const services = await getResolvedServices();
    await updateServicePlan(id, { serviceType, paymentPlan, customAmountRand, services });
  } catch (err) {
    return { error: err.message };
  }

  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin");
  return { success: true };
}

export async function createMaintenanceOrderAction(prevState, formData) {
  const parentOrderId = formData.get("parentOrderId")?.toString();
  const description = formData.get("description")?.toString().trim();
  const amountRand = Number(formData.get("amountRand"));

  if (!description) {
    return { error: "Describe what this charge is for." };
  }

  let newOrder;
  try {
    newOrder = await createMaintenanceOrder(parentOrderId, { description, amountRand });
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    return { error: err.message };
  }

  revalidatePath(`/admin/orders/${parentOrderId}`);
  revalidatePath("/admin");

  return {
    success: true,
    orderUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/order/${newOrder.order_token}`,
  };
}

export async function deleteOrderAction(prevState, formData) {
  const id = formData.get("id")?.toString();

  try {
    await deleteOrder(id);
  } catch (err) {
    return { error: err.message };
  }

  revalidatePath("/admin");
  redirect("/admin");
}

export async function chargeNextInstallment(prevState, formData) {
  const id = formData.get("id")?.toString();
  const order = await getOrder(id);

  if (!order) return { error: "Order not found." };
  if (!order.paystack_authorization_code) {
    return {
      error: "No saved card yet — the client hasn't completed their first payment.",
    };
  }
  if (order.installments_paid >= order.total_installments) {
    return { error: "This order is already fully paid — nothing left to charge." };
  }

  const installmentNumber = order.installments_paid + 1;
  const reference = `order_${order.id}_inst${installmentNumber}_${Date.now()}`;

  try {
    await recordChargeAttempt(order.id, {
      installmentNumber,
      amountCents: order.installment_amount_cents,
      reference,
    });
  } catch (err) {
    return { error: err.message };
  }

  let result;
  try {
    result = await chargeAuthorization({
      authorization_code: order.paystack_authorization_code,
      email: order.client_email,
      amount: order.installment_amount_cents,
      reference,
    });
  } catch (err) {
    await finalizeCharge(reference, { status: "failed" });
    revalidatePath(`/admin/orders/${id}`);
    return { error: err.message };
  }

  // Finalize immediately from this direct response so the UI updates without
  // waiting on the webhook — finalizeCharge is idempotent, so if the webhook
  // also fires for this reference later, it's a harmless no-op.
  if (result.status === "success") {
    await finalizeCharge(reference, { status: "paid" });
    revalidatePath(`/admin/orders/${id}`);
    return { success: true };
  }

  await finalizeCharge(reference, { status: "failed" });
  revalidatePath(`/admin/orders/${id}`);
  return { error: `Charge failed: ${result.gateway_response || result.status}` };
}
