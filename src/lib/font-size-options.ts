/**
 * Fixed presets rather than a freeform number — an open font-size field risks an
 * admin breaking the header/footer layout with an extreme value.
 */
export const FONT_SIZE_OPTIONS = [
  { value: "sm", label: "Small", rem: "0.875rem" },
  { value: "base", label: "Default", rem: "1rem" },
  { value: "lg", label: "Large", rem: "1.125rem" },
] as const;

export type FontSizeValue = (typeof FONT_SIZE_OPTIONS)[number]["value"];

export function fontSizeRem(value?: string | null): string | undefined {
  return FONT_SIZE_OPTIONS.find((f) => f.value === value)?.rem;
}
