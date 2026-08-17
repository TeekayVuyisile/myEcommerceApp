"use client";

import { useActionState } from "react";
import {
  updateStatus,
  updatePreviewUrl,
  updateClientEmail,
  updateClientDetailsAction,
} from "./actions";
import {
  Field,
  inputClass,
  buttonSecondaryClass,
  errorTextClass,
  successTextClass,
} from "@/app/admin/ui";

function SaveFeedback({ state }) {
  if (state?.success) return <span className={successTextClass}>Saved.</span>;
  if (state?.error) return <span className="text-sm text-red-600 dark:text-red-400">{state.error}</span>;
  return null;
}

export default function OrderManageForm({ order, statuses }) {
  const [statusState, statusAction, statusPending] = useActionState(
    updateStatus,
    undefined
  );
  const [previewState, previewAction, previewPending] = useActionState(
    updatePreviewUrl,
    undefined
  );
  const [emailState, emailAction, emailPending] = useActionState(
    updateClientEmail,
    undefined
  );
  const [detailsState, detailsAction, detailsPending] = useActionState(
    updateClientDetailsAction,
    undefined
  );

  return (
    <div className="flex flex-col divide-y divide-card-border">
      <form action={detailsAction} className="flex flex-col gap-4 pb-6 first:pt-0">
        <input type="hidden" name="id" value={order.id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Client name" htmlFor="clientName">
            <input
              key={order.client_name}
              id="clientName"
              name="clientName"
              defaultValue={order.client_name ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="WhatsApp / contact" htmlFor="clientContact">
            <input
              key={order.client_contact}
              id="clientContact"
              name="clientContact"
              defaultValue={order.client_contact ?? ""}
              placeholder="WhatsApp number or email"
              className={inputClass}
            />
          </Field>
        </div>
        <div className="flex items-center gap-3">
          <button disabled={detailsPending} type="submit" className={buttonSecondaryClass}>
            {detailsPending ? "Saving…" : "Save details"}
          </button>
          <SaveFeedback state={detailsState} />
        </div>
      </form>

      <form action={statusAction} className="flex flex-col gap-4 py-6">
        <input type="hidden" name="id" value={order.id} />
        <Field label="Status" htmlFor="status">
          <select
            key={order.status}
            id="status"
            name="status"
            defaultValue={order.status}
            className={inputClass}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </Field>
        <div className="flex items-center gap-3">
          <button disabled={statusPending} type="submit" className={buttonSecondaryClass}>
            {statusPending ? "Saving…" : "Update status"}
          </button>
          <SaveFeedback state={statusState} />
        </div>
      </form>

      <form action={previewAction} className="flex flex-col gap-4 py-6">
        <input type="hidden" name="id" value={order.id} />
        <Field label="Preview URL" htmlFor="previewUrl" hint="Shown to the client once set.">
          <input
            key={order.preview_url}
            id="previewUrl"
            name="previewUrl"
            defaultValue={order.preview_url ?? ""}
            placeholder="https://…"
            className={inputClass}
          />
        </Field>
        <div className="flex items-center gap-3">
          <button disabled={previewPending} type="submit" className={buttonSecondaryClass}>
            {previewPending ? "Saving…" : "Save preview URL"}
          </button>
          <SaveFeedback state={previewState} />
        </div>
      </form>

      <form action={emailAction} className="flex flex-col gap-4 pt-6 last:pb-0">
        <input type="hidden" name="id" value={order.id} />
        <Field
          label="Client email"
          htmlFor="clientEmail"
          hint="Used by Paystack for the payment receipt."
        >
          <input
            key={order.client_email}
            id="clientEmail"
            name="clientEmail"
            type="email"
            defaultValue={order.client_email ?? ""}
            placeholder="client@example.com"
            className={inputClass}
          />
        </Field>
        <div className="flex items-center gap-3">
          <button disabled={emailPending} type="submit" className={buttonSecondaryClass}>
            {emailPending ? "Saving…" : "Save email"}
          </button>
          <SaveFeedback state={emailState} />
        </div>
      </form>
    </div>
  );
}
