import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";
import { signOut } from "./actions";

function ArrowLeftIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7M5 12h14" />
    </svg>
  );
}

export default function AdminHeader({
  backHref,
  backLabel = "Orders",
  eyebrow,
  title,
  subtitle,
  right,
  actions,
}) {
  return (
    <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        {backHref && (
          <Link
            href={backHref}
            className="mb-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-accent"
          >
            <ArrowLeftIcon />
            {backLabel}
          </Link>
        )}
        {eyebrow && (
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {right}
        </div>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {actions}
        <ThemeToggle />
        <form action={signOut}>
          <button
            type="submit"
            className="cursor-pointer rounded-full border border-card-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
