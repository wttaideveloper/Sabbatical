"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createCollectionEntry,
  deleteCollectionEntry,
  getCollectionEntryForEdit,
  listCollectionForEdit,
  updateCollectionEntry,
  publishDocument,
  resolveMediaRelation,
} from "@/lib/strapi-admin";
import { str } from "@/lib/admin-form";
import type { BlogPost } from "@/lib/strapi";

const UID = "blog-posts";

export async function loadBlogPosts() {
  return listCollectionForEdit<BlogPost>(UID, "publishedDate:desc");
}

export async function loadBlogPost(documentId: string) {
  if (documentId === "new") return { data: null, error: null };
  return getCollectionEntryForEdit<BlogPost>(UID, documentId);
}

export async function saveBlogPost(documentId: string, mode: "draft" | "publish", formData: FormData) {
  let coverImageId: number | undefined;
  try {
    coverImageId = await resolveMediaRelation(formData, "coverImage");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    redirect(`/admin/blog/${documentId}?error=${encodeURIComponent(message)}`);
  }

  const payload: Record<string, unknown> = {
    title: str(formData, "title"),
    slug: str(formData, "slug"),
    category: str(formData, "category"),
    excerpt: str(formData, "excerpt"),
    body: str(formData, "body"),
    publishedDate: str(formData, "publishedDate"),
    readTime: str(formData, "readTime"),
  };
  if (coverImageId) payload.coverImage = coverImageId;

  const result =
    documentId === "new"
      ? await createCollectionEntry<BlogPost & { documentId: string }>(UID, payload, { status: "draft" })
      : await updateCollectionEntry<BlogPost & { documentId: string }>(UID, documentId, payload, {
          status: "draft",
        });

  if (result.error) {
    redirect(`/admin/blog/${documentId}?error=${encodeURIComponent(result.error)}`);
  }

  if (mode === "publish" && result.data) {
    const published = await publishDocument(UID, result.data.documentId);
    if (published.error) {
      redirect(`/admin/blog/${result.data.documentId}?error=${encodeURIComponent(published.error)}`);
    }
  }

  revalidatePath("/blog");
  if (payload.slug) revalidatePath(`/blog/${payload.slug}`);
  redirect(`/admin/blog?status=${mode === "publish" ? "published" : "draft"}`);
}

export async function deleteBlogPost(documentId: string) {
  const result = await deleteCollectionEntry(UID, documentId);
  if (result.error) {
    redirect(`/admin/blog?error=${encodeURIComponent(result.error)}`);
  }
  revalidatePath("/blog");
  redirect("/admin/blog?status=deleted");
}
