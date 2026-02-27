// ============================================
// Final CTA Section
// ============================================
// Last push before the footer to convert visitors

"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";

export default function CTA() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-purple-800 px-8 py-16 text-center shadow-2xl shadow-brand-500/20 sm:px-16 sm:py-20">
          {/* Decorations */}
          <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute left-1/3 top-0 h-32 w-32 rounded-full bg-white/5" />

          <div className="relative">
            {/* Icon */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <Sparkles className="h-8 w-8 text-white" />
            </div>

            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Ready to Plan Your Best Content Yet?
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-lg text-brand-100">
              Join thousands of creators who plan smarter with ContentCal.
              Start free — no credit card required.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button
                  size="xl"
                  variant="secondary"
                  className="bg-white text-brand-700 hover:bg-brand-50 shadow-xl dark:bg-white dark:text-brand-700 dark:hover:bg-brand-50"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  size="xl"
                  variant="ghost"
                  className="text-white hover:bg-white/10 dark:text-white dark:hover:bg-white/10"
                  leftIcon={<Calendar className="h-5 w-5" />}
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}