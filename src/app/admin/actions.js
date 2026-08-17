"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/ssr-clients";
import { createOrder as createOrderInDal } from "@/lib/dal";
import { getResolvedServices } from "@/lib/pricing";

export async function signIn(prevState, formData) {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Invalid email or password." };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createOrder(prevState, formData) {
  const clientName = formData.get("clientName")?.toString().trim();
  const clientContact = formData.get("clientContact")?.toString().trim();
  const clientEmail = formData.get("clientEmail")?.toString().trim();
  const serviceDescription = formData
    .get("serviceDescription")
    ?.toString()
    .trim();
  const serviceType = formData.get("serviceType")?.toString();
  const paymentPlan = formData.get("paymentPlan")?.toString();
  const customAmountRandRaw = formData.get("customAmountRand");
  const customAmountRand = customAmountRandRaw
    ? Number(customAmountRandRaw)
    : undefined;

  if (!clientName || !clientContact || !serviceDescription || !serviceType || !paymentPlan) {
    return { error: "Please fill in all fields." };
  }

  if (!clientEmail || !EMAIL_PATTERN.test(clientEmail)) {
    return {
      error: "A valid client email is required — Paystack needs it to process payment.",
    };
  }

  try {
    const services = await getResolvedServices();
    await createOrderInDal({
      clientName,
      clientContact,
      clientEmail,
      serviceDescription,
      serviceType,
      paymentPlan,
      customAmountRand,
      services,
    });
  } catch (err) {
    // redirect() throws internally (e.g. requireAdminSession bouncing an
    // expired session to /admin/login) — must not be swallowed as a form error.
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    return { error: err.message };
  }

  revalidatePath("/admin");
  redirect("/admin");
}
