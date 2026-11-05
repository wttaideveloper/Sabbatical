import { FONT_SIZE_OPTIONS } from "@/lib/font-size-options";

const selectClass =
  "w-full rounded-xl border border-admin-border bg-white px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-burgundy focus:ring-4 focus:ring-burgundy/10";

export default function FontSizeField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold uppercase tracking-[0.06em] text-admin-muted">{label}</span>
      <select name={name} defaultValue={defaultValue ?? "base"} className={selectClass}>
        {FONT_SIZE_OPTIONS.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>
    </label>
  );
}
