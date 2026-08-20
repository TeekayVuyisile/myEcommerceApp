"use client";

import { useActionState } from "react";
import { chargeNextInstallment } from "./actions";
import { buttonPrimaryClass, formatDate, formatRand } from "@/app/admin/ui";

const PLAN_LABELS = {
  once_off: "Once-off",
  "3_month": "3-month plan",
  "6_month": "6-month plan",
  "12_month": "12-month plan",
  negotiable: "Custom (negotiated)",
};

const CHARGE_STATUS_STYLES = {
  paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  failed: "bg-red-500/10 text-red-600 dark:text-red-400",
  pending: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-300",
};

function ChargeStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
        CHARGE_STATUS_STYLES[status] ?? CHARGE_STATUS_STYLES.pending
      }`}
    >
      {status}
    </span>
  );
}

export default function InstallmentPanel({ order, charges }) {
  const [state, action, pending] = useActionState(chargeNextInstallment, undefined);

  const fullyPaid = order.installments_paid >= order.total_installments;
  const hasCard = Boolean(order.paystack_authorization_code);
  const progressPct =
    order.total_installments > 0
      ? Math.round((order.installments_paid / order.total_installments) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-5">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <div>
          <dt className="text-muted-foreground">Plan</dt>
          <dd className="mt-0.5 font-medium text-foreground">
            {PLAN_LABELS[order.payment_plan] ?? order.payment_plan ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Total</dt>
          <dd className="mt-0.5 font-medium text-foreground">{formatRand(order.amount_cents)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Per instalment</dt>
          <dd className="mt-0.5 font-medium text-foreground">
            {formatRand(order.installment_amount_cents)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Next due</dt>
          <dd className="mt-0.5 font-medium text-foreground">
            {!fullyPaid && order.next_charge_due_at ? formatDate(order.next_charge_due_at) : "—"}
          </dd>
        </div>
      </dl>

      {order.total_installments > 1 && (
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {order.installments_paid} / {order.total_installments} instalments paid
            </span>
            {fullyPaid && (
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                Fully paid
              </span>
            )}
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {order.total_installments > 1 && (
        <div>
          {fullyPaid ? (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              All instalments have been paid — nothing left to charge.
            </p>
          ) : !hasCard ? (
            <p className="text-sm text-muted-foreground">
              Waiting on the client&apos;s first payment before you can charge
              further instalments.
            </p>
          ) : (
            <form action={action}>
              <input type="hidden" name="id" value={order.id} />
              <button disabled={pending} type="submit" className={buttonPrimaryClass}>
                {pending
                  ? "Charging…"
                  : `Charge instalment ${order.installments_paid + 1} of ${order.total_installments} (${formatRand(order.installment_amount_cents)})`}
              </button>
            </form>
          )}
          {state?.error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{state.error}</p>
          )}
          {state?.success && (
            <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
              Charged successfully.
            </p>
          )}
        </div>
      )}

      {charges.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium text-foreground">Payment history</h3>
          <ul className="flex flex-col divide-y divide-card-border overflow-hidden rounded-lg border border-card-border">
            {charges.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-3 bg-background px-3 py-2 text-sm"
              >
                <span className="text-foreground">
                  #{c.installment_number} — {formatRand(c.amount_cents)}
                  {c.status === "paid" && (
                    <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                      · paid {formatDate(c.paid_at ?? c.updated_at)}
                    </span>
                  )}
                </span>
                <ChargeStatusBadge status={c.status} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
