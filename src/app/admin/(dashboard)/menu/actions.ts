"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createCollectionEntry,
  updateCollectionEntry,
  deleteCollectionEntry,
  listCollectionForEdit,
  publishDocument,
} from "@/lib/strapi-admin";
import { parseDeletedIds, parseMenuItemsField } from "@/lib/admin-form";
import type { MenuItemEntry } from "@/lib/strapi";

const UID = "menu-items";

export async function loadMenuItems() {
  return listCollectionForEdit<MenuItemEntry>(UID, "order:asc");
}

async function saveGroup(
  formData: FormData,
  fieldName: string,
  group: MenuItemEntry["group"],
  mode: "draft" | "publish"
) {
  const rows = parseMenuItemsField(formData, fieldName);
  const documentIds: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const payload = { label: row.label, href: row.href, openInNewTab: row.openInNewTab, group, order: i };
    const result = row.documentId
      ? await updateCollectionEntry<MenuItemEntry & { documentId: string }>(UID, row.documentId, payload, {
          status: "draft",
        })
      : await createCollectionEntry<MenuItemEntry & { documentId: string }>(UID, payload, { status: "draft" });
    if (result.error) throw new Error(result.error);
    if (result.data) documentIds.push(result.data.documentId);
  }

  if (mode === "publish") {
    for (const documentId of documentIds) {
      const published = await publishDocument(UID, documentId);
      if (published.error) throw new Error(published.error);
    }
  }
}

export async function saveMenu(mode: "draft" | "publish", formData: FormData) {
  try {
    await saveGroup(formData, "primaryItems", "primary", mode);
    await saveGroup(formData, "servicesItems", "services", mode);
    await saveGroup(formData, "resourcesItems", "resources", mode);
    await saveGroup(formData, "secondaryItems", "secondary", mode);

    for (const documentId of parseDeletedIds(formData, "deletedMenuItemIds")) {
      const result = await deleteCollectionEntry(UID, documentId);
      if (result.error) throw new Error(result.error);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed";
    redirect(`/admin/menu?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/", "layout");
  redirect(`/admin/menu?status=${mode === "publish" ? "published" : "draft"}`);
}
