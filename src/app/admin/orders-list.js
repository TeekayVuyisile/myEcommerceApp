"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { StatusBadge, STATUS_LABELS, formatRand } from "@/app/admin/ui";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  ...Object.keys(STATUS_LABELS).map((value) => ({ value, label: STATUS_LABELS[value] })),
];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-muted-foreground transition-colors group-hover:text-accent"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-dashed border-card-border px-6 py-12 text-center">
      <p className="text-sm font-medium text-foreground">No orders yet</p>
      <p className="text-sm text-muted-foreground">
        Click &quot;New order&quot; above once you&apos;ve chatted with a client on WhatsApp.
      </p>
    </div>
  );
}

function NoResults({ onClear }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-card-border px-6 py-12 text-center">
      <p className="text-sm font-medium text-foreground">No orders match your filters</p>
      <p className="text-sm text-muted-foreground">Try a different search term or status.</p>
      <button
        type="button"
        onClick={onClear}
        className="mt-1 cursor-pointer text-sm font-medium text-accent hover:underline"
      >
        Clear filters
      </button>
    </div>
  );
}

export default function OrdersList({ orders }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      if (!q) return true;
      const haystack = [
        order.client_name,
        order.client_contact,
        order.client_email,
        order.service_description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [orders, query, statusFilter]);

  function clearFilters() {
    setQuery("");
    setStatusFilter("all");
  }

  if (orders.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <SearchIcon />
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, contact or description…"
          aria-label="Search orders"
          className="w-full rounded-lg border border-card-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setStatusFilter(f.value)}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              statusFilter === f.value
                ? "border-accent bg-accent text-accent-foreground"
                : "border-card-border text-muted-foreground hover:border-accent hover:text-accent"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Showing {filtered.length} of {orders.length} order{orders.length === 1 ? "" : "s"}
      </p>

      <div className="mt-3">
        {filtered.length === 0 ? (
          <NoResults onClear={clearFilters} />
        ) : (
          <ul className="flex flex-col gap-3">
            {filtered.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-card-border bg-card p-4 shadow-sm transition-colors hover:border-accent sm:p-5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate font-medium text-foreground">
                        {order.client_name}
                      </span>
                      {order.service_type === "maintenance" && (
                        <span className="inline-flex shrink-0 items-center rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                          Maintenance
                        </span>
                      )}
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {order.service_description}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/80">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-sm font-semibold text-foreground">
                      {formatRand(order.amount_cents)}
                    </span>
                    {order.total_installments > 1 && (
                      <span className="text-xs text-muted-foreground">
                        {order.installments_paid}/{order.total_installments} paid
                      </span>
                    )}
                  </div>
                  <ChevronRightIcon />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
