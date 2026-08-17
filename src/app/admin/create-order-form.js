"use client";

import { useActionState, useState } from "react";
import { createOrder } from "./actions";
import { Field, inputClass, buttonPrimaryClass, errorTextClass } from "@/app/admin/ui";

function formatRand(n) {
  return `R${n.toLocaleString("en-ZA", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function CreateOrderForm({ services }) {
  const [state, action, pending] = useActionState(createOrder, undefined);
  const [serviceKey, setServiceKey] = useState(services[0].key);
  const [planKey, setPlanKey] = useState(services[0].plans[0].key);

  const service = services.find((s) => s.key === serviceKey);
  const plan = service.plans.find((p) => p.key === planKey) ?? service.plans[0];
  const isCustom = serviceKey === "custom";

  function handleServiceChange(e) {
    const next = services.find((s) => s.key === e.target.value);
    setServiceKey(next.key);
    setPlanKey(next.plans[0].key);
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Client name" htmlFor="clientName">
          <input
            id="clientName"
            name="clientName"
            placeholder="e.g. Thabo Mokoena"
            required
            className={inputClass}
          />
        </Field>
        <Field label="WhatsApp number or email" htmlFor="clientContact">
          <input
            id="clientContact"
            name="clientContact"
            placeholder="e.g. +27 82 123 4567"
            required
            className={inputClass}
          />
        </Field>
      </div>

      <Field
        label="Client email"
        htmlFor="clientEmail"
        hint="Required — Paystack needs it to process payment."
      >
        <input
          id="clientEmail"
          name="clientEmail"
          type="email"
          placeholder="client@example.com"
          required
          className={inputClass}
        />
      </Field>

      <Field label="What are you building for them?" htmlFor="serviceDescription">
        <textarea
          id="serviceDescription"
          name="serviceDescription"
          placeholder="e.g. 5-page business website with a contact form"
          required
          rows={3}
          className={inputClass}
        />
      </Field>

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

        <Field label="Payment plan" htmlFor="paymentPlan">
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
            placeholder="e.g. 4500"
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

      {state?.error && (
        <p role="alert" className={errorTextClass}>
          {state.error}
        </p>
      )}

      <button disabled={pending} type="submit" className={buttonPrimaryClass}>
        {pending ? "Creating…" : "Create order"}
      </button>
    </form>
  );
}
