import Link from "next/link";
import { listOrders, getRevenueSummary } from "@/lib/dal";
import { getResolvedServices } from "@/lib/pricing";
import CreateOrderModal from "./create-order-modal";
import AdminHeader from "@/app/admin/admin-header";
import OrdersList from "./orders-list";
import { Card, buttonSecondaryClass, formatRand } from "@/app/admin/ui";

const ACTIVE_STATUSES = ["pending", "in_progress", "preview_ready"];
const COMPLETE_STATUSES = ["paid", "delivered"];

function StatTile({ label, value }) {
  return (
    <div className="rounded-2xl border border-card-border bg-card p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function RevenueStat({ label, value, hint, tone }) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "warning"
        ? "text-amber-600 dark:text-amber-400"
        : tone === "negative"
          ? "text-red-600 dark:text-red-400"
          : "text-foreground";

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tracking-tight ${toneClass}`}>{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function RevenueCard({ revenue }) {
  const collectedPct =
    revenue.projectedCents > 0
      ? Math.round((revenue.collectedCents / revenue.projectedCents) * 100)
      : 0;

  return (
    <Card
      title="Revenue"
      description="Based on payments actually recorded, net of Paystack's cut — not just order status."
      className="mb-8"
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
        <RevenueStat
          label="Collected"
          value={formatRand(revenue.collectedCents)}
          hint="What actually landed in your account"
          tone="positive"
        />
        <RevenueStat
          label="Awaiting"
          value={formatRand(revenue.awaitingCents)}
          hint="Still owed, after est. Paystack fees"
          tone="warning"
        />
        <RevenueStat
          label="Projected total"
          value={formatRand(revenue.projectedCents)}
          hint="If everything owed gets paid"
        />
        <RevenueStat
          label="Lost to cancellations"
          value={formatRand(revenue.lostCents)}
          hint="Unpaid balance on cancelled orders"
          tone="negative"
        />
        <RevenueStat
          label="Paid to Paystack"
          value={formatRand(revenue.paystackFeesCents)}
          hint={
            revenue.paystackFeesEstimatedCents > 0
              ? `+ ~${formatRand(revenue.paystackFeesEstimatedCents)} estimated on what's still owed`
              : "Transaction fees on money collected so far"
          }
        />
      </div>

      {revenue.projectedCents > 0 && (
        <div className="mt-6">
          <div className="h-2 w-full overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full bg-emerald-500 transition-[width] duration-300"
              style={{ width: `${collectedPct}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {collectedPct}% of projected revenue collected so far
          </p>
        </div>
      )}
    </Card>
  );
}

export default async function AdminOrdersPage() {
  const [orders, revenue, services] = await Promise.all([
    listOrders(),
    getRevenueSummary(),
    getResolvedServices(),
  ]);

  const activeCount = orders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length;
  const completeCount = orders.filter((o) => COMPLETE_STATUSES.includes(o.status)).length;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <AdminHeader
        eyebrow="Teekay Web Studio"
        title="Orders"
        subtitle={`${orders.length} order${orders.length === 1 ? "" : "s"} total`}
        actions={
          <>
            <Link href="/admin/pricing" className={buttonSecondaryClass}>
              Pricing
            </Link>
            <CreateOrderModal services={services} />
          </>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3">
        <StatTile label="Active" value={activeCount} />
        <StatTile label="Paid / delivered" value={completeCount} />
      </div>

      <RevenueCard revenue={revenue} />

      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">All orders</h2>
        <OrdersList orders={orders} />
      </div>
    </main>
  );
}
