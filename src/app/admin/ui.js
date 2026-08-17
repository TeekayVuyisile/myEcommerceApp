// Shared visual primitives for the admin interface — kept in one place so
// every admin page/form stays consistent (and reuses the same design tokens
// as the public site's globals.css) without copy-pasting Tailwind strings.

export function Card({ title, description, action, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-card-border bg-card p-5 shadow-sm sm:p-6 ${className}`}
    >
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && (
              <h2 className="text-base font-semibold text-foreground">{title}</h2>
            )}
            {description && (
              <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Field({ label, htmlFor, children, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export const inputClass =
  "w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

export const buttonPrimaryClass =
  "inline-flex w-fit cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export const buttonSecondaryClass =
  "inline-flex w-fit cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-card-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export const errorTextClass =
  "rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400";

export const successTextClass = "text-sm text-emerald-600 dark:text-emerald-400";

const STATUS_STYLES = {
  pending: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-300",
  in_progress: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  preview_ready: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  delivered: "bg-accent/10 text-accent",
  cancelled: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export const STATUS_LABELS = {
  pending: "Pending",
  in_progress: "In progress",
  preview_ready: "Preview ready",
  paid: "Paid",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        STATUS_STYLES[status] ?? STATUS_STYLES.pending
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function formatRand(cents) {
  return `R${(cents / 100).toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
