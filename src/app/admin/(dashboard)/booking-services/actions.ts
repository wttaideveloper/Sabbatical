"use server";

import { assertAdmin } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createCollectionEntry,
  deleteCollectionEntry,
  getCollectionEntryForEdit,
  listCollectionForEdit,
  updateCollectionEntry,
  publishDocument,
} from "@/lib/strapi-admin";
import { str } from "@/lib/admin-form";
import type { BookingService } from "@/lib/strapi";

const UID = "booking-services";

export async function loadBookingServices() {
  await assertAdmin();
  return listCollectionForEdit<BookingService>(UID);
}

export async function loadBookingService(documentId: string) {
  await assertAdmin();
  if (documentId === "new") return { data: null, error: null };
  return getCollectionEntryForEdit<BookingService>(UID, documentId);
}

export async function saveBookingService(documentId: string, mode: "draft" | "publish", formData: FormData) {
  await assertAdmin();
  const orderRaw = str(formData, "order");

  const payload: Record<string, unknown> = {
    title: str(formData, "title"),
    duration: str(formData, "duration"),
    price: str(formData, "price"),
    description: str(formData, "description"),
    order: orderRaw ? Number(orderRaw) : undefined,
  };

  const result =
    documentId === "new"
      ? await createCollectionEntry<BookingService & { documentId: string }>(UID, payload, {
          status: "draft",
        })
      : await updateCollectionEntry<BookingService & { documentId: string }>(UID, documentId, payload, {
          status: "draft",
        });

  if (result.error) {
    redirect(`/admin/booking-services/${documentId}?error=${encodeURIComponent(result.error)}`);
  }

  if (mode === "publish" && result.data) {
    const published = await publishDocument(UID, result.data.documentId);
    if (published.error) {
      redirect(
        `/admin/booking-services/${result.data.documentId}?error=${encodeURIComponent(published.error)}`
      );
    }
  }

  revalidatePath("/booking");
  redirect(`/admin/booking-services?status=${mode === "publish" ? "published" : "draft"}`);
}

export async function deleteBookingService(documentId: string) {
  await assertAdmin();
  const result = await deleteCollectionEntry(UID, documentId);
  if (result.error) {
    redirect(`/admin/booking-services?error=${encodeURIComponent(result.error)}`);
  }
  revalidatePath("/booking");
  redirect("/admin/booking-services?status=deleted");
}
