// ============================================
// Features Section
// ============================================
// Highlights the 6 key features with icons

"use client";

import {
  Calendar,
  Columns3,
  GripVertical,
  BarChart3,
  Shield,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Calendar,
    title: "Calendar View",
    description:
      "See your entire month at a glance. Plan blog posts, videos, and social content on an intuitive visual calendar.",
    color: "from-blue-500 to-cyan-500",
    shadowColor: "shadow-blue-500/20",
  },
  {
    icon: Columns3,
    title: "Kanban Board",
    description:
      "Track every piece of content through your pipeline — from Idea to Writing to Editing to Published.",
    color: "from-purple-500 to-pink-500",
    shadowColor: "shadow-purple-500/20",
  },
  {
    icon: GripVertical,
    title: "Drag & Drop",
    description:
      "Effortlessly reschedule content by dragging posts between dates or status columns. Planning has never been this fun.",
    color: "from-amber-500 to-orange-500",
    shadowColor: "shadow-amber-500/20",
  },
  {
    icon: BarChart3,
    title: "Smart Dashboard",
    description:
      "Get a real-time overview of your content pipeline with stats, charts, and upcoming deadlines all in one place.",
    color: "from-emerald-500 to-teal-500",
    shadowColor: "shadow-emerald-500/20",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your content plans are yours alone. Secured with industry-standard authentication and encrypted data storage.",
    color: "from-brand-500 to-brand-600",
    shadowColor: "shadow-brand-500/20",
  },
  {
    icon: Smartphone,
    title: "Fully Responsive",
    description:
      "Plan on the go. ContentCal works beautifully on desktop, tablet, and mobile — with dark mode support.",
    color: "from-rose-500 to-red-500",
    shadowColor: "shadow-rose-500/20",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ---- Section Header ---- */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Features
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Everything You Need to Stay Consistent
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Built specifically for solo creators who want to plan smarter and
            publish consistently.
          </p>
        </div>

        {/* ---- Features Grid ---- */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-surface-700 dark:bg-surface-800"
            >
              {/* Icon */}
              <div
                className={cn(
                  "mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg transition-transform group-hover:scale-110",
                  feature.color,
                  feature.shadowColor
                )}
              >
                <feature.icon className="h-7 w-7 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}