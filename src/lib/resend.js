import "server-only";
import { Resend } from "resend";

function formatRand(cents) {
  return `R${(cents / 100).toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export async function sendInstalmentReminderEmail(dueOrders) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const rows = dueOrders
    .map(
      (o) =>
        `<li><strong>${o.client_name}</strong> — instalment ${o.installments_paid + 1} of ${o.total_installments}, ${formatRand(o.installment_amount_cents)} (due ${o.next_charge_due_at})</li>`
    )
    .join("");

  await resend.emails.send({
    // Resend's default sandbox sender — works without verifying a domain,
    // as long as it's sending to the account owner's own verified email.
    from: "Teekay Web Studio <onboarding@resend.dev>",
    to: process.env.REMINDER_EMAIL_TO,
    subject: `${dueOrders.length} client instalment${dueOrders.length === 1 ? "" : "s"} due today`,
    html: `<p>The following clients have an instalment due — charge them from the order's admin page when ready:</p><ul>${rows}</ul>`,
  });
}
