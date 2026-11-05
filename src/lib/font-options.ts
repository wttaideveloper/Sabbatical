/**
 * next/font/google calls must be statically analyzable, so admin font choices
 * are necessarily a fixed, build-time palette rather than free text. This is the
 * single source of truth for that palette — imported by both the admin's
 * FontFamilyField and every public renderer. The same 5 values also have to be
 * hand-copied into each Strapi schema's enumeration field (Strapi has no shared
 * enum primitive) — a small, permanent maintenance note if this list ever changes.
 */
export const FONT_OPTIONS = [
  { value: "montserrat", label: "Montserrat (Sans)", cssVar: "var(--font-montserrat)" },
  { value: "playfair", label: "Playfair Display (Serif)", cssVar: "var(--font-playfair)" },
  { value: "lora", label: "Lora (Serif)", cssVar: "var(--font-lora)" },
  { value: "cormorant", label: "Cormorant Garamond (Display Serif)", cssVar: "var(--font-cormorant)" },
  { value: "inter", label: "Inter (Sans)", cssVar: "var(--font-inter)" },
] as const;

export type FontOptionValue = (typeof FONT_OPTIONS)[number]["value"];

export function fontFamilyCssVar(value?: string | null): string | undefined {
  return FONT_OPTIONS.find((f) => f.value === value)?.cssVar;
}
