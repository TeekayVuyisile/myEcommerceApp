-- Lets the admin create standalone maintenance/support payment requests tied
-- back to an existing client's original order, reusing the exact same
-- order/order_token/Paystack/order_charges machinery already built for full
-- builds — a maintenance request is just another `orders` row with
-- service_type = 'maintenance' and its own payment link.

alter table public.orders
  add column parent_order_id uuid references public.orders(id) on delete set null;

create index orders_parent_order_id_idx on public.orders (parent_order_id);

-- Dynamically finds whatever the service_type check constraint is actually
-- named (Postgres's default-generated name isn't guaranteed) instead of
-- hardcoding a guess that could fail to match.
do $$
declare
  cname text;
begin
  select con.conname into cname
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  join pg_attribute att on att.attrelid = rel.oid and att.attnum = any(con.conkey)
  where rel.relname = 'orders' and att.attname = 'service_type' and con.contype = 'c';

  if cname is not null then
    execute format('alter table public.orders drop constraint %I', cname);
  end if;
end $$;

alter table public.orders add constraint orders_service_type_check
  check (service_type in ('website', 'ecommerce', 'custom', 'maintenance'));
