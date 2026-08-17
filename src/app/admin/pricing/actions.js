"use server";

import { revalidatePath } from "next/cache";
import { updateServicePricing } from "@/lib/pricing";

export async function updatePricingAction(prevState, formData) {
  const serviceKey = formData.get("serviceKey")?.toString();
  const basePriceRand = Number(formData.get("basePriceRand"));
  const salePriceRandRaw = formData.get("salePriceRand")?.toString().trim();
  const salePriceRand = salePriceRandRaw ? Number(salePriceRandRaw) : null;
  const saleStartsAtRaw = formData.get("saleStartsAt")?.toString();
  const saleEndsAtRaw = formData.get("saleEndsAt")?.toString();
  const saleStartsAt = saleStartsAtRaw ? new Date(saleStartsAtRaw).toISOString() : null;
  const saleEndsAt = saleEndsAtRaw ? new Date(saleEndsAtRaw).toISOString() : null;

  try {
    await updateServicePricing(serviceKey, {
      basePriceRand,
      salePriceRand,
      saleStartsAt,
      saleEndsAt,
    });
  } catch (err) {
    // redirect() throws internally (e.g. requireAdminSession bouncing an
    // expired session to /admin/login) — must not be swallowed as a form error.
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    return { error: err.message };
  }

  revalidatePath("/admin/pricing");
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}
