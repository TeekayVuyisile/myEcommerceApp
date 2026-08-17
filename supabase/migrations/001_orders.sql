create extension if not exists pgcrypto;

create table public.orders (
  id                   uuid primary key default gen_random_uuid(),
  client_name          text not null,
  client_contact       text not null,
  service_description  text not null,
  status               text not null default 'pending'
                         check (status in ('pending','in_progress','preview_ready','paid','delivered','cancelled')),
  preview_url          text,
  amount_cents         integer not null check (amount_cents > 0),
  currency             text not null default 'ZAR',
  paystack_reference   text unique,
  order_token          text not null unique,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index orders_status_idx on public.orders (status);
create index orders_order_token_idx on public.orders (order_token);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

-- Deny-all RLS: no policies for anon/authenticated. All access goes through
-- server-only code using the service-role key, which bypasses RLS.
alter table public.orders enable row level security;
