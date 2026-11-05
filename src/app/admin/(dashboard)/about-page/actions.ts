"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSingleTypeForEdit, updateSingleType, publishDocument, resolveMediaRelation } from "@/lib/strapi-admin";
import { parseCustomSectionsField, parseListField, str } from "@/lib/admin-form";
import type { AboutPage } from "@/lib/strapi";

export async function saveAboutPage(mode: "draft" | "publish", formData: FormData) {
  let heroPhotoId: number | undefined;
  let hikingPhotoId: number | undefined;
  let dogPhotoId: number | undefined;
  let customSections: Record<string, unknown>[];

  try {
    heroPhotoId = await resolveMediaRelation(formData, "heroPhoto");
    hikingPhotoId = await resolveMediaRelation(formData, "hikingPhoto");
    dogPhotoId = await resolveMediaRelation(formData, "dogPhoto");
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
    redirect(`/admin/about-page?error=${encodeURIComponent(message)}`);
  }

  const payload: Record<string, unknown> = {
    heroEyebrow: str(formData, "heroEyebrow"),
    heroTitle: str(formData, "heroTitle"),
    heroLead: str(formData, "heroLead"),
    heroBackgroundColor: str(formData, "heroBackgroundColor"),
    heroTextColor: str(formData, "heroTextColor"),
    heroFontFamily: str(formData, "heroFontFamily"),
    whyEyebrow: str(formData, "whyEyebrow"),
    whyTitle: str(formData, "whyTitle"),
    whyBody: str(formData, "whyBody"),
    goalEyebrow: str(formData, "goalEyebrow"),
    goalTitle: str(formData, "goalTitle"),
    goalBody: str(formData, "goalBody"),
    values: parseListField(formData, "values"),
    beyondEyebrow: str(formData, "beyondEyebrow"),
    beyondTitle: str(formData, "beyondTitle"),
    beyondBody: str(formData, "beyondBody"),
    ctaEyebrow: str(formData, "ctaEyebrow"),
    ctaTitle: str(formData, "ctaTitle"),
    customSections,
  };
  if (heroPhotoId) payload.heroPhoto = heroPhotoId;
  if (hikingPhotoId) payload.hikingPhoto = hikingPhotoId;
  if (dogPhotoId) payload.dogPhoto = dogPhotoId;

  const result = await updateSingleType<AboutPage & { documentId: string }>("about-page", payload, {
    status: "draft",
  });
  if (result.error) {
    redirect(`/admin/about-page?error=${encodeURIComponent(result.error)}`);
  }

  if (mode === "publish" && result.data) {
    const published = await publishDocument("about-page", result.data.documentId);
    if (published.error) {
      redirect(`/admin/about-page?error=${encodeURIComponent(published.error)}`);
    }
  }

  revalidatePath("/about");
  redirect(`/admin/about-page?status=${mode === "publish" ? "published" : "draft"}`);
}

export async function loadAboutPage() {
  return getSingleTypeForEdit<AboutPage>("about-page");
}
