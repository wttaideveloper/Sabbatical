"use server";

import { assertAdmin } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSingleTypeForEdit, updateSingleType, publishDocument, resolveMediaRelation } from "@/lib/strapi-admin";
import { str } from "@/lib/admin-form";
import type { SiteSetting } from "@/lib/strapi";

export async function saveSiteSettings(mode: "draft" | "publish", formData: FormData) {
  await assertAdmin();
  let logoId: number | undefined;
  try {
    logoId = await resolveMediaRelation(formData, "logo");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    redirect(`/admin/site-settings?error=${encodeURIComponent(message)}`);
  }

  const payload: Record<string, unknown> = {
    footerTagline: str(formData, "footerTagline"),
    contactEmail: str(formData, "contactEmail"),
    instagramUrl: str(formData, "instagramUrl"),
    youtubeUrl: str(formData, "youtubeUrl"),
    footerDisclaimer: str(formData, "footerDisclaimer"),
    headerBackgroundColor: str(formData, "headerBackgroundColor"),
    footerBackgroundColor: str(formData, "footerBackgroundColor"),
    headerTextColor: str(formData, "headerTextColor"),
    footerTextColor: str(formData, "footerTextColor"),
    headerFooterFontFamily: str(formData, "headerFooterFontFamily"),
    headerFooterFontSize: str(formData, "headerFooterFontSize"),
  };
  if (logoId) payload.logo = logoId;

  const result = await updateSingleType<SiteSetting & { documentId: string }>(
    "site-setting",
    payload,
    { status: "draft" }
  );
  if (result.error) {
    redirect(`/admin/site-settings?error=${encodeURIComponent(result.error)}`);
  }

  if (mode === "publish" && result.data) {
    const published = await publishDocument("site-setting", result.data.documentId);
    if (published.error) {
      redirect(`/admin/site-settings?error=${encodeURIComponent(published.error)}`);
    }
  }

  revalidatePath("/", "layout");
  redirect(`/admin/site-settings?status=${mode === "publish" ? "published" : "draft"}`);
}

export async function loadSiteSettings() {
  await assertAdmin();
  return getSingleTypeForEdit<SiteSetting>("site-setting");
}
