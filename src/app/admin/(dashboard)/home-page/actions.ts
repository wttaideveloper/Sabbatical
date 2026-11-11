"use server";

import { assertAdmin } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSingleTypeForEdit, updateSingleType, publishDocument, resolveMediaRelation } from "@/lib/strapi-admin";
import { parseCustomSectionsField, str } from "@/lib/admin-form";
import type { HomePage } from "@/lib/strapi";

export async function saveHomePage(mode: "draft" | "publish", formData: FormData) {
  await assertAdmin();
  let heroImageId: number | undefined;
  let aboutTeaserImageId: number | undefined;
  let customSections: Record<string, unknown>[];

  try {
    heroImageId = await resolveMediaRelation(formData, "heroImage");
    aboutTeaserImageId = await resolveMediaRelation(formData, "aboutTeaserImage");
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
    redirect(`/admin/home-page?error=${encodeURIComponent(message)}`);
  }

  const payload: Record<string, unknown> = {
    heroEyebrow: str(formData, "heroEyebrow"),
    heroTitle: str(formData, "heroTitle"),
    heroSubtitle: str(formData, "heroSubtitle"),
    heroPrimaryLabel: str(formData, "heroPrimaryLabel"),
    heroPrimaryHref: str(formData, "heroPrimaryHref"),
    heroSecondaryLabel: str(formData, "heroSecondaryLabel"),
    heroSecondaryHref: str(formData, "heroSecondaryHref"),
    heroBackgroundColor: str(formData, "heroBackgroundColor"),
    heroTextColor: str(formData, "heroTextColor"),
    heroFontFamily: str(formData, "heroFontFamily"),
    introEyebrow: str(formData, "introEyebrow"),
    introTitle: str(formData, "introTitle"),
    introBody: str(formData, "introBody"),
    modelEyebrow: str(formData, "modelEyebrow"),
    modelTitle: str(formData, "modelTitle"),
    modelNote: str(formData, "modelNote"),
    restoreEyebrow: str(formData, "restoreEyebrow"),
    restoreTitle: str(formData, "restoreTitle"),
    restoreBody: str(formData, "restoreBody"),
    aboutTeaserEyebrow: str(formData, "aboutTeaserEyebrow"),
    aboutTeaserTitle: str(formData, "aboutTeaserTitle"),
    aboutTeaserBody: str(formData, "aboutTeaserBody"),
    ctaEyebrow: str(formData, "ctaEyebrow"),
    ctaTitle: str(formData, "ctaTitle"),
    ctaBody: str(formData, "ctaBody"),
    customSections,
  };
  if (heroImageId) payload.heroImage = heroImageId;
  if (aboutTeaserImageId) payload.aboutTeaserImage = aboutTeaserImageId;

  const result = await updateSingleType<HomePage & { documentId: string }>("home-page", payload, {
    status: "draft",
  });
  if (result.error) {
    redirect(`/admin/home-page?error=${encodeURIComponent(result.error)}`);
  }

  if (mode === "publish" && result.data) {
    const published = await publishDocument("home-page", result.data.documentId);
    if (published.error) {
      redirect(`/admin/home-page?error=${encodeURIComponent(published.error)}`);
    }
  }

  revalidatePath("/");
  redirect(`/admin/home-page?status=${mode === "publish" ? "published" : "draft"}`);
}

export async function loadHomePage() {
  await assertAdmin();
  return getSingleTypeForEdit<HomePage>("home-page");
}
