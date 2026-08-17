import { notFound } from "next/navigation";
import { getOrderByToken } from "@/lib/dal";
import PayButton from "./pay-button";
import ThemeToggle from "@/components/theme-toggle";

export const metadata = {
  robots: { index: false, follow: false },
};

const STEP_ORDER = ["pending", "in_progress", "preview_ready", "paid", "delivered"];

const STEP_LABELS = {
  pending: "Order received",
  in_progress: "Building your site",
  preview_ready: "Preview ready",
  paid: "Paid",
  delivered: "Delivered",
};

const STEP_DESCRIPTIONS = {
  pending: "We've got your order and will start soon.",
  in_progress: "Your site is being built right now.",
  preview_ready: "Take a look below and pay when you're happy.",
  paid: "Thanks — payment received.",
  delivered: "Everything's been handed over. Enjoy!",
};

function formatRand(cents) {
  return `R${(cents / 100).toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6M10 14 21 3" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function StatusTimeline({ status }) {
  const currentIndex = STEP_ORDER.indexOf(status);

  return (
    <ol className="flex flex-col">
      {STEP_ORDER.map((step, i) => {
        const state = i < currentIndex ? "done" : i === currentIndex ? "current" : "upcoming";
        const isLast = i === STEP_ORDER.length - 1;

        return (
          <li key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  state === "done"
                    ? "bg-accent text-accent-foreground"
                    : state === "current"
                      ? "border-2 border-accent bg-background text-accent"
                      : "border-2 border-card-border bg-background text-muted-foreground"
                }`}
              >
                {state === "done" ? <CheckIcon /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
              </span>
              {!isLast && (
                <span
                  className={`w-px flex-1 ${state === "done" ? "bg-accent" : "bg-card-border"}`}
                  style={{ minHeight: "1.5rem" }}
                />
              )}
            </div>
            <div className={isLast ? "pb-0" : "pb-5"}>
              <p
                className={`text-sm font-medium ${
                  state === "upcoming" ? "text-muted-foreground" : "text-foreground"
                }`}
              >
                {STEP_LABELS[step]}
              </p>
              {state === "current" && (
                <p className="mt-0.5 text-xs text-muted-foreground">{STEP_DESCRIPTIONS[step]}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default async function OrderPage({ params }) {
  const { token } = await params;
  const order = await getOrderByToken(token);
  if (!order) notFound();

  const canPay = order.status === "preview_ready";
  const isPaid = order.status === "paid" || order.status === "delivered";
  const isCancelled = order.status === "cancelled";
  const isMaintenance = order.service_type === "maintenance";
  const hasRemainingInstalments =
    order.total_installments > 1 && order.installments_paid < order.total_installments;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-xl items-center justify-between px-4 pt-6">
        <span className="text-sm font-semibold tracking-tight">Teekay Web Studio</span>
        <ThemeToggle />
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10">
        <div className="rounded-2xl border border-card-border bg-card p-6 shadow-sm sm:p-8">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {isMaintenance ? "Payment request" : "Order status"}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Hi {order.client_name},</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isMaintenance
              ? "Here's a payment request from Teekay Web Studio."
              : "Here's where things stand with your order."}
          </p>

          {isCancelled ? (
            <div className="mt-6 flex items-start gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              <InfoIcon />
              <span>This order was cancelled. Message us on WhatsApp if you have any questions.</span>
            </div>
          ) : isMaintenance ? (
            <p className="mt-4 text-sm text-muted-foreground">
              {isPaid ? "Paid — thank you!" : "Awaiting your payment below."}
            </p>
          ) : (
            <div className="mt-6">
              <StatusTimeline status={order.status} />
            </div>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-card-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="text-base font-semibold">
            {isMaintenance ? "What this is for" : "What we're building"}
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">
            {order.service_description}
          </p>

          {order.preview_url && order.status !== "pending" && (
            <a
              href={order.preview_url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-card-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <ExternalLinkIcon />
              View live preview
            </a>
          )}
        </div>

        {!isCancelled && (
          <div className="mt-6 rounded-2xl border border-card-border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="text-base font-semibold">Payment</h2>

            {order.total_installments > 1 && (
              <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Instalment {Math.min(order.installments_paid + 1, order.total_installments)} of{" "}
                  {order.total_installments}
                </span>
                <span>{formatRand(order.amount_cents)} total</span>
              </div>
            )}

            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {formatRand(
                order.total_installments > 1 ? order.installment_amount_cents : order.amount_cents
              )}
              <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                {order.currency}
              </span>
            </p>

            {canPay && (
              <div className="mt-5">
                <PayButton token={token} />
                <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <LockIcon />
                  Secure checkout via Paystack
                </p>
              </div>
            )}

            {isPaid && (
              <div className="mt-5">
                <p className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircleIcon />
                  Payment received — thank you!
                </p>
                {hasRemainingInstalments && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {order.installments_paid} of {order.total_installments} instalments paid so
                    far — we&apos;ll take care of the rest, no action needed from you.
                  </p>
                )}
              </div>
            )}

            {!canPay && !isPaid && (
              <p className="mt-4 text-sm text-muted-foreground">
                You&apos;ll be able to pay once your preview is ready.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
