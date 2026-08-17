import Link from "next/link";

export function LegalPage({ title, updatedDate, children }) {
  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-glass-border bg-glass backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="cursor-pointer text-sm font-semibold tracking-tight hover:text-accent"
          >
            Teekay Web Studio
          </Link>
          <Link
            href="/"
            className="cursor-pointer text-sm text-muted-foreground hover:text-accent"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {updatedDate}
        </p>
        <div className="mt-10 flex flex-col gap-8">{children}</div>
      </main>

      <footer className="border-t border-glass-border bg-glass backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-2 px-6 py-8 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
          <span>© {new Date().getFullYear()} Teekay Web Studio</span>
          <div className="flex gap-4">
            <Link href="/terms" className="cursor-pointer hover:text-accent">
              Terms
            </Link>
            <Link href="/privacy" className="cursor-pointer hover:text-accent">
              Privacy
            </Link>
            <Link
              href="/refund-policy"
              className="cursor-pointer hover:text-accent"
            >
              Refunds
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-2 flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export function List({ items }) {
  return (
    <ul className="flex list-disc flex-col gap-1.5 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
