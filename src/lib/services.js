// Single source of truth for services/pricing — used by both the public
// pricing page and the admin order-creation form, so the admin never has to
// type (and possibly mistype) an amount for a standard plan.

import { scheduleInstalments, totalInstalmentsFor } from "@/lib/payments";

function roundRand(n) {
  return Math.round(n * 100) / 100;
}

function formatRand(n) {
  return `R${n.toLocaleString("en-ZA", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

// Every standard plan is a 30% deposit followed by the balance (see
// lib/payments.js). `installments` is what the client sees on the pricing card
// (1 = once-off); the stored order has at least 2 payments (deposit + balance).
// amountRand is kept as the plain total/installments figure for any older
// display code; the deposit/later figures are what the UI should show.
function planPricing(installments, totalRand) {
  if (totalRand === null) {
    return { amountRand: null, depositRand: null, laterAmountRand: null, laterCount: 0 };
  }
  const schedule = scheduleInstalments(
    Math.round(totalRand * 100),
    totalInstalmentsFor(installments)
  );
  return {
    amountRand: roundRand(totalRand / installments),
    depositRand: schedule[0] / 100,
    laterAmountRand: schedule[1] / 100,
    laterCount: schedule.length - 1,
  };
}

function plan(key, label, installments, totalRand) {
  return { key, label, installments, ...planPricing(installments, totalRand) };
}

export const SERVICES = [
  {
    key: "website",
    name: "Website",
    totalRand: 2600,
    price: "R2,600",
    features: [
      "Custom-designed, mobile-friendly website",
      "About 5 pages (e.g. Home, About, Services, Gallery, Contact)",
      "WhatsApp Integration — a click-to-chat button so visitors can message you directly",
      "Email Integration — a contact form that sends enquiries straight to your inbox",
      "I'll set up your domain name for you (you cover the domain cost)",
      "I'll set up your hosting for you (you cover the hosting cost)",
      "Basic SEO setup",
      "2 months of free maintenance after launch, then R250/month",
    ],
    plans: [
      plan("once_off", "Once-off", 1, 2600),
      plan("3_month", "3 months", 3, 2600),
      plan("6_month", "6 months", 6, 2600),
    ],
  },
  {
    key: "ecommerce",
    name: "E-commerce Website",
    totalRand: 7000,
    price: "R7,000",
    highlight: true,
    features: [
      "Everything in the Website plan (WhatsApp & Email Integration, SEO, hosting & domain setup assistance)",
      "Payment Gateway Integration — customers pay securely by card, right on your site",
      "Full order management panel",
      "Product & inventory management",
      "2 months of free maintenance after launch, then R400/month",
    ],
    plans: [
      plan("once_off", "Once-off", 1, 7000),
      plan("6_month", "6 months", 6, 7000),
      plan("12_month", "12 months", 12, 7000),
    ],
  },
  {
    key: "custom",
    name: "Custom Web App",
    totalRand: null,
    price: "Pricing negotiable",
    features: [
      "For anything beyond a standard website or store",
      "Scope, timeline and price agreed together upfront",
    ],
    plans: [plan("negotiable", "Let's discuss", 1, null)],
    note: "Message me with what you have in mind and we'll figure out the details. A 30% deposit starts the build.",
  },
];

export function getService(serviceKey) {
  return SERVICES.find((s) => s.key === serviceKey) ?? null;
}

export function getPlan(serviceKey, planKey) {
  const service = getService(serviceKey);
  return service?.plans.find((p) => p.key === planKey) ?? null;
}

// Rounded for display only — the actual charge always uses the exact rand
// amounts, never this percentage. Shared (no server-only restriction) so
// both the admin pricing form (live preview as you type) and lib/pricing.js
// (resolved price shown to clients) use the same calculation.
export function discountPercent(basePriceRand, salePriceRand) {
  if (!basePriceRand || !salePriceRand || salePriceRand >= basePriceRand) return null;
  return Math.round((1 - salePriceRand / basePriceRand) * 100);
}

// Rebuilds a service's price/plans around a different total (the current
// base or sale price from the database) instead of the totalRand baked in
// above — used by lib/pricing.js to resolve live, admin-editable pricing
// without duplicating the plan-splitting math.
export function withTotalRand(service, totalRand) {
  return {
    ...service,
    totalRand,
    price: totalRand === null ? service.price : formatRand(totalRand),
    plans: service.plans.map((p) => ({
      ...p,
      ...planPricing(p.installments, totalRand),
    })),
  };
}
