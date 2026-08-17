import "server-only";
import crypto from "node:crypto";

const PAYSTACK_API = "https://api.paystack.co";

// Paystack South Africa's standard published local-card rate. If your actual
// negotiated rate ever differs, this is the one place to update it — every
// revenue calculation (dal.js getRevenueSummary) derives from this.
const PAYSTACK_FEE_PERCENT = 0.029;
const PAYSTACK_FEE_FLAT_CENTS = 150; // R1.50

// What Paystack keeps from a single charge of this size, in cents. Applied
// per charge (not per order) — an instalment plan pays this flat fee on
// every instalment separately, so splitting a payment into instalments costs
// slightly more in fees overall than charging it once.
export function paystackFeeCents(amountCents) {
  if (!amountCents || amountCents <= 0) return 0;
  return Math.round(amountCents * PAYSTACK_FEE_PERCENT + PAYSTACK_FEE_FLAT_CENTS);
}

export async function initializeTransaction({
  email,
  amount,
  reference,
  callback_url,
}) {
  const res = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, amount, reference, callback_url }),
  });

  const body = await res.json();
  if (!res.ok || !body.status) {
    throw new Error(body.message || "Failed to initialize Paystack transaction");
  }

  return body.data; // { authorization_url, access_code, reference }
}

// Charges a previously-saved card (from a prior successful transaction's
// reusable authorization) without the customer needing to re-enter anything.
// Used for admin-triggered instalment charges after the first payment.
export async function chargeAuthorization({
  authorization_code,
  email,
  amount,
  reference,
}) {
  const res = await fetch(`${PAYSTACK_API}/transaction/charge_authorization`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ authorization_code, email, amount, reference }),
  });

  const body = await res.json();
  if (!res.ok || !body.status) {
    throw new Error(body.message || "Failed to charge saved card");
  }

  return body.data; // { status: 'success' | 'failed' | ..., reference, ... }
}

export async function verifyTransaction(reference) {
  const res = await fetch(
    `${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    }
  );

  const body = await res.json();
  if (!res.ok || !body.status) {
    throw new Error(body.message || "Failed to verify Paystack transaction");
  }

  return body.data;
}

export function verifyWebhookSignature(rawBody, signature) {
  if (!signature) return false;
  const expected = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest("hex");

  // Constant-time comparison to avoid timing attacks.
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(signature, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
