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
import type { Product } from "@/lib/strapi";

const UID = "products";

export async function loadProducts() {
  return listCollectionForEdit<Product>(UID);
}

export async function loadProduct(documentId: string) {
  if (documentId === "new") return { data: null, error: null };
  return getCollectionEntryForEdit<Product>(UID, documentId);
}

export async function saveProduct(documentId: string, mode: "draft" | "publish", formData: FormData) {
  let imageId: number | undefined;
  try {
    imageId = await resolveMediaRelation(formData, "image");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    redirect(`/admin/products/${documentId}?error=${encodeURIComponent(message)}`);
  }

  const priceRaw = str(formData, "price");
  const orderRaw = str(formData, "order");

  const payload: Record<string, unknown> = {
    name: str(formData, "name"),
    category: str(formData, "category"),
    price: priceRaw ? Number(priceRaw) : undefined,
    blurb: str(formData, "blurb"),
    order: orderRaw ? Number(orderRaw) : undefined,
  };
  if (imageId) payload.image = imageId;

  const result =
    documentId === "new"
      ? await createCollectionEntry<Product & { documentId: string }>(UID, payload, { status: "draft" })
      : await updateCollectionEntry<Product & { documentId: string }>(UID, documentId, payload, {
          status: "draft",
        });

  if (result.error) {
    redirect(`/admin/products/${documentId}?error=${encodeURIComponent(result.error)}`);
  }

  if (mode === "publish" && result.data) {
    const published = await publishDocument(UID, result.data.documentId);
    if (published.error) {
      redirect(`/admin/products/${result.data.documentId}?error=${encodeURIComponent(published.error)}`);
    }
  }

  revalidatePath("/shop");
  redirect(`/admin/products?status=${mode === "publish" ? "published" : "draft"}`);
}

export async function deleteProduct(documentId: string) {
  const result = await deleteCollectionEntry(UID, documentId);
  if (result.error) {
    redirect(`/admin/products?error=${encodeURIComponent(result.error)}`);
  }
  revalidatePath("/shop");
  redirect("/admin/products?status=deleted");
}
