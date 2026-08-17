"use client";

import { useActionState, useState } from "react";
import { updateServicePlanAction } from "./actions";
import { Field, inputClass, buttonSecondaryClass, successTextClass } from "@/app/admin/ui";

function formatRand(n) {
  return `R${n.toLocaleString("en-ZA", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

function LockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function PlanEditor({ order, services }) {
  const [state, action, pending] = useActionState(updateServicePlanAction, undefined);
  const initialService =
    services.find((s) => s.key === order.service_type) ?? services[0];
  const [serviceKey, setServiceKey] = useState(initialService.key);
  const [planKey, setPlanKey] = useState(order.payment_plan ?? initialService.plans[0].key);

  if (order.installments_paid > 0) {
    return (
      <div className="flex items-start gap-2 rounded-lg bg-background px-3 py-3 text-sm text-muted-foreground">
        <LockIcon />
        <span>
          Plan can&apos;t be changed after a payment has been made on this
          order — cancel it and create a new one instead if the package was
          wrong.
        </span>
      </div>
    );
  }

  const service = services.find((s) => s.key === serviceKey) ?? initialService;
  const plan = service.plans.find((p) => p.key === planKey) ?? service.plans[0];
  const isCustom = serviceKey === "custom";

  function handleServiceChange(e) {
    const next = services.find((s) => s.key === e.target.value);
    setServiceKey(next.key);
    setPlanKey(next.plans[0].key);
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="id" value={order.id} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Service" htmlFor="serviceType">
          <select
            id="serviceType"
            name="serviceType"
            value={serviceKey}
            onChange={handleServiceChange}
            className={inputClass}
          >
            {services.map((s) => (
              <option key={s.key} value={s.key}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Plan" htmlFor="paymentPlan">
          <select
            id="paymentPlan"
            name="paymentPlan"
            value={planKey}
            onChange={(e) => setPlanKey(e.target.value)}
            className={inputClass}
          >
            {service.plans.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {isCustom ? (
        <Field label="Negotiated amount (ZAR)" htmlFor="customAmountRand">
          <input
            id="customAmountRand"
            name="customAmountRand"
            type="number"
            step="0.01"
            min="0"
            placeholder="Negotiated amount (ZAR)"
            defaultValue={
              order.service_type === "custom" ? order.amount_cents / 100 : ""
            }
            required
            className={inputClass}
          />
        </Field>
      ) : (
        <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm font-medium text-accent">
          {plan.installments === 1
            ? `Total: ${formatRand(plan.amountRand)}`
            : `${formatRand(plan.amountRand)}/month × ${plan.installments} = ${formatRand(
                service.totalRand
              )} total`}
          {service.onSale && " — sale price"}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button disabled={pending} type="submit" className={buttonSecondaryClass}>
          {pending ? "Saving…" : "Save plan"}
        </button>
        {state?.success && <span className={successTextClass}>Saved.</span>}
        {state?.error && (
          <span className="text-sm text-red-600 dark:text-red-400">{state.error}</span>
        )}
      </div>
    </form>
  );
}
