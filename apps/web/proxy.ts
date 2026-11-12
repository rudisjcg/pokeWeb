import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export function proxy(request: NextRequest) {
  return updateSession(request);
}

// Only the routes that depend on the session; public wiki pages stay cacheable.
export const config = {
  matcher: ["/mylist/:path*", "/auth/:path*"],
};
