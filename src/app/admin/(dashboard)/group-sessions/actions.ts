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
import type { GroupSessionsPage } from "@/lib/strapi";

export async function saveGroupSessions(mode: "draft" | "publish", formData: FormData) {
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
    redirect(`/admin/group-sessions?error=${encodeURIComponent(message)}`);
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
    howEyebrow: str(formData, "howEyebrow"),
    howTitle: str(formData, "howTitle"),
    howBody: str(formData, "howBody"),
    seriesEyebrow: str(formData, "seriesEyebrow"),
    seriesTitle: str(formData, "seriesTitle"),
    sessions: parseListField(formData, "sessions"),
    designedEyebrow: str(formData, "designedEyebrow"),
    designedTitle: str(formData, "designedTitle"),
    designedBody: str(formData, "designedBody"),
    ctaEyebrow: str(formData, "ctaEyebrow"),
    ctaTitle: str(formData, "ctaTitle"),
    ctaBody: str(formData, "ctaBody"),
    customSections,
  };

  const result = await updateSingleType<GroupSessionsPage & { documentId: string }>(
    "group-sessions-page",
    payload,
    { status: "draft" }
  );
  if (result.error) {
    redirect(`/admin/group-sessions?error=${encodeURIComponent(result.error)}`);
  }

  if (mode === "publish" && result.data) {
    const published = await publishDocument("group-sessions-page", result.data.documentId);
    if (published.error) {
      redirect(`/admin/group-sessions?error=${encodeURIComponent(published.error)}`);
    }
  }

  revalidatePath("/group-sessions");
  redirect(`/admin/group-sessions?status=${mode === "publish" ? "published" : "draft"}`);
}

export async function loadGroupSessions() {
  await assertAdmin();
  return getSingleTypeForEdit<GroupSessionsPage>("group-sessions-page");
}
