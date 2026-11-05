export type ParsedListItem = {
  number?: string;
  title?: string;
  body: string;
  note?: string;
};

/** Reconstructs a repeatable shared.list-item array from ListItemsField's hidden inputs. */
export function parseListField(formData: FormData, name: string): ParsedListItem[] {
  const rows = new Map<number, Partial<ParsedListItem>>();
  const pattern = new RegExp(`^${name}__(\\d+)__(number|title|body|note)$`);

  for (const [key, value] of formData.entries()) {
    const match = key.match(pattern);
    if (!match) continue;
    const index = Number(match[1]);
    const field = match[2] as keyof ParsedListItem;
    const row = rows.get(index) ?? {};
    row[field] = String(value);
    rows.set(index, row);
  }

  return Array.from(rows.entries())
    .sort(([a], [b]) => a - b)
    .map(([, row]) => row)
    .filter((row) => (row.title && row.title.trim()) || (row.body && row.body.trim()))
    .map((row) => ({
      number: row.number?.trim() || undefined,
      title: row.title?.trim() || undefined,
      body: row.body?.trim() || "",
      note: row.note?.trim() || undefined,
    }));
}

export function str(formData: FormData, name: string): string | undefined {
  const value = formData.get(name);
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

export function fileOrNull(formData: FormData, name: string): File | null {
  const value = formData.get(name);
  return value instanceof File && value.size > 0 ? value : null;
}

export type ParsedCustomSection = {
  /** Original row index in the submitted form — needed to look up this row's
   *  image field (`${name}__${index}__image`) after empty rows are filtered out. */
  index: number;
  blockType?: string;
  heading?: string;
  body?: string;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  layout?: string;
  ctaLabel?: string;
  ctaHref?: string;
  attribution?: string;
  videoUrl?: string;
};

const CUSTOM_SECTION_FIELDS = [
  "blockType",
  "heading",
  "body",
  "backgroundColor",
  "textColor",
  "fontFamily",
  "layout",
  "ctaLabel",
  "ctaHref",
  "attribution",
  "videoUrl",
] as const;

/** Reconstructs a repeatable sections.custom-block array from CustomSectionsField's hidden inputs. */
export function parseCustomSectionsField(formData: FormData, name: string): ParsedCustomSection[] {
  const rows = new Map<number, Record<string, string>>();
  const pattern = new RegExp(`^${name}__(\\d+)__(${CUSTOM_SECTION_FIELDS.join("|")})$`);

  for (const [key, value] of formData.entries()) {
    const match = key.match(pattern);
    if (!match) continue;
    const index = Number(match[1]);
    const field = match[2];
    const row = rows.get(index) ?? {};
    row[field] = String(value);
    rows.set(index, row);
  }

  return Array.from(rows.entries())
    .sort(([a], [b]) => a - b)
    .map(([index, row]) => ({
      index,
      blockType: row.blockType?.trim() || undefined,
      heading: row.heading?.trim() || undefined,
      body: row.body?.trim() || undefined,
      backgroundColor: row.backgroundColor?.trim() || undefined,
      textColor: row.textColor?.trim() || undefined,
      fontFamily: row.fontFamily?.trim() || undefined,
      layout: row.layout?.trim() || undefined,
      ctaLabel: row.ctaLabel?.trim() || undefined,
      ctaHref: row.ctaHref?.trim() || undefined,
      attribution: row.attribution?.trim() || undefined,
      videoUrl: row.videoUrl?.trim() || undefined,
    }))
    .filter((row) => row.heading || row.body);
}

export type ParsedMenuItem = {
  documentId?: string;
  label: string;
  href: string;
  openInNewTab: boolean;
};

/**
 * Reconstructs one group's menu-item rows from MenuItemsField's hidden inputs.
 * Unlike parseCustomSectionsField (a component array, full-replace-on-save is
 * correct), menu items are independent top-level entries — this only tells the
 * caller what the form now WANTS each row to be. Deletion of rows removed by the
 * admin is handled separately via parseDeletedIds, since resubmitting a shorter
 * list here does not delete anything server-side on its own.
 */
export function parseMenuItemsField(formData: FormData, name: string): ParsedMenuItem[] {
  const rows = new Map<number, Record<string, string>>();
  const pattern = new RegExp(`^${name}__(\\d+)__(documentId|label|href|openInNewTab)$`);

  for (const [key, value] of formData.entries()) {
    const match = key.match(pattern);
    if (!match) continue;
    const index = Number(match[1]);
    const field = match[2];
    const row = rows.get(index) ?? {};
    row[field] = String(value);
    rows.set(index, row);
  }

  return Array.from(rows.entries())
    .sort(([a], [b]) => a - b)
    .map(([, row]) => row)
    .filter((row) => row.label?.trim() && row.href?.trim())
    .map((row) => ({
      documentId: row.documentId?.trim() || undefined,
      label: row.label.trim(),
      href: row.href.trim(),
      openInNewTab: row.openInNewTab === "true" || row.openInNewTab === "on",
    }));
}

/** Parses a comma-joined hidden input of documentIds the admin removed this save. */
export function parseDeletedIds(formData: FormData, name: string): string[] {
  const value = formData.get(name);
  if (typeof value !== "string" || !value.trim()) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
