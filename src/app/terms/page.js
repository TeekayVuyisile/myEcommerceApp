import { LegalPage, Section, List } from "@/components/legal-page";

export const metadata = {
  title: "Terms of Service — Teekay Web Studio",
  description: "Terms of Service for web development services provided by Teekay Web Studio.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updatedDate="15 August 2026">
      <Section title="1. Who we are">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern the web
          development services offered on this website by Teekay Vuyisile
          Manale, trading as Teekay Web Studio (&quot;I&quot;,
          &quot;me&quot;, &quot;my&quot;), an individual freelance web
          developer based in South Africa. Teekay Web Studio is not
          currently a registered company — it&apos;s a trading name I
          operate under as an individual. By messaging me to discuss a
          project, ordering a service, or paying through this site, you
          agree to these Terms.
        </p>
      </Section>

      <Section title="2. Services offered">
        <p>
          I offer three types of services, described in more detail (with
          current pricing) on the homepage:
        </p>
        <List
          items={[
            "Website — a custom-built, mobile-friendly website.",
            "E-commerce Website — a full online store with order management built in.",
            "Custom Web App — bespoke work, scoped and priced individually.",
          ]}
        />
        <p>
          Pricing shown on the homepage may change over time. The price and
          scope that apply to your project are whatever we agree on when you
          place your order.
        </p>
      </Section>

      <Section title="3. How an order works">
        <p>
          Projects start with a conversation, usually over WhatsApp, about
          what you need. I then build the project and send you a private
          link with a live, working preview. You can request changes to
          that preview as many times as needed — there is no limit on
          revision rounds before you approve it. You only pay once
          you&apos;re satisfied with the result, through a secure payment
          link on this site. Full handover (final files, deployment to your
          domain) happens after payment is received.
        </p>
      </Section>

      <Section title="4. Payment">
        <p>
          Prices are in South African Rand (ZAR). Payments are processed by
          Paystack, a third-party payment provider. I never see or store
          your card details — they&apos;re entered directly with Paystack.
          Depending on the service, you may pay once-off or in the monthly
          instalments described on the homepage at the time of your order.
        </p>
      </Section>

      <Section title="5. Payment plans and missed payments">
        <p>
          If you&apos;re on an instalment plan and a payment is missed,
          you&apos;ll have a 7-day grace period from the due date to make
          it. If payment still hasn&apos;t been received after that, I may
          suspend access to the site (taking it offline) until the account
          is caught up. Access and support resume once payment is made.
        </p>
      </Section>

      <Section title="6. Domain names">
        <p>
          For the Website and E-commerce Website plans, I handle the
          initial domain name setup as part of the service. After that,
          renewing the domain each year is your responsibility — I&apos;ll
          make sure you know how before handover.
        </p>
      </Section>

      <Section title="7. Maintenance">
        <p>
          Every project includes 2 months of free maintenance after launch.
          After that, ongoing maintenance is billed monthly — R250/month for
          the Website plan, R400/month for the E-commerce plan — and covers
          reasonable support and small fixes. It&apos;s billed and paid
          separately from the original project cost.
        </p>
      </Section>

      <Section title="8. Revisions and changes after payment">
        <p>
          Revisions to the preview are unlimited and free before you
          approve and pay. Once you&apos;ve paid, that&apos;s treated as
          final approval of the work — genuine bugs or things that
          don&apos;t match what was agreed are fixed as part of normal
          support, but new features or design changes requested after
          payment are quoted and billed as separate work.
        </p>
      </Section>

      <Section title="9. Who owns the finished website">
        <p>
          Once you&apos;ve paid in full, ownership of the final
          website/code is yours. I keep the right to showcase the
          completed project in my own portfolio and on this site (e.g. in
          the &quot;See my work&quot; section) unless you ask me in writing
          not to.
        </p>
      </Section>

      <Section title="10. No guaranteed timeline">
        <p>
          Project timelines are estimates agreed on a per-project basis and
          aren&apos;t guaranteed — delays can happen due to scope changes,
          how quickly you respond with feedback, or third-party services
          outside my control (hosting, domain registrars, payment
          processing, etc.).
        </p>
      </Section>

      <Section title="11. Limitation of liability">
        <p>
          Services are provided on an as-is basis. I&apos;m not liable for
          indirect or consequential losses, outages caused by third-party
          services (hosting providers, domain registrars, Paystack,
          WhatsApp/Meta), or issues arising from content or information you
          supply. My total liability for any project is capped at the
          amount you paid for that project.
        </p>
      </Section>

      <Section title="12. Changes to these Terms">
        <p>
          I may update these Terms from time to time. Continuing to use
          this site or order services after changes are posted means you
          accept the updated Terms.
        </p>
      </Section>

      <Section title="13. Governing law">
        <p>These Terms are governed by the laws of the Republic of South Africa.</p>
      </Section>

      <Section title="14. Contact">
        <p>
          Questions about these Terms? Email{" "}
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
