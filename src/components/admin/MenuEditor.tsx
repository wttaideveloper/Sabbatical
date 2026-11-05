"use client";

import { useState } from "react";
import ReorderableList from "./ReorderableList";
import type { MenuItem } from "@/lib/nav-links";

type Row = { key: string; documentId?: string; label: string; href: string; openInNewTab: boolean };

let counter = 0;
function newKey() {
  counter += 1;
  return `new-${Date.now()}-${counter}`;
}

function toRows(items: (MenuItem & { documentId?: string })[]): Row[] {
  return items.map((i) => ({
    key: newKey(),
    documentId: i.documentId,
    label: i.label,
    href: i.href,
    openInNewTab: Boolean(i.openInNewTab),
  }));
}

const inputClass =
  "w-full min-w-0 rounded-lg border border-admin-border bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-burgundy focus:ring-4 focus:ring-burgundy/10";

function GroupEditor({
  fieldName,
  title,
  hint,
  items,
  setItems,
  onRemove,
}: {
  fieldName: string;
  title: string;
  hint?: string;
  items: Row[];
  setItems: (rows: Row[]) => void;
  onRemove: (documentId?: string) => void;
}) {
  const update = (key: string, field: "label" | "href", value: string) => {
    setItems(items.map((r) => (r.key === key ? { ...r, [field]: value } : r)));
  };
  const toggleNewTab = (key: string) => {
    setItems(items.map((r) => (r.key === key ? { ...r, openInNewTab: !r.openInNewTab } : r)));
  };
  const remove = (key: string) => {
    const row = items.find((r) => r.key === key);
    setItems(items.filter((r) => r.key !== key));
    onRemove(row?.documentId);
  };
  const add = () => setItems([...items, { key: newKey(), label: "", href: "", openInNewTab: false }]);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-admin-border bg-admin-bg p-4">
      <div>
        <h3 className="font-sans text-sm font-semibold text-ink">{title}</h3>
        {hint && <p className="text-xs text-admin-muted">{hint}</p>}
      </div>

      {items.length > 0 && (
        <ReorderableList
          id={fieldName}
          items={items}
          getId={(r) => r.key}
          onReorder={setItems}
          renderItem={(row, index, dragHandle) => (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-admin-border bg-white p-2 sm:flex-nowrap">
              {dragHandle}
              <input
                placeholder="Label"
                defaultValue={row.label}
                onChange={(e) => update(row.key, "label", e.target.value)}
                className={inputClass}
              />
              <input
                placeholder="/link"
                defaultValue={row.href}
                onChange={(e) => update(row.key, "href", e.target.value)}
                className={inputClass}
              />
              <label className="flex shrink-0 items-center gap-1.5 text-xs text-admin-muted">
                <input type="checkbox" checked={row.openInNewTab} onChange={() => toggleNewTab(row.key)} />
                New tab
              </label>
              <button
                type="button"
                onClick={() => remove(row.key)}
                className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-admin-muted hover:text-coral"
              >
                Remove
              </button>
              <input type="hidden" name={`${fieldName}__${index}__documentId`} value={row.documentId ?? ""} readOnly />
              <input type="hidden" name={`${fieldName}__${index}__label`} value={row.label} readOnly />
              <input type="hidden" name={`${fieldName}__${index}__href`} value={row.href} readOnly />
              <input
                type="hidden"
                name={`${fieldName}__${index}__openInNewTab`}
                value={row.openInNewTab ? "true" : "false"}
                readOnly
              />
            </div>
          )}
        />
      )}

      <button
        type="button"
        onClick={add}
        className="self-start rounded-full border border-burgundy px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-burgundy transition-colors hover:bg-burgundy hover:text-white"
      >
        + Add Link
      </button>
    </div>
  );
}

export default function MenuEditor({
  initialItems,
}: {
  initialItems: (MenuItem & { documentId?: string })[];
}) {
  const byGroup = (group: MenuItem["group"]) =>
    initialItems.filter((i) => i.group === group).sort((a, b) => a.order - b.order);

  const [primary, setPrimary] = useState<Row[]>(() => toRows(byGroup("primary")));
  const [services, setServices] = useState<Row[]>(() => toRows(byGroup("services")));
  const [resources, setResources] = useState<Row[]>(() => toRows(byGroup("resources")));
  const [secondary, setSecondary] = useState<Row[]>(() => toRows(byGroup("secondary")));
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const onRemove = (documentId?: string) => {
    if (documentId) setDeletedIds((prev) => [...prev, documentId]);
  };

  return (
    <div className="flex flex-col gap-4">
      <GroupEditor
        fieldName="primaryItems"
        title="Primary Links"
        hint="Shown directly in the header, before the dropdowns."
        items={primary}
        setItems={setPrimary}
        onRemove={onRemove}
      />
      <GroupEditor
        fieldName="servicesItems"
        title="Services Dropdown"
        items={services}
        setItems={setServices}
        onRemove={onRemove}
      />
      <GroupEditor
        fieldName="resourcesItems"
        title="Resources Dropdown"
        items={resources}
        setItems={setResources}
        onRemove={onRemove}
      />
      <GroupEditor
        fieldName="secondaryItems"
        title="Secondary Links"
        hint="Shown after the dropdowns, before the Book a Consult button."
        items={secondary}
        setItems={setSecondary}
        onRemove={onRemove}
      />
      <input type="hidden" name="deletedMenuItemIds" value={deletedIds.join(",")} readOnly />
    </div>
  );
}
