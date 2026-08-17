"use server";

import { getOrderByToken, recordChargeAttempt } from "@/lib/dal";
import { initializeTransaction } from "@/lib/paystack";

// Handles the first instalment only — paid via Paystack's hosted checkout,
// since the client is doing this themselves in their browser. Later
// instalments are charged from the admin panel against the saved card
// captured from this first payment (see admin/orders/[id]/actions.js).
export async function initializePayment(token) {
  const order = await getOrderByToken(token);
  if (!order || order.status !== "preview_ready") {
    throw new Error("This order is not currently payable.");
  }
  if (!order.client_email) {
    throw new Error(
      "This order is missing a client email — add one in the admin panel before requesting payment."
    );
  }

  const installmentNumber = order.installments_paid + 1;
  const reference = `order_${order.id}_inst${installmentNumber}_${Date.now()}`;

  await recordChargeAttempt(order.id, {
    installmentNumber,
    amountCents: order.installment_amount_cents,
    reference,
  });

  const { authorization_url } = await initializeTransaction({
    email: order.client_email,
    amount: order.installment_amount_cents,
    reference,
    callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order/${token}?payment=callback`,
  });

  return { authorization_url };
}
