"use client";

import { useState, useTransition } from "react";
import { motion } from "motion/react";
import { initializePayment } from "./actions";

export default function PayButton({ token }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      try {
        const { authorization_url } = await initializePayment(token);
        window.location.href = authorization_url;
      } catch (e) {
        setError(e.message || "Something went wrong starting payment.");
      }
    });
  }

  return (
    <div>
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={handleClick}
        disabled={isPending}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto"
      >
        {isPending ? "Redirecting…" : "Pay now"}
      </motion.button>
      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
