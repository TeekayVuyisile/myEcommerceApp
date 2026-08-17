"use client";

import { useActionState } from "react";
import { signIn } from "../actions";
import { Field, inputClass, buttonPrimaryClass, errorTextClass } from "@/app/admin/ui";
import ThemeToggle from "@/components/theme-toggle";

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, undefined);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-foreground">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-card-border bg-card p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Teekay Web Studio
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage client orders, previews and payments.
        </p>

        <form action={action} className="mt-6 flex flex-col gap-4">
          <Field label="Email" htmlFor="email">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              className={inputClass}
            />
          </Field>
          <Field label="Password" htmlFor="password">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
              className={inputClass}
            />
          </Field>

          {state?.error && (
            <p role="alert" className={errorTextClass}>
              {state.error}
            </p>
          )}

          <button disabled={pending} type="submit" className={`${buttonPrimaryClass} w-full`}>
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
