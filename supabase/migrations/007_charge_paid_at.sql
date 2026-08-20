-- order_charges had no dedicated "when did this succeed" timestamp — the
-- admin panel was borrowing updated_at, which also moves on other edits.
-- paid_at is set once, exactly when finalizeCharge() flips a charge to paid.

alter table public.order_charges
  add column paid_at timestamptz;
