import { assertAdmin } from "@/lib/admin-auth";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

/** Only a same-origin relative path is ever redirected to — guards against this
 *  becoming an open redirect even though the route sits behind the admin login. */
function safePath(path: string | null): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/";
  return path;
}

export async function GET(request: NextRequest) {
  await assertAdmin();
  const path = safePath(request.nextUrl.searchParams.get("path"));
  const draft = await draftMode();
  draft.enable();
  redirect(path);
}
