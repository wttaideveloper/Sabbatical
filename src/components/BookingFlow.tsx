"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import Stepper from "@/components/Stepper";
import { CONTACT_EMAIL } from "@/lib/public-config";

type ServiceOption = {
  id: string;
  title: string;
  duration?: string;
  price?: string;
  description?: string;
};

const STEPS = ["Service", "Preferred Time", "Your Details", "Review & Send"];
const EASE = [0.22, 1, 0.36, 1] as const;

// Preferences, not availability: nothing here claims a slot is open.
const TIME_WINDOWS = [
  { value: "Morning (before 12 pm)", label: "Morning (before 12 pm)" },
  { value: "Afternoon (12–5 pm)", label: "Afternoon (12–5 pm)" },
  { value: "Evening (after 5 pm)", label: "Evening (after 5 pm)" },
  { value: "Flexible — any time", label: "Flexible — any time" },
] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NOTES_LENGTH = 1000;

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseIsoDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(iso: string): string {
  const date = parseIsoDate(iso);
  return date
    ? date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : iso;
}

function isTodayOrLater(iso: string): boolean {
  const date = parseIsoDate(iso);
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() >= today.getTime();
}

const inputClass =
  "rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-burgundy";

export default function BookingFlow({ services }: { services: ServiceOption[] }) {
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [preferredDate, setPreferredDate] = useState("");
  const [timeWindow, setTimeWindow] = useState("");
  const [alternatives, setAlternatives] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [emailOpened, setEmailOpened] = useState(false);

  const service = services.find((s) => s.id === serviceId);

  const canProceed =
    (step === 0 && !!serviceId) ||
    (step === 1 && isTodayOrLater(preferredDate) && !!timeWindow) ||
    (step === 2 && !!form.name.trim() && EMAIL_PATTERN.test(form.email.trim())) ||
    step === 3;

  const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const serviceLine = service
    ? [service.title, [service.duration, service.price].filter(Boolean).join(", ")]
        .filter(Boolean)
        .join(" — ")
    : "";

  const lines: string[] = ["BOOKING REQUEST — not a confirmed appointment", ""];
  if (serviceLine) lines.push(`Service: ${serviceLine}`);
  if (preferredDate) lines.push(`Preferred date: ${formatDate(preferredDate)}`);
  if (timeWindow) lines.push(`Preferred time: ${timeWindow}`);
  if (alternatives.trim()) lines.push(`Other dates/times that could work: ${alternatives.trim()}`);
  lines.push("");
  if (form.name.trim()) lines.push(`Name: ${form.name.trim()}`);
  if (form.email.trim()) lines.push(`Email: ${form.email.trim()}`);
  if (form.phone.trim()) lines.push(`Phone: ${form.phone.trim()}`);
  if (form.notes.trim()) lines.push(`Notes: ${form.notes.trim().slice(0, MAX_NOTES_LENGTH)}`);
  const summaryLines = lines.join("\n");

  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    "Booking Request"
  )}&body=${encodeURIComponent(summaryLines)}`;

  return (
    <>
      <section className="border-b border-line bg-gradient-to-br from-white via-cream to-[#f2e4dd]">
        <Container className="flex min-h-0 items-center py-16 sm:min-h-[320px] sm:py-20">
          <Reveal className="max-w-2xl">
            <Eyebrow>Request a Consult</Eyebrow>
            <h1 className="mb-4 text-4xl sm:text-5xl">Request your session.</h1>
            <p className="text-lg leading-relaxed text-ink/80">
              Choose a service and tell us when you&rsquo;d like to meet. This sends a{" "}
              <strong className="font-semibold text-ink">request</strong> by email&mdash;it is not a
              confirmed appointment. We&rsquo;ll reply to confirm a time that works for you.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="mx-auto max-w-2xl">
          <div className="mb-12">
            <Stepper steps={STEPS} currentStep={step} />
          </div>

          <div className="rounded-2xl border border-line bg-white p-6 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                {step === 0 && (
                  <div>
                    <h2 className="mb-6 text-2xl">Choose a service</h2>
                    <div className="flex flex-col gap-3">
                      {services.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setServiceId(s.id)}
                          className={`rounded-2xl border p-5 text-left transition-colors ${
                            serviceId === s.id
                              ? "border-burgundy bg-burgundy/5"
                              : "border-line hover:border-burgundy/40"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <h3 className="text-lg">{s.title}</h3>
                            {s.price && <span className="text-sm font-medium text-burgundy">{s.price}</span>}
                          </div>
                          {(s.duration || s.description) && (
                            <p className="mt-1 text-sm text-muted">
                              {[s.duration, s.description].filter(Boolean).join(" · ")}
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h2 className="mb-2 text-2xl">When would you like to meet?</h2>
                    <p className="mb-6 text-sm leading-relaxed text-muted">
                      Tell us what works best for you. These are your preferences&mdash;nothing is
                      reserved until we reply to confirm. Please mention your time zone in the
                      notes if it may differ from ours.
                    </p>
                    <div className="flex flex-col gap-5">
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                          Preferred date
                        </span>
                        <input
                          type="date"
                          min={toIsoDate(new Date())}
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className={inputClass}
                        />
                        {preferredDate && !isTodayOrLater(preferredDate) && (
                          <span className="text-xs text-coral">Please choose today or a future date.</span>
                        )}
                      </label>

                      <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                          Preferred time of day
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {TIME_WINDOWS.map((t) => (
                            <button
                              key={t.value}
                              type="button"
                              onClick={() => setTimeWindow(t.value)}
                              className={`rounded-full border px-5 py-2.5 text-sm transition-colors ${
                                timeWindow === t.value
                                  ? "border-burgundy bg-burgundy text-white"
                                  : "border-line text-ink hover:border-burgundy/40"
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                          Other dates or times that could work (optional)
                        </span>
                        <textarea
                          value={alternatives}
                          onChange={(e) => setAlternatives(e.target.value)}
                          rows={3}
                          maxLength={300}
                          placeholder="e.g. Any Tuesday or Thursday in the next two weeks"
                          className={inputClass}
                        />
                      </label>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="mb-6 text-2xl">Your details</h2>
                    <div className="flex flex-col gap-4">
                      <input
                        type="text"
                        aria-label="Full name"
                        placeholder="Full name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={inputClass}
                      />
                      <input
                        type="email"
                        aria-label="Email address"
                        placeholder="Email address"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputClass}
                      />
                      <input
                        type="tel"
                        aria-label="Phone (optional)"
                        placeholder="Phone (optional)"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className={inputClass}
                      />
                      <textarea
                        aria-label="Notes"
                        placeholder="Anything you'd like us to know before your session?"
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        rows={4}
                        maxLength={MAX_NOTES_LENGTH}
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="mb-6 text-2xl">Review your request</h2>
                    <div className="mb-6 flex flex-col gap-3 rounded-xl bg-cream-soft p-5 text-sm text-ink/80">
                      {service && (
                        <p>
                          <span className="font-medium text-ink">Service:</span> {serviceLine}
                        </p>
                      )}
                      {preferredDate && (
                        <p>
                          <span className="font-medium text-ink">Preferred date:</span>{" "}
                          {formatDate(preferredDate)}
                        </p>
                      )}
                      {timeWindow && (
                        <p>
                          <span className="font-medium text-ink">Preferred time:</span> {timeWindow}
                        </p>
                      )}
                      {alternatives.trim() && (
                        <p>
                          <span className="font-medium text-ink">Alternatives:</span>{" "}
                          {alternatives.trim()}
                        </p>
                      )}
                      <p>
                        <span className="font-medium text-ink">Name:</span> {form.name || "—"}
                      </p>
                      <p>
                        <span className="font-medium text-ink">Email:</span> {form.email || "—"}
                      </p>
                    </div>

                    <p className="mb-6 text-sm leading-relaxed text-muted">
                      <strong className="font-semibold text-ink">This is a request, not a booking.</strong>{" "}
                      Clicking below opens your email app with these details ready to send. Nothing is
                      scheduled or reserved until we reply to confirm a time with you.
                    </p>

                    <a
                      href={mailtoHref}
                      onClick={() => setEmailOpened(true)}
                      className="inline-flex items-center justify-center rounded-full bg-burgundy px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-burgundy-dark"
                    >
                      Email This Request
                    </a>

                    {emailOpened && (
                      <div className="mt-6 rounded-xl border border-line bg-cream-soft p-5 text-sm leading-relaxed text-ink/80">
                        <p className="mb-2 font-medium text-ink">Your email app should have opened.</p>
                        <p className="mb-3">
                          Your request is only sent once you press send in that email. If nothing opened,
                          copy the details below and email them to{" "}
                          <a href={`mailto:${CONTACT_EMAIL}`} className="text-burgundy hover:text-coral">
                            {CONTACT_EMAIL}
                          </a>
                          .
                        </p>
                        <pre className="whitespace-pre-wrap break-words rounded-lg bg-white p-4 font-sans text-xs text-ink/80">
                          {summaryLines}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
              <button
                type="button"
                onClick={goBack}
                disabled={step === 0}
                className="text-xs font-semibold uppercase tracking-[0.1em] text-muted transition-colors hover:text-burgundy disabled:cursor-not-allowed disabled:opacity-0"
              >
                &larr; Back
              </button>
              {step < STEPS.length - 1 && (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canProceed}
                  className="rounded-full bg-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-burgundy-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue &rarr;
                </button>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
