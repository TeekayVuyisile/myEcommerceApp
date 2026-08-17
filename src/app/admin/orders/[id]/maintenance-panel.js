"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createMaintenanceOrderAction } from "./actions";
import {
  Field,
  inputClass,
  buttonSecondaryClass,
  errorTextClass,
  StatusBadge,
  formatRand,
} from "@/app/admin/ui";

export default function MaintenancePanel({ order, maintenanceOrders }) {
  const [state, action, pending] = useActionState(createMaintenanceOrderAction, undefined);

  return (
    <div className="flex flex-col gap-5">
      {maintenanceOrders.length > 0 && (
        <ul className="flex flex-col divide-y divide-card-border overflow-hidden rounded-lg border border-card-border">
          {maintenanceOrders.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between gap-3 bg-background px-3 py-2 text-sm"
            >
              <Link
                href={`/admin/orders/${m.id}`}
                className="min-w-0 flex-1 truncate text-foreground hover:text-accent hover:underline"
              >
                {m.service_description}
              </Link>
              <span className="shrink-0 text-muted-foreground">{formatRand(m.amount_cents)}</span>
              <StatusBadge status={m.status} />
            </li>
          ))}
        </ul>
      )}

      <form action={action} className="flex flex-col gap-4">
        <input type="hidden" name="parentOrderId" value={order.id} />

        <div className="grid gap-4 sm:grid-cols-[1fr_9rem]">
          <Field label="What's this for?" htmlFor="description">
            <input
              id="description"
              name="description"
              placeholder="e.g. August maintenance, or 'Fix contact form'"
              required
              className={inputClass}
            />
          </Field>
          <Field label="Amount (ZAR)" htmlFor="amountRand">
            <input
              id="amountRand"
              name="amountRand"
              type="number"
              step="0.01"
              min="0"
              placeholder="250"
              required
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
            {pending ? "Creating…" : "Create payment request"}
          </button>
        </div>

        {state?.success && (
          <div className="rounded-lg border border-card-border bg-background px-3 py-2">
            <p className="text-xs text-muted-foreground">
              Payment link ready — send this to your client:
            </p>
            <a
              href={state.orderUrl}
              className="mt-1 block truncate text-sm text-accent underline-offset-2 hover:underline"
            >
              {state.orderUrl}
            </a>
          </div>
        )}
      </form>
    </div>
  );
}
