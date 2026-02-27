// ============================================
// Public Pricing Page
// ============================================
// Standalone pricing page with detailed
// comparison and FAQ

import Link from "next/link";
import {
  Check,
  X,
  Crown,
  Sparkles,
  ArrowRight,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/landing/Footer";
import { PLAN_LIMITS } from "@/lib/constants";

// Detailed feature comparison
const comparisonFeatures = [
  { feature: "Content posts per month", free: "10", pro: "Unlimited" },
  { feature: "Calendar view", free: true, pro: true },
  { feature: "Kanban board view", free: true, pro: true },
  { feature: "Drag & drop scheduling", free: true, pro: true },
  { feature: "Status tracking pipeline", free: true, pro: true },
  { feature: "Quick add from calendar", free: true, pro: true },
  { feature: "Dark mode", free: true, pro: true },
  { feature: "Mobile responsive", free: true, pro: true },
  { feature: "Custom categories", free: false, pro: true },
  { feature: "Historical data access", free: false, pro: true },
  { feature: "Custom post colors", free: false, pro: true },
  { feature: "Priority support", free: false, pro: true },
  { feature: "Export data", free: false, pro: true },
  { feature: "Advanced analytics", free: false, pro: true },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-900">
      <LandingNavbar />

      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ---- Back Link ---- */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          {/* ---- Header ---- */}
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 dark:border-brand-800 dark:bg-brand-900/20 dark:text-brand-300">
              <Sparkles className="h-4 w-4" />
              Simple Pricing
            </span>
            <h1 className="mt-6 text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl">
              One Plan. One Price.{" "}
              <span className="text-gradient">No Surprises.</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Start free, upgrade to Pro when you&apos;re ready. Cancel anytime.
            </p>
          </div>

          {/* ---- Pricing Cards ---- */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            {/* Free Plan */}
            <div className="rounded-2xl border-2 border-slate-200 bg-white p-8 dark:border-surface-700 dark:bg-surface-800">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Free
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Everything you need to get started
              </p>
              <div className="mt-6 flex items-baseline">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-white">
                  $0
                </span>
                <span className="ml-2 text-slate-500">/month</span>
              </div>

              <ul className="mt-8 space-y-4">
                {PLAN_LIMITS.FREE.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400"
                  >
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/register" className="mt-8 block">
                <button className="w-full rounded-xl border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-400 hover:shadow-md dark:border-surface-600 dark:bg-surface-800 dark:text-slate-200 dark:hover:border-surface-500">
                  Get Started Free
                </button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="relative rounded-2xl border-2 border-brand-500 bg-white p-8 shadow-xl shadow-brand-500/10 dark:border-brand-500 dark:bg-surface-800">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 px-5 py-1.5 text-sm font-semibold text-white shadow-lg">
                  <Sparkles className="h-4 w-4" />
                  Most Popular
                </span>
              </div>

              <h3 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                <Crown className="h-6 w-6 text-amber-500" />
                Pro
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                For serious content creators
              </p>
              <div className="mt-6 flex items-baseline">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-white">
                  $5
                </span>
                <span className="ml-2 text-slate-500">/month</span>
              </div>

              <ul className="mt-8 space-y-4">
                {PLAN_LIMITS.PRO.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400"
                  >
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/register" className="mt-8 block">
                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-700 hover:shadow-xl">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* ---- Feature Comparison Table ---- */}
          <div className="mx-auto mt-20 max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 dark:text-white">
              Detailed Comparison
            </h2>

            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-surface-700">
              {/* Table header */}
              <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-surface-700 dark:bg-surface-800">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Feature
                </span>
                <span className="text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Free
                </span>
                <span className="text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <span className="inline-flex items-center gap-1">
                    <Crown className="h-4 w-4 text-amber-500" />
                    Pro
                  </span>
                </span>
              </div>

              {/* Table rows */}
              {comparisonFeatures.map((row, i) => (
                <div
                  key={row.feature}
                  className={cn(
                    "grid grid-cols-3 px-6 py-3.5",
                    i !== comparisonFeatures.length - 1 &&
                      "border-b border-slate-100 dark:border-surface-700",
                    i % 2 === 0 && "bg-white dark:bg-surface-800",
                    i % 2 === 1 && "bg-slate-50/50 dark:bg-surface-800/50"
                  )}
                >
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {row.feature}
                  </span>
                  <span className="flex justify-center">
                    {typeof row.free === "boolean" ? (
                      row.free ? (
                        <Check className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <X className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                      )
                    ) : (
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {row.free}
                      </span>
                    )}
                  </span>
                  <span className="flex justify-center">
                    {typeof row.pro === "boolean" ? (
                      row.pro ? (
                        <Check className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <X className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                      )
                    ) : (
                      <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                        {row.pro}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ---- Bottom CTA ---- */}
          <div className="mx-auto mt-16 max-w-xl text-center">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Ready to get started?
            </h3>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Create your free account in seconds and start planning today.
            </p>
            <Link href="/register" className="mt-6 inline-block">
              <button className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-700 hover:shadow-xl">
                <Calendar className="h-5 w-5" />
                Create Free Account
              </button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Need cn import for comparison table
import { cn } from "@/lib/utils";