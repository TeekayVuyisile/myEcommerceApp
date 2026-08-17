import { LegalPage, Section, List } from "@/components/legal-page";

export const metadata = {
  title: "Privacy Policy — Teekay Web Studio",
  description: "Privacy Policy for web development services provided by Teekay Web Studio.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updatedDate="15 August 2026">
      <Section title="1. Who this applies to">
        <p>
          This Privacy Policy covers this website and the web development
          services described on it, operated by Teekay Vuyisile Manale,
          trading as Teekay Web Studio, an individual freelancer based in
          South Africa. It explains what personal information is
          collected, how it&apos;s used, and your rights over it.
        </p>
      </Section>

      <Section title="2. What information I collect">
        <List
          items={[
            "Your name and contact details (phone/WhatsApp number or email) — usually given when we first chat about a project.",
            "Project details — what you're asking me to build, and any files or information you share to help with that.",
            "Messages you send through the on-site chat assistant.",
          ]}
        />
        <p>
          I do not collect or store your payment card details anywhere on
          this system — see Section 4.
        </p>
      </Section>

      <Section title="3. How I use it">
        <p>
          Your information is used to create and manage your order,
          communicate with you about your project, deliver the preview
          link, and process payment once you approve the work.
        </p>
      </Section>

      <Section title="4. Payments">
        <p>
          Payments are handled entirely by Paystack, a PCI-DSS compliant
          third-party payment processor. Your card and payment details are
          entered directly with Paystack — they never pass through or get
          stored on this website or on any system I control.
        </p>
      </Section>

      <Section title="5. The on-site chat assistant">
        <p>
          The chat widget on this site sends your messages to Groq, a
          third-party AI provider, to generate a response. Please don&apos;t
          share sensitive personal information in that chat that you
          wouldn&apos;t want processed by a third-party AI service — for
          anything sensitive, prefer WhatsApp instead.
        </p>
      </Section>

      <Section title="6. WhatsApp">
        <p>
          If you contact me over WhatsApp, that conversation happens on
          WhatsApp&apos;s platform and is subject to WhatsApp/Meta&apos;s own
          privacy policy and terms, which are outside of my control.
        </p>
      </Section>

      <Section title="7. Where your data is stored">
        <p>
          Order and project information is stored in a managed database
          (Supabase). Access is restricted — order data is only readable
          through an authenticated admin session or a private link
          specific to your order, not exposed publicly.
        </p>
      </Section>

      <Section title="8. How long I keep your information">
        <p>
          I keep order and project records indefinitely for my own
          business record-keeping, unless you ask me to delete them (see
          Section 9).
        </p>
      </Section>

      <Section title="9. Your rights">
        <p>
          Under South Africa&apos;s Protection of Personal Information Act
          (POPIA), you have the right to ask what personal information I
          hold about you, request that it be corrected, or request that it
          be deleted. To do any of these, email me at the address below.
        </p>
      </Section>

      <Section title="10. Who I share your data with">
        <p>Your information may be shared with the following third parties, only as needed to provide the service:</p>
        <List
          items={[
            "Paystack — to process payments.",
            "Supabase — to store order and project data.",
            "Groq — to power the on-site chat assistant, if you use it.",
            "WhatsApp/Meta — if you choose to contact me via WhatsApp.",
          ]}
        />
      </Section>

      <Section title="11. Cookies and tracking">
        <p>
          This site currently uses local storage only to remember your
          light/dark theme preference — nothing else is tracked. If that
          changes in future (for example, adding analytics), this policy
          will be updated to reflect it.
        </p>
      </Section>

      <Section title="12. Changes to this policy">
        <p>
          I may update this Privacy Policy from time to time. The
          &quot;Last updated&quot; date at the top of this page will
          reflect the latest version.
        </p>
      </Section>

      <Section title="13. Contact">
        <p>
          Questions about this policy, or want to exercise your rights
          above? Email{" "}
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
