"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import MotionLink from "@/components/motion-link";

function formatRand(amount) {
  return `R${amount.toLocaleString("en-ZA", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0 text-accent"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function formatSaleDate(iso) {
  return new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

export default function PricingCard({
  name,
  price,
  plans,
  features,
  note,
  whatsappNumber,
  highlight,
  onSale,
  basePriceRand,
  saleEndsAt,
  discountPercent,
}) {
  // Lead with the smallest recurring commitment, not the lump sum — default
  // to the longest available plan (lowest per-month figure) instead of
  // once-off. The full total is never hidden, just shown as secondary text.
  const [planIndex, setPlanIndex] = useState(plans.length - 1);
  const plan = plans[planIndex];
  const isRecurring = plan.installments > 1;

  function whatsappHrefFor(planLabel) {
    const message =
      `Hi! I'd like to order the ${name} (${price})` +
      (planLabel && planLabel !== "Let's discuss"
        ? `, ${planLabel} payment plan.`
        : ".");
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`relative flex h-full flex-col rounded-2xl border bg-glass p-6 shadow-sm backdrop-blur-xl backdrop-saturate-150 transition-shadow hover:shadow-lg ${
        highlight ? "border-accent shadow-accent/10" : "border-glass-border"
      }`}
    >
      {highlight && (
        <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          Most popular
        </span>
      )}

      <h3 className="text-lg font-semibold text-foreground">{name}</h3>
      {onSale && (
        <div className="mt-1 flex items-center gap-2">
          <p className="text-sm text-muted-foreground line-through">
            {formatRand(basePriceRand)}
          </p>
          {discountPercent != null && (
            <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-accent-foreground">
              -{discountPercent}%
            </span>
          )}
        </div>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={planIndex}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
        >
          <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            {plan.amountRand != null
              ? `${formatRand(plan.amountRand)}${isRecurring ? "/mo" : ""}`
              : price}
          </p>
          {isRecurring && plan.amountRand != null && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {price} total over {plan.installments} months
            </p>
          )}
        </motion.div>
      </AnimatePresence>
      {onSale && (
        <span className="mt-1.5 inline-flex w-fit items-center rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
          {discountPercent != null ? `${discountPercent}% off` : "Sale"}
          {saleEndsAt ? ` — ends ${formatSaleDate(saleEndsAt)}` : ""}
        </span>
      )}

      <ul className="mt-5 flex flex-1 flex-col gap-2.5 text-left text-sm text-muted-foreground">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <CheckIcon />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {plans.length > 1 && (
        <div className="mt-5 flex flex-col gap-2 border-t border-glass-border pt-5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Payment plan
          </span>
          <div className="flex flex-wrap gap-2">
            {plans.map((p, i) => (
              <motion.button
                key={p.label}
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={() => setPlanIndex(i)}
                className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  i === planIndex
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-glass-border text-muted-foreground hover:border-accent hover:text-accent"
                }`}
              >
                {p.label}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {note && <p className="mt-4 text-xs text-muted-foreground">{note}</p>}

      <MotionLink
        href={whatsappHrefFor(plan.label)}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-6 inline-flex cursor-pointer items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          highlight
            ? "bg-accent text-accent-foreground hover:opacity-90"
            : "border border-glass-border text-foreground hover:border-accent hover:text-accent"
        }`}
      >
        Choose {name}
      </MotionLink>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        No payment until you approve the finished preview.
      </p>
    </motion.div>
  );
}
