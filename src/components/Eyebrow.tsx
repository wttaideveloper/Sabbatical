type Tone = "burgundy" | "coral" | "light";

const TONE_CLASSES: Record<Tone, string> = {
  burgundy: "text-burgundy",
  coral: "text-coral",
  light: "text-white/80",
};

export default function Eyebrow({
  children,
  tone = "burgundy",
  className = "",
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <p
      className={`mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] ${TONE_CLASSES[tone]} ${className}`}
    >
      <span className="h-px w-8 bg-current opacity-60" />
      {children}
    </p>
  );
}
