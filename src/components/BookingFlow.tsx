"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import Stepper from "@/components/Stepper";
import { BOOKING_DATES, BOOKING_TIMES } from "@/lib/dummy-data";
import { CONTACT_EMAIL } from "@/lib/nav-links";

type ServiceOption = {
  id: string;
  title: string;
  duration?: string;
  price?: string;
  description?: string;
};

const STEPS = ["Service", "Date & Time", "Your Details", "Confirm"];
const EASE = [0.22, 1, 0.36, 1] as const;

export default function BookingFlow({ services }: { services: ServiceOption[] }) {
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [dateIso, setDateIso] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });

  const service = services.find((s) => s.id === serviceId);
  const date = BOOKING_DATES.find((d) => d.iso === dateIso);

  const canProceed =
    (step === 0 && !!serviceId) ||
    (step === 1 && !!dateIso && !!time) ||
    (step === 2 && !!form.name && !!form.email) ||
    step === 3;

  const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const summaryLines = [
    service && `Service: ${service.title} (${service.duration}, ${service.price})`,
    date && time && `When: ${date.weekday}, ${date.month} ${date.day} at ${time}`,
    form.name && `Name: ${form.name}`,
    form.email && `Email: ${form.email}`,
  ]
    .filter(Boolean)
    .join("\n");

  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    "Booking Request"
  )}&body=${encodeURIComponent(summaryLines)}`;

  return (
    <>
      <section className="border-b border-line bg-gradient-to-br from-white via-cream to-[#f2e4dd]">
        <Container className="flex min-h-0 items-center py-16 sm:min-h-[320px] sm:py-20">
          <Reveal className="max-w-2xl">
            <Eyebrow>Book a Consult</Eyebrow>
            <h1 className="mb-4 text-4xl sm:text-5xl">Schedule your session.</h1>
            <p className="text-lg leading-relaxed text-ink/80">
              A preview of what booking will look like. Real-time scheduling will run through
              Practice Better once connected&mdash;for now, complete the steps below and we&rsquo;ll
              follow up by email.
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
                            <span className="text-sm font-medium text-burgundy">{s.price}</span>
                          </div>
                          <p className="mt-1 text-sm text-muted">
                            {s.duration} &middot; {s.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h2 className="mb-6 text-2xl">Pick a date &amp; time</h2>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                      Date
                    </p>
                    <div className="mb-8 grid grid-cols-3 gap-3 sm:grid-cols-6">
                      {BOOKING_DATES.map((d) => (
                        <button
                          key={d.iso}
                          type="button"
                          onClick={() => setDateIso(d.iso)}
                          className={`rounded-xl border p-3 text-center transition-colors ${
                            dateIso === d.iso
                              ? "border-burgundy bg-burgundy/5"
                              : "border-line hover:border-burgundy/40"
                          }`}
                        >
                          <span className="block text-[10px] uppercase text-muted">
                            {d.weekday}
                          </span>
                          <span className="block text-lg text-ink">{d.day}</span>
                          <span className="block text-[10px] uppercase text-muted">
                            {d.month}
                          </span>
                        </button>
                      ))}
                    </div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                      Time
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {BOOKING_TIMES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTime(t)}
                          className={`rounded-full border px-5 py-2.5 text-sm transition-colors ${
                            time === t
                              ? "border-burgundy bg-burgundy text-white"
                              : "border-line text-ink hover:border-burgundy/40"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="mb-6 text-2xl">Your details</h2>
                    <div className="flex flex-col gap-4">
                      <input
                        type="text"
                        placeholder="Full name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-burgundy"
                      />
                      <input
                        type="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-burgundy"
                      />
                      <input
                        type="tel"
                        placeholder="Phone (optional)"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-burgundy"
                      />
                      <textarea
                        placeholder="Anything you'd like us to know before your session?"
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        rows={4}
                        className="rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-burgundy"
                      />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="mb-6 text-2xl">Review &amp; confirm</h2>
                    <div className="mb-6 flex flex-col gap-3 rounded-xl bg-cream-soft p-5 text-sm text-ink/80">
                      {service && (
                        <p>
                          <span className="font-medium text-ink">Service:</span> {service.title}{" "}
                          ({service.duration}, {service.price})
                        </p>
                      )}
                      {date && time && (
                        <p>
                          <span className="font-medium text-ink">When:</span> {date.weekday},{" "}
                          {date.month} {date.day} at {time}
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
                      This is a sample booking flow&mdash;nothing has been scheduled yet. Click
                      below to send these details by email and we&rsquo;ll confirm a time with you
                      directly.
                    </p>
                    <a
                      href={mailtoHref}
                      className="inline-flex items-center justify-center rounded-full bg-burgundy px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-burgundy-dark"
                    >
                      Send Request by Email
                    </a>
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
