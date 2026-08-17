-- Prevents two concurrent charge attempts from ever both reaching Paystack
-- for the same instalment of the same order — e.g. an admin double-clicking
-- "Charge instalment", a client double-submitting "Pay now", or a network
-- retry re-firing the request. The reference is timestamp-based, so without
-- this, two near-simultaneous attempts would each get their own unique
-- reference and both proceed to actually charge the card.
--
-- A partial index (only WHERE status = 'pending') rather than a plain unique
-- constraint on (order_id, installment_number): a failed attempt still moves
-- out of 'pending' first, so retrying after a genuine failure keeps working
-- — only two *simultaneously pending* attempts for the same instalment are
-- blocked.
create unique index order_charges_pending_unique_idx
  on public.order_charges (order_id, installment_number)
  where status = 'pending';
