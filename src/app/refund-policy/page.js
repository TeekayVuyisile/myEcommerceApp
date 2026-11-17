import { LegalPage, Section } from "@/components/legal-page";

export const metadata = {
  title: "Refund Policy — Teekay Web Studio",
  description: "Refund Policy for web development services provided by Teekay Web Studio.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund Policy" updatedDate="17 November 2026">
      <Section title="1. Our approach">
        <p>
          A 30% deposit starts every project. I then build, you review a
          live, working preview and request as many changes as you need, and
          the balance is only due once you&apos;ve approved the result. By
          the time you pay the balance, you&apos;ve already seen exactly
          what you&apos;re paying for.
        </p>
      </Section>

      <Section title="2. The deposit">
        <p>
          If you cancel before I&apos;ve started work on your project, your
          deposit is refunded in full. Once I&apos;ve started building, the
          deposit is non-refundable, because it covers design and
          development time already spent. If I&apos;m unable to deliver the
          project you ordered, I&apos;ll refund your deposit in full.
        </p>
      </Section>

      <Section title="3. No refunds after you approve and pay the balance">
        <p>
          Since the balance is only paid after you&apos;ve reviewed and
          approved the finished preview, payments made after approval are
          final. There isn&apos;t a &quot;buyer&apos;s remorse&quot; refund
          window, because you were never asked to pay the balance blind.
        </p>
      </Section>

      <Section title="4. What happens if something's wrong">
        <p>
          If something breaks, or the delivered site doesn&apos;t actually
          match what you approved in the preview, that&apos;s not a refund
          situation — it&apos;s a fix. Message me on WhatsApp and I&apos;ll
          correct it as part of normal support at no extra charge.
        </p>
      </Section>

      <Section title="5. Payment plans">
        <p>
          For instalment plans, each payment you&apos;ve made covers work
          and service already delivered up to that point, so past
          instalments aren&apos;t refundable. If you want to stop paying
          future instalments, see the Terms of Service for what happens to
          site access.
        </p>
      </Section>

      <Section title="6. Maintenance fees">
        <p>
          Monthly maintenance fees (billed after your free 2-month period)
          cover support made available during that month. Once a
          maintenance month has passed, that fee isn&apos;t refundable,
          since the support was available to you during that period
          whether or not you used it.
        </p>
      </Section>

      <Section title="7. EFT payments">
        <p>
          If you pay by EFT, please use the payment reference shown on your
          order link. If you pay the wrong amount or use the wrong
          reference, contact me and I&apos;ll sort it out — any genuine
          overpayment is refunded to the account it came from.
        </p>
      </Section>

      <Section title="8. Contact">
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
