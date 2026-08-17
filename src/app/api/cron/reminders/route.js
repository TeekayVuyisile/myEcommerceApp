import { getDueInstallments } from "@/lib/dal";
import { sendInstalmentReminderEmail } from "@/lib/resend";

// Called once a day by the GitHub Actions workflow (.github/workflows/daily.yml).
// Protected by a shared secret rather than admin auth, since it's triggered
// by a scheduled job with no browser session.
export async function GET(request) {
  const secret = request.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  const dueOrders = await getDueInstallments();
  if (dueOrders.length > 0) {
    await sendInstalmentReminderEmail(dueOrders);
  }

  return Response.json({ due: dueOrders.length });
}
