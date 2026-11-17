"use server";

import { getOrderByToken, recordChargeAttempt } from "@/lib/dal";
import { initializeTransaction } from "@/lib/paystack";
import { getPayableInstalment } from "@/lib/payments";

// Card payment via Paystack's hosted checkout — the deposit (or, on a
// once-off plan, the balance after approval). Later monthly instalments are
// charged from the admin panel against the saved card captured here (see
// admin/orders/[id]/actions.js), or confirmed manually if the client pays by
// EFT instead.
export async function initializePayment(token) {
  const order = await getOrderByToken(token);
  const payable = order ? getPayableInstalment(order) : null;
  if (!order || !payable) {
    throw new Error("This order is not currently payable.");
  }
  if (!order.client_email) {
    throw new Error(
      "This order is missing a client email — add one in the admin panel before requesting payment."
    );
  }

  const reference = `order_${order.id}_inst${payable.number}_${Date.now()}`;

  await recordChargeAttempt(order.id, {
    installmentNumber: payable.number,
    amountCents: payable.amountCents,
    reference,
  });

  const { authorization_url } = await initializeTransaction({
    email: order.client_email,
    amount: payable.amountCents,
    reference,
    callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order/${token}?payment=callback`,
  });

  return { authorization_url };
}
