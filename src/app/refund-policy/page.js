import { LegalPage, Section } from "@/components/legal-page";

export const metadata = {
  title: "Refund Policy — Teekay Web Studio",
  description: "Refund Policy for web development services provided by Teekay Web Studio.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund Policy" updatedDate="15 August 2026">
      <Section title="1. Our approach">
        <p>
          Unlike most freelance work, you never pay upfront for a project.
          I build first, you review a live, working preview, and you only
          pay once you&apos;ve approved it. Because of that, by the time
          any payment happens, you&apos;ve already seen exactly what
          you&apos;re paying for.
        </p>
      </Section>

      <Section title="2. No refunds after payment">
        <p>
          Since payment only happens after you&apos;ve reviewed and
          approved the finished preview, all payments are final. There
          isn&apos;t a &quot;buyer&apos;s remorse&quot; refund window,
          because you were never asked to pay blind in the first place.
        </p>
      </Section>

      <Section title="3. What happens if something's wrong">
        <p>
          If something breaks, or the delivered site doesn&apos;t actually
          match what you approved in the preview, that&apos;s not a refund
          situation — it&apos;s a fix. Message me on WhatsApp and I&apos;ll
          correct it as part of normal support at no extra charge.
        </p>
      </Section>

      <Section title="4. Payment plans">
        <p>
          For instalment plans, each payment you&apos;ve made covers work
          and service already delivered up to that point, so past
          instalments aren&apos;t refundable. If you want to stop paying
          future instalments, see the Terms of Service for what happens to
          site access.
        </p>
      </Section>

      <Section title="5. Maintenance fees">
        <p>
          Monthly maintenance fees (billed after your free 2-month period)
          cover support made available during that month. Once a
          maintenance month has passed, that fee isn&apos;t refundable,
          since the support was available to you during that period
          whether or not you used it.
        </p>
      </Section>

      <Section title="6. Before you pay, there's no risk">
        <p>
          You can walk away at any point before approving and paying, at
          no cost and no obligation — that&apos;s the whole point of the
          model. The no-refunds rule only applies once you&apos;ve
          reviewed the work and chosen to pay for it.
        </p>
      </Section>

      <Section title="7. Contact">
        <p>
          Questions about a specific payment? Email{" "}
          <a
            href="mailto:vuyisilemanalet24@gmail.com"
            className="cursor-pointer text-accent hover:underline"
          >
            vuyisilemanalet24@gmail.com
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
