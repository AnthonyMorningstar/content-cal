// ============================================
// How It Works Section
// ============================================
// 3-step process: Sign Up → Plan → Publish

"use client";

import { UserPlus, CalendarPlus, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Account",
    description:
      "Sign up in seconds with Google, GitHub, or email. No credit card needed — start with the free plan.",
    color: "bg-brand-500",
  },
  {
    number: "02",
    icon: CalendarPlus,
    title: "Plan Your Content",
    description:
      "Add your content ideas, drag them onto the calendar, and organize them with statuses and categories.",
    color: "bg-purple-500",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Publish Consistently",
    description:
      "Track progress through your pipeline. Never miss a publish date and watch your audience grow.",
    color: "bg-emerald-500",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-slate-50 py-20 dark:bg-surface-800/50 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ---- Section Header ---- */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            How It Works
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Up and Running in Minutes
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Three simple steps to transform your content workflow.
          </p>
        </div>

        {/* ---- Steps ---- */}
        <div className="relative mt-16">
          {/* Connecting line (desktop) */}
          <div className="absolute left-0 right-0 top-24 hidden h-0.5 bg-gradient-to-r from-brand-500 via-purple-500 to-emerald-500 lg:block" />

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                {/* Step number badge */}
                <div className="relative mx-auto mb-6">
                  <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${step.color} shadow-xl text-white`}
                  >
                    <step.icon className="h-8 w-8" />
                  </div>
                  <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-extrabold text-slate-900 shadow-md ring-2 ring-slate-100 dark:bg-surface-800 dark:text-white dark:ring-surface-700">
                    {step.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}