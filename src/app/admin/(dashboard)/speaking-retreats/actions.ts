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
import type { SpeakingRetreatsPage } from "@/lib/strapi";

export async function saveSpeakingRetreats(mode: "draft" | "publish", formData: FormData) {
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
    redirect(`/admin/speaking-retreats?error=${encodeURIComponent(message)}`);
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
    forGroupsEyebrow: str(formData, "forGroupsEyebrow"),
    forGroupsTitle: str(formData, "forGroupsTitle"),
    forGroupsBody: str(formData, "forGroupsBody"),
    topicsEyebrow: str(formData, "topicsEyebrow"),
    topicsTitle: str(formData, "topicsTitle"),
    topics: parseListField(formData, "topics"),
    formatsEyebrow: str(formData, "formatsEyebrow"),
    formatsTitle: str(formData, "formatsTitle"),
    formats: parseListField(formData, "formats"),
    ctaEyebrow: str(formData, "ctaEyebrow"),
    ctaTitle: str(formData, "ctaTitle"),
    ctaBody: str(formData, "ctaBody"),
    customSections,
  };

  const result = await updateSingleType<SpeakingRetreatsPage & { documentId: string }>(
    "speaking-retreats-page",
    payload,
    { status: "draft" }
  );
  if (result.error) {
    redirect(`/admin/speaking-retreats?error=${encodeURIComponent(result.error)}`);
  }

  if (mode === "publish" && result.data) {
    const published = await publishDocument("speaking-retreats-page", result.data.documentId);
    if (published.error) {
      redirect(`/admin/speaking-retreats?error=${encodeURIComponent(published.error)}`);
    }
  }

  revalidatePath("/speaking-retreats");
  redirect(`/admin/speaking-retreats?status=${mode === "publish" ? "published" : "draft"}`);
}

export async function loadSpeakingRetreats() {
  await assertAdmin();
  return getSingleTypeForEdit<SpeakingRetreatsPage>("speaking-retreats-page");
}
