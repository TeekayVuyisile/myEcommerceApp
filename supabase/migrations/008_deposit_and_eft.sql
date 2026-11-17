-- 30% deposit + manual EFT payments.
--
-- deposit_cents: set on every new standard order (null = legacy order, which
-- keeps equal-instalment behaviour). The full schedule is derived from
-- amount_cents + total_installments (see src/lib/payments.js), so only the
-- deposit itself needs storing.
--
-- order_charges.method: 'card' (Paystack) or 'eft' (admin-confirmed bank
-- transfer). EFT charges carry no Paystack fee, so revenue maths needs to
-- tell them apart.

alter table public.orders
  add column deposit_cents integer check (deposit_cents is null or deposit_cents > 0);

alter table public.order_charges
  add column method text not null default 'card' check (method in ('card', 'eft'));
