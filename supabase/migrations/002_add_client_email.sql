-- Paystack requires a real customer email on every transaction. client_contact
-- can be a WhatsApp number, so it's not reliable for that purpose on its own.
alter table public.orders add column client_email text;
