import { assertAdmin } from "@/lib/admin-auth";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  await assertAdmin();
  const draft = await draftMode();
  draft.disable();
  redirect("/admin");
}
