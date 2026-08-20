"use client";

import { useActionState } from "react";
import { deleteOrderAction } from "./actions";
import { buttonDangerClass, errorTextClass } from "@/app/admin/ui";

export default function DeleteOrderForm({ order, hasCharges }) {
  const [state, action, pending] = useActionState(deleteOrderAction, undefined);

  if (hasCharges) {
    return (
      <p className="text-sm text-muted-foreground">
        This order has payment history, so it can&apos;t be deleted — set its status to{" "}
        <span className="font-medium text-foreground">Cancelled</span> above instead.
      </p>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={order.id} />
      <p className="text-sm text-muted-foreground">
        No payments have been made on this order yet, so it&apos;s safe to permanently delete.
      </p>
      <button
        disabled={pending}
        type="submit"
        className={buttonDangerClass}
        onClick={(e) => {
          if (!window.confirm(`Permanently delete ${order.client_name}'s order? This can't be undone.`)) {
            e.preventDefault();
          }
        }}
      >
        {pending ? "Deleting…" : "Delete order permanently"}
      </button>
      {state?.error && <p className={errorTextClass}>{state.error}</p>}
    </form>
  );
}
