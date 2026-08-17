-- Recurring/instalment billing support.
--
-- orders gains structured plan info (so amounts are always computed from the
-- shared services/pricing source of truth, never typed by hand) plus
-- instalment tracking. order_charges is an audit log of every individual
-- charge attempt (the first hosted-checkout payment AND every subsequent
-- manual "charge next instalment" click), which is what lets the admin see
-- exactly which instalments are paid and avoid double-charging a client
-- who's already finished their plan.

alter table public.orders
  add column service_type text check (service_type in ('website', 'ecommerce', 'custom')),
  add column payment_plan text check (payment_plan in ('once_off', '3_month', '6_month', '12_month', 'negotiable')),
  add column installment_amount_cents integer check (installment_amount_cents > 0),
  add column total_installments integer not null default 1 check (total_installments > 0),
  add column installments_paid integer not null default 0 check (installments_paid >= 0),
  add column paystack_authorization_code text,
  add column next_charge_due_at date;

create table public.order_charges (
  id                 uuid primary key default gen_random_uuid(),
  order_id           uuid not null references public.orders(id) on delete cascade,
  installment_number integer not null check (installment_number > 0),
  amount_cents       integer not null check (amount_cents > 0),
  status             text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  paystack_reference text not null unique,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index order_charges_order_id_idx on public.order_charges (order_id);

-- Reuses the set_updated_at() function created in 001_orders.sql.
create trigger order_charges_set_updated_at
before update on public.order_charges
for each row execute function public.set_updated_at();

alter table public.order_charges enable row level security;
-- Deny-all, same as orders: all access goes through server-only code using
-- the service-role key.
