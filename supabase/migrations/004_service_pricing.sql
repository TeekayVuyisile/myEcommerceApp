-- Admin-editable pricing for the fixed-price packages (website, ecommerce).
-- "custom" has no fixed price (negotiated per client) so it never gets a row
-- here. Orders always snapshot their own amount_cents/installment_amount_cents
-- at creation time (see dal.js createOrder/updateServicePlan) and never read
-- this table again afterwards — so changing a base or sale price here can
-- never retroactively change what an existing client owes.

create table public.service_pricing (
  service_key      text primary key check (service_key in ('website', 'ecommerce')),
  base_price_rand  numeric(10,2) not null check (base_price_rand > 0),
  sale_price_rand  numeric(10,2) check (sale_price_rand > 0),
  sale_starts_at   timestamptz,
  sale_ends_at     timestamptz,
  updated_at       timestamptz not null default now()
);

-- Reuses the set_updated_at() function created in 001_orders.sql.
create trigger service_pricing_set_updated_at
before update on public.service_pricing
for each row execute function public.set_updated_at();

alter table public.service_pricing enable row level security;
-- Deny-all, same as orders: writes go through the admin-gated DAL, reads go
-- through a public server-only function — both use the service-role key.

insert into public.service_pricing (service_key, base_price_rand) values
  ('website', 2600),
  ('ecommerce', 7000);
