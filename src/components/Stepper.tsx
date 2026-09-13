"use client";

import { motion } from "motion/react";

export default function Stepper({
  steps,
  currentStep,
}: {
  steps: string[];
  currentStep: number;
}) {
  return (
    <div className="flex items-center">
      {steps.map((step, i) => {
        const isDone = i < currentStep;
        const isActive = i === currentStep;
        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${
                  isDone
                    ? "border-burgundy bg-burgundy text-white"
                    : isActive
                      ? "border-burgundy text-burgundy"
                      : "border-line text-muted"
                }`}
              >
                {isDone ? "✓" : i + 1}
              </div>
              <span
                className={`hidden text-[11px] uppercase tracking-[0.08em] sm:block ${
                  isActive || isDone ? "text-burgundy" : "text-muted"
                }`}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="mx-2 h-px flex-1 bg-line sm:mx-3">
                <motion.div
                  className="h-px bg-burgundy"
                  initial={false}
                  animate={{ width: isDone ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
