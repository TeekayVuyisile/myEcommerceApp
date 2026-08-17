import { getServicePricingRows } from "@/lib/pricing";
import { SERVICES } from "@/lib/services";
import AdminHeader from "@/app/admin/admin-header";
import PricingForm from "./pricing-form";

export default async function AdminPricingPage() {
  const rows = await getServicePricingRows();
  const rowByKey = new Map(rows.map((r) => [r.service_key, r]));
  const pricedServices = SERVICES.filter((s) => s.totalRand !== null);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <AdminHeader
        backHref="/admin"
        eyebrow="Teekay Web Studio"
        title="Pricing"
        subtitle="Base prices and sales for your fixed-price packages. Custom work is negotiated per client, so it isn't listed here."
      />

      <div className="flex flex-col gap-6">
        {pricedServices.map((service) => {
          const row = rowByKey.get(service.key) ?? null;
          return (
            <PricingForm
              key={`${service.key}-${row?.base_price_rand}-${row?.sale_price_rand}-${row?.sale_starts_at}-${row?.sale_ends_at}`}
              service={service}
              row={row}
            />
          );
        })}
      </div>
    </main>
  );
}
