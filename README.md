This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Setup (order → preview → pay system)

Before running the app, a few manual, account-specific steps are required:

1. **Create a Supabase project** at [supabase.com](https://supabase.com).
2. Run the migration in `supabase/migrations/001_orders.sql` against it (SQL Editor, paste and run).
3. Seed exactly one admin user: Authentication → Users → Add user (email + password). This is your login for `/admin`.
4. **Create a Paystack account** at [paystack.com](https://paystack.com) and grab your **test mode** secret key (Settings → API Keys & Webhooks) while building/testing.
5. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase → Project Settings → API
   - `SUPABASE_SERVICE_ROLE_KEY` — same page, the **service_role** secret (never expose this to the browser)
   - `PAYSTACK_SECRET_KEY` — from step 4
   - `NEXT_PUBLIC_SITE_URL` — `http://localhost:3000` locally, your real domain in production
6. In Paystack Dashboard → Settings → API Keys & Webhooks, set the webhook URL to `<your-site-url>/api/paystack/webhook` (use an `ngrok http 3000` tunnel URL for local testing, since Paystack needs a public HTTPS endpoint to deliver webhooks to).

Once that's done: log in at `/admin`, create an order, set a `preview_url` and move its status to `preview_ready`, then open `/order/<token>` (shown on the order's admin page) to see the client-facing flow and test a payment with Paystack's test card `4084 0840 8408 4081` (any future expiry, CVV `408`, OTP `123456`).

One placeholder still needs a real value: the WhatsApp number in `src/app/page.js` (`WHATSAPP_NUMBER`).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
