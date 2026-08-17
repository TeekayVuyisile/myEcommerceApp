import "server-only";
import { createServiceClient } from "@/lib/supabase/service-client";
import { requireAdminSession } from "@/lib/dal";
import { SERVICES, withTotalRand, discountPercent } from "@/lib/services";

function isSaleActive(row, now) {
  if (!row?.sale_price_rand) return false;
  if (row.sale_starts_at && new Date(row.sale_starts_at) > now) return false;
  if (row.sale_ends_at && new Date(row.sale_ends_at) < now) return false;
  return true;
}

// Public — every visitor and every order-creation action needs current,
// sale-aware pricing. Never admin-gated. Orders snapshot whatever this
// returns at the moment they're created/edited (see dal.js), so changing a
// price here never touches an order that already exists.
export async function getResolvedServices() {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from("service_pricing").select("*");
  if (error) throw new Error(error.message);

  const now = new Date();
  const rowByKey = new Map((data ?? []).map((r) => [r.service_key, r]));

  return SERVICES.map((service) => {
    if (service.totalRand === null) return service; // "custom" — negotiated, no fixed price

    const row = rowByKey.get(service.key);
    const basePriceRand = row ? Number(row.base_price_rand) : service.totalRand;
    const onSale = isSaleActive(row, now);
    const effectiveRand = onSale ? Number(row.sale_price_rand) : basePriceRand;

    return {
      ...withTotalRand(service, effectiveRand),
      basePriceRand,
      onSale,
      saleEndsAt: onSale ? row.sale_ends_at : null,
      discountPercent: onSale ? discountPercent(basePriceRand, effectiveRand) : null,
    };
  });
}

// Admin-only — the raw editable rows (base price + sale window), not the
// resolved/sale-adjusted price shown to clients.
export async function getServicePricingRows() {
  await requireAdminSession();
  const supabase = createServiceClient();
  const { data, error } = await supabase.from("service_pricing").select("*");
  if (error) throw new Error(error.message);
  return data;
}

export async function updateServicePricing(
  serviceKey,
  { basePriceRand, salePriceRand, saleStartsAt, saleEndsAt }
) {
  await requireAdminSession();

  const service = SERVICES.find((s) => s.key === serviceKey);
  if (!service || service.totalRand === null) {
    throw new Error("This service doesn't have a fixed price to edit.");
  }
  if (!Number.isFinite(basePriceRand) || basePriceRand <= 0) {
    throw new Error("Enter a valid base price.");
  }
  if (salePriceRand != null) {
    if (!Number.isFinite(salePriceRand) || salePriceRand <= 0) {
      throw new Error("Enter a valid sale price, or leave it blank.");
    }
    if (salePriceRand >= basePriceRand) {
      throw new Error("Sale price should be less than the base price.");
    }
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("service_pricing").upsert({
    service_key: serviceKey,
    base_price_rand: basePriceRand,
    sale_price_rand: salePriceRand ?? null,
    sale_starts_at: saleStartsAt ?? null,
    sale_ends_at: saleEndsAt ?? null,
  });
  if (error) throw new Error(error.message);
}
