// ============================================
// Pricing Section (Landing Page)
// ============================================
// Embedded pricing comparison for the landing page

"use client";

import Link from "next/link";
import {
  Check,
  Crown,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { PLAN_LIMITS } from "@/lib/constants";

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ---- Section Header ---- */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Pricing
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Start free, upgrade when you need more. No hidden fees, cancel
            anytime.
          </p>
        </div>

        {/* ---- Pricing Cards ---- */}
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          {/* Free Plan */}
          <div className="relative rounded-2xl border-2 border-slate-200 bg-white p-8 transition-all hover:shadow-lg dark:border-surface-700 dark:bg-surface-800">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Free
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Perfect for getting started
              </p>

              <div className="mt-6 flex items-baseline">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-white">
                  $0
                </span>
                <span className="ml-2 text-slate-500 dark:text-slate-400">
                  /month
                </span>
              </div>
            </div>

            <ul className="mb-8 space-y-4">
              {PLAN_LIMITS.FREE.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400"
                >
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link href="/register">
              <Button variant="outline" fullWidth size="lg">
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-2xl border-2 border-brand-500 bg-white p-8 shadow-xl shadow-brand-500/10 transition-all hover:shadow-2xl dark:border-brand-500 dark:bg-surface-800">
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 px-5 py-1.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25">
                <Sparkles className="h-4 w-4" />
                Most Popular
              </span>
            </div>

            <div className="mb-8">
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
                <span className="ml-2 text-slate-500 dark:text-slate-400">
                  /month
                </span>
              </div>
            </div>

            <ul className="mb-8 space-y-4">
              {PLAN_LIMITS.PRO.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400"
                >
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link href="/register">
              <Button
                fullWidth
                size="lg"
                rightIcon={<ArrowRight className="h-5 w-5" />}
                className="shadow-lg shadow-brand-500/25"
              >
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>

        {/* ---- Money-back guarantee ---- */}
        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          ✨ 7-day money-back guarantee · Cancel anytime · No questions asked
        </p>
      </div>
    </section>
  );
}