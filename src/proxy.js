import { NextResponse } from "next/server";
import { createSupabaseProxyClient } from "@/lib/supabase/ssr-clients";

// Optimistic-only check: redirects unauthenticated visitors away from
// /admin/*. Real enforcement lives in requireAdminSession() inside the DAL,
// since every admin Server Action is directly POST-reachable regardless of
// this redirect (see src/lib/dal.js).
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const { supabase, response } = createSupabaseProxyClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
