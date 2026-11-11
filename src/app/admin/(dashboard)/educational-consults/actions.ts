"use server";

import { assertAdmin } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getSingleTypeForEdit,
  updateSingleType,
  publishDocument,
  resolveMediaUrl,
  resolveMediaRelation,
} from "@/lib/strapi-admin";
import { parseCustomSectionsField, parseListField, str } from "@/lib/admin-form";
import type { EducationalConsultsPage } from "@/lib/strapi";

export async function saveEducationalConsults(mode: "draft" | "publish", formData: FormData) {
  await assertAdmin();
  let heroVideoUrl: string | undefined;
  let customSections: Record<string, unknown>[];

  try {
    heroVideoUrl = await resolveMediaUrl(formData, "heroVideoUrl");
    const rows = parseCustomSectionsField(formData, "customSections");
    customSections = await Promise.all(
      rows.map(async (row) => ({
        blockType: row.blockType,
        heading: row.heading,
        body: row.body,
        backgroundColor: row.backgroundColor,
        textColor: row.textColor,
        fontFamily: row.fontFamily,
        layout: row.layout,
        ctaLabel: row.ctaLabel,
        ctaHref: row.ctaHref,
        attribution: row.attribution,
        videoUrl: row.videoUrl,
        image: await resolveMediaRelation(formData, `customSections__${row.index}__image`),
      }))
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    redirect(`/admin/educational-consults?error=${encodeURIComponent(message)}`);
  }

  const payload: Record<string, unknown> = {
    heroEyebrow: str(formData, "heroEyebrow"),
    heroTitle: str(formData, "heroTitle"),
    heroLead: str(formData, "heroLead"),
    heroVideoUrl,
    videoCaption: str(formData, "videoCaption"),
    heroBackgroundColor: str(formData, "heroBackgroundColor"),
    heroTextColor: str(formData, "heroTextColor"),
    heroFontFamily: str(formData, "heroFontFamily"),
    whatEyebrow: str(formData, "whatEyebrow"),
    whatTitle: str(formData, "whatTitle"),
    whatBody: str(formData, "whatBody"),
    exploreEyebrow: str(formData, "exploreEyebrow"),
    exploreTitle: str(formData, "exploreTitle"),
    exploreItems: parseListField(formData, "exploreItems"),
    fitEyebrow: str(formData, "fitEyebrow"),
    fitTitle: str(formData, "fitTitle"),
    fitItems: parseListField(formData, "fitItems"),
    ctaEyebrow: str(formData, "ctaEyebrow"),
    ctaTitle: str(formData, "ctaTitle"),
    ctaBody: str(formData, "ctaBody"),
    customSections,
  };

  const result = await updateSingleType<EducationalConsultsPage & { documentId: string }>(
    "educational-consults-page",
    payload,
    { status: "draft" }
  );
  if (result.error) {
    redirect(`/admin/educational-consults?error=${encodeURIComponent(result.error)}`);
  }

  if (mode === "publish" && result.data) {
    const published = await publishDocument("educational-consults-page", result.data.documentId);
    if (published.error) {
      redirect(`/admin/educational-consults?error=${encodeURIComponent(published.error)}`);
    }
  }

  revalidatePath("/educational-consults");
  redirect(`/admin/educational-consults?status=${mode === "publish" ? "published" : "draft"}`);
}

export async function loadEducationalConsults() {
  await assertAdmin();
  return getSingleTypeForEdit<EducationalConsultsPage>("educational-consults-page");
}
