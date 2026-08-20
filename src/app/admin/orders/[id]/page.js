import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrder, getOrderCharges, getMaintenanceOrders, ORDER_STATUSES } from "@/lib/dal";
import { getResolvedServices } from "@/lib/pricing";
import OrderManageForm from "./order-manage-form";
import InstallmentPanel from "./installment-panel";
import PlanEditor from "./plan-editor";
import MaintenancePanel from "./maintenance-panel";
import DeleteOrderForm from "./delete-order-form";
import AdminHeader from "@/app/admin/admin-header";
import { Card, StatusBadge, formatRand } from "@/app/admin/ui";

function LinkIcon() {
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
      className="shrink-0 text-muted-foreground"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const isMaintenance = order.service_type === "maintenance";

  const [charges, services, maintenanceOrders, parentOrder] = await Promise.all([
    getOrderCharges(id),
    getResolvedServices(),
    getMaintenanceOrders(id),
    order.parent_order_id ? getOrder(order.parent_order_id) : Promise.resolve(null),
  ]);
  const orderUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/order/${order.order_token}`;

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <AdminHeader
        backHref="/admin"
        eyebrow={isMaintenance ? "Maintenance charge" : "Order"}
        title={order.client_name}
        subtitle={order.client_contact}
        right={<StatusBadge status={order.status} />}
      />

      <div className="flex flex-col gap-6">
        {parentOrder && (
          <Link
            href={`/admin/orders/${parentOrder.id}`}
            className="text-sm text-accent underline-offset-2 hover:underline"
          >
            ← Part of {parentOrder.client_name}&apos;s original order
          </Link>
        )}

        <Card title="Order details">
          <p className="whitespace-pre-wrap text-sm text-foreground">
            {order.service_description}
          </p>
          <p className="mt-3 text-sm">
            <span className="text-muted-foreground">Amount: </span>
            <span className="font-semibold text-foreground">
              {formatRand(order.amount_cents)} {order.currency}
            </span>
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-card-border bg-background px-3 py-2">
            <LinkIcon />
            <a
              href={orderUrl}
              className="min-w-0 flex-1 truncate text-sm text-accent underline-offset-2 hover:underline"
            >
              {orderUrl}
            </a>
          </div>
        </Card>

        <Card
          title="Order settings"
          description="Client details, status, preview link and billing email."
        >
          <OrderManageForm order={order} statuses={ORDER_STATUSES} />
        </Card>

        {!isMaintenance && (
          <Card
            title="Service & plan"
            description="Locked once a payment has been made on this order."
          >
            <PlanEditor
              key={`${order.service_type}-${order.payment_plan}`}
              order={order}
              services={services}
            />
          </Card>
        )}

        <Card title="Payment plan">
          <InstallmentPanel order={order} charges={charges} />
        </Card>

        <Card
          title="Maintenance"
          description="One-off payment requests for this client — updates, fixes, or a month's maintenance fee."
        >
          <MaintenancePanel order={order} maintenanceOrders={maintenanceOrders} />
        </Card>

        <Card title="Danger zone">
          <DeleteOrderForm order={order} hasCharges={charges.length > 0} />
        </Card>
      </div>
    </main>
  );
}
