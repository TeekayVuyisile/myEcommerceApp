"use client";

import { useActionState, useState } from "react";
import { updatePricingAction } from "./actions";
import { discountPercent } from "@/lib/services";
import { Field, inputClass, buttonSecondaryClass, errorTextClass, successTextClass } from "@/app/admin/ui";

function toLocalInputValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function saleStatus(row) {
  if (!row?.sale_price_rand) return null;
  const now = new Date();
  const starts = row.sale_starts_at ? new Date(row.sale_starts_at) : null;
  const ends = row.sale_ends_at ? new Date(row.sale_ends_at) : null;
  const pct = discountPercent(Number(row.base_price_rand), Number(row.sale_price_rand));
  const pctLabel = pct != null ? `${pct}% off` : "Sale";

  if (starts && starts > now) {
    return { label: `${pctLabel} — scheduled from ${starts.toLocaleDateString("en-ZA")}`, tone: "upcoming" };
  }
  if (ends && ends < now) {
    return { label: "Sale ended", tone: "ended" };
  }
  return {
    label: ends ? `${pctLabel} — until ${ends.toLocaleDateString("en-ZA")}` : pctLabel,
    tone: "active",
  };
}

const STATUS_TONE_CLASS = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  upcoming: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  ended: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-300",
};

export default function PricingForm({ service, row }) {
  const [state, action, pending] = useActionState(updatePricingAction, undefined);
  const status = saleStatus(row);

  const [basePriceRand, setBasePriceRand] = useState(row?.base_price_rand ?? service.totalRand);
  const [salePriceRand, setSalePriceRand] = useState(row?.sale_price_rand ?? "");

  const livePct = discountPercent(Number(basePriceRand), Number(salePriceRand));
  const saleEntered = salePriceRand !== "" && Number(salePriceRand) > 0;
  const invalidSale = saleEntered && livePct == null;

  return (
    <div className="rounded-2xl border border-card-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">{service.name}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">Total price for the whole package.</p>
        </div>
        {status && (
          <span
            className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_TONE_CLASS[status.tone]}`}
          >
            {status.label}
          </span>
        )}
      </div>

      <form action={action} className="flex flex-col gap-4">
        <input type="hidden" name="serviceKey" value={service.key} />

        <Field label="Base price (ZAR)" htmlFor={`base-${service.key}`}>
          <input
            id={`base-${service.key}`}
            name="basePriceRand"
            type="number"
            step="0.01"
            min="0"
            value={basePriceRand}
            onChange={(e) => setBasePriceRand(e.target.value)}
            required
            className={inputClass}
          />
        </Field>

        <Field
          label="Sale price (ZAR)"
          htmlFor={`sale-${service.key}`}
          hint={
            livePct != null
              ? `That's ${livePct}% off the base price.`
              : invalidSale
                ? "Sale price should be less than the base price."
                : "Leave blank to run this package at its base price."
          }
        >
          <input
            id={`sale-${service.key}`}
            name="salePriceRand"
            type="number"
            step="0.01"
            min="0"
            value={salePriceRand}
            onChange={(e) => setSalePriceRand(e.target.value)}
            className={inputClass}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Sale starts"
            htmlFor={`starts-${service.key}`}
            hint="Optional — blank starts immediately."
          >
            <input
              id={`starts-${service.key}`}
              name="saleStartsAt"
              type="datetime-local"
              defaultValue={toLocalInputValue(row?.sale_starts_at)}
              className={inputClass}
            />
          </Field>
          <Field
            label="Sale ends"
            htmlFor={`ends-${service.key}`}
            hint="Optional — blank runs until you clear the sale price."
          >
            <input
              id={`ends-${service.key}`}
              name="saleEndsAt"
              type="datetime-local"
              defaultValue={toLocalInputValue(row?.sale_ends_at)}
              className={inputClass}
            />
          </Field>
        </div>

        {state?.error && (
          <p role="alert" className={errorTextClass}>
            {state.error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button disabled={pending} type="submit" className={buttonSecondaryClass}>
            {pending ? "Saving…" : "Save"}
          </button>
          {state?.success && <span className={successTextClass}>Saved.</span>}
        </div>
      </form>

      <p className="mt-4 text-xs text-muted-foreground">
        Orders already placed keep their original price — this only affects orders created after
        you save.
      </p>
    </div>
  );
}
