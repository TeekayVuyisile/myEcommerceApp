import { verifyWebhookSignature } from "@/lib/paystack";
import { finalizeCharge } from "@/lib/dal";

export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    const auth = event.data.authorization;
    await finalizeCharge(event.data.reference, {
      status: "paid",
      authorizationCode: auth?.reusable ? auth.authorization_code : null,
    });
  } else if (event.event === "charge.failed") {
    await finalizeCharge(event.data.reference, { status: "failed" });
  }

  return new Response("OK", { status: 200 });
}
