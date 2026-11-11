import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-session";

export const config = {
  matcher: ["/admin/:path*"],
};

/**
 * Convenience redirect for signed-out visitors. This is NOT the security boundary:
 * every admin Server Action, loader, page and route handler independently calls
 * `assertAdmin()` (src/lib/admin-auth.ts).
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login" || pathname === "/admin/login/") {
    return NextResponse.next();
  }

  const session = await verifySessionToken(req.cookies.get(ADMIN_SESSION_COOKIE)?.value);

  if (!session) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
