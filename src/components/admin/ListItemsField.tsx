"use client";

import { useState } from "react";

export type ListItemValue = {
  key: string;
  number?: string;
  title?: string;
  body?: string;
  note?: string;
};

let counter = 0;
function newKey() {
  counter += 1;
  return `new-${Date.now()}-${counter}`;
}

export default function ListItemsField({
  name,
  label,
  initialItems,
  showNumber = false,
  showTitle = true,
  showNote = false,
}: {
  name: string;
  label: string;
  initialItems: { number?: string; title?: string; body?: string; note?: string }[];
  showNumber?: boolean;
  showTitle?: boolean;
  showNote?: boolean;
}) {
  const [items, setItems] = useState<ListItemValue[]>(
    initialItems.length
      ? initialItems.map((i) => ({ ...i, key: newKey() }))
      : [{ key: newKey() }]
  );

  const update = (key: string, field: keyof ListItemValue, value: string) => {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, [field]: value } : it)));
  };

  const remove = (key: string) => {
    setItems((prev) => prev.filter((it) => it.key !== key));
  };

  const add = () => {
    setItems((prev) => [...prev, { key: newKey() }]);
  };

  const inputClass =
    "w-full rounded-lg border border-admin-border bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-burgundy focus:ring-4 focus:ring-burgundy/10";

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[13px] font-semibold uppercase tracking-[0.06em] text-admin-muted">{label}</span>
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <div key={item.key} className="rounded-xl border border-admin-border bg-admin-bg p-4">
            <div className="mb-2 grid gap-2 sm:grid-cols-[auto_1fr]">
              {showNumber && (
                <input
                  placeholder="01"
                  defaultValue={item.number}
                  onChange={(e) => update(item.key, "number", e.target.value)}
                  className={`${inputClass} sm:w-20`}
                />
              )}
              {showTitle && (
                <input
                  placeholder="Title"
                  defaultValue={item.title}
                  onChange={(e) => update(item.key, "title", e.target.value)}
                  className={inputClass}
                />
              )}
            </div>
            <textarea
              placeholder="Body"
              defaultValue={item.body}
              onChange={(e) => update(item.key, "body", e.target.value)}
              rows={2}
              className={`${inputClass} mb-2`}
            />
            {showNote && (
              <input
                placeholder="Note (optional secondary line)"
                defaultValue={item.note}
                onChange={(e) => update(item.key, "note", e.target.value)}
                className={`${inputClass} mb-2`}
              />
            )}
            {/* Hidden inputs so native form submission carries this row's values */}
            <input type="hidden" name={`${name}__${i}__number`} value={item.number ?? ""} readOnly />
            <input type="hidden" name={`${name}__${i}__title`} value={item.title ?? ""} readOnly />
            <input type="hidden" name={`${name}__${i}__body`} value={item.body ?? ""} readOnly />
            <input type="hidden" name={`${name}__${i}__note`} value={item.note ?? ""} readOnly />
            <button
              type="button"
              onClick={() => remove(item.key)}
              className="text-[11px] font-semibold uppercase tracking-wide text-admin-muted hover:text-coral"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="self-start rounded-full border border-burgundy px-5 py-2 text-[11px] font-semibold uppercase tracking-wide text-burgundy transition-colors hover:bg-burgundy hover:text-white"
      >
        + Add Item
      </button>
    </div>
  );
}
