import { createServiceClient } from "@/lib/supabase/service-client";

// Called daily by the GitHub Actions workflow so the Supabase free-tier
// project never goes 7 days without an API request (which would auto-pause it).
export async function GET(request) {
  const secret = request.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("orders").select("id").limit(1);
  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return Response.json({ ok: true });
}
