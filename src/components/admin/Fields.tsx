const inputClass =
  "w-full rounded-xl border border-admin-border bg-white px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-burgundy focus:ring-4 focus:ring-burgundy/10";
const labelClass = "text-[13px] font-semibold uppercase tracking-[0.06em] text-admin-muted";

export function TextField({
  name,
  label,
  defaultValue,
  required,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelClass}>{label}</span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  );
}

export function TextAreaField({
  name,
  label,
  defaultValue,
  rows = 4,
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelClass}>{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={rows}
        className={inputClass}
      />
      {hint && <span className="text-xs text-admin-muted">{hint}</span>}
    </label>
  );
}

export function RichTextField(props: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  return (
    <TextAreaField
      {...props}
      rows={8}
      hint="Leave a blank line between paragraphs."
    />
  );
}

export function SectionCard({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-admin-border bg-white p-6 shadow-[0_1px_2px_rgba(25,27,34,0.04)] sm:p-8">
      {title && <h2 className="font-sans text-lg font-semibold text-ink">{title}</h2>}
      {children}
    </div>
  );
}

export function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}
