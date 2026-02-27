// ============================================
// Hero Section
// ============================================
// The first thing visitors see — big headline,
// subtext, CTA buttons, and a product preview

"use client";

import Link from "next/link";
import {
  ArrowRight,
  Play,
  Calendar,
  Columns3,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24">
      {/* ---- Background Decoration ---- */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Gradient blobs */}
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-brand-400/20 blur-3xl dark:bg-brand-600/10" />
        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl dark:bg-purple-600/10" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-600/5" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* ---- Badge ---- */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 dark:border-brand-800 dark:bg-brand-900/20">
            <Sparkles className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            <span className="text-sm font-medium text-brand-700 dark:text-brand-300">
              The Content Calendar for Creators
            </span>
          </div>

          {/* ---- Headline ---- */}
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Plan Your Content.{" "}
            <span className="text-gradient">Grow Your Audience.</span>
          </h1>

          {/* ---- Subheadline ---- */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400 sm:text-xl">
            The drag-and-drop content calendar that helps bloggers, YouTubers,
            and creators stay consistent, organized, and never miss a publish
            date.
          </p>

          {/* ---- CTA Buttons ---- */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button
                size="xl"
                rightIcon={<ArrowRight className="h-5 w-5" />}
                className="shadow-lg shadow-brand-500/25"
              >
                Start Free — No Card Required
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button
                variant="outline"
                size="xl"
                leftIcon={<Play className="h-5 w-5" />}
              >
                See How It Works
              </Button>
            </a>
          </div>

          {/* ---- Trust Signals ---- */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {[
              "Free forever plan",
              "No credit card required",
              "Set up in 2 minutes",
            ].map((text) => (
              <div
                key={text}
                className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* ---- Product Preview ---- */}
        <div className="relative mx-auto mt-16 max-w-5xl sm:mt-20">
          {/* Glow behind the preview */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-brand-500/20 via-purple-500/20 to-cyan-500/20 blur-2xl dark:from-brand-500/10 dark:via-purple-500/10 dark:to-cyan-500/10" />

          {/* Preview card */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl dark:border-surface-700 dark:bg-surface-800">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-surface-700">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="mx-auto w-64 rounded-md bg-slate-100 px-3 py-1 text-center text-xs text-slate-400 dark:bg-surface-700 dark:text-slate-500">
                  app.contentcal.io/calendar
                </div>
              </div>
            </div>

            {/* Simulated calendar preview */}
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  December 2024
                </h3>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 dark:bg-brand-900/20 dark:text-brand-400">
                    <Calendar className="h-3.5 w-3.5" />
                    Calendar
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 dark:bg-surface-700 dark:text-slate-400">
                    <Columns3 className="h-3.5 w-3.5" />
                    Board
                  </div>
                </div>
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <div
                      key={day}
                      className="py-1 text-center text-xs font-semibold text-slate-400 dark:text-slate-500"
                    >
                      {day}
                    </div>
                  )
                )}
                {Array.from({ length: 35 }).map((_, i) => {
                  const dayNum = i - 1;
                  const hasPost =
                    dayNum === 3 ||
                    dayNum === 7 ||
                    dayNum === 10 ||
                    dayNum === 14 ||
                    dayNum === 18 ||
                    dayNum === 22 ||
                    dayNum === 25;
                  const isToday = dayNum === 10;

                  return (
                    <div
                      key={i}
                      className={`min-h-[60px] rounded-lg border p-1.5 ${
                        dayNum < 0 || dayNum > 30
                          ? "border-transparent opacity-30"
                          : isToday
                            ? "border-brand-400 bg-brand-50/50 dark:border-brand-500 dark:bg-brand-900/10"
                            : "border-slate-100 dark:border-surface-700"
                      }`}
                    >
                      {dayNum >= 0 && dayNum <= 30 && (
                        <>
                          <span
                            className={`text-xs font-medium ${
                              isToday
                                ? "flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white"
                                : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {dayNum + 1}
                          </span>
                          {hasPost && (
                            <div
                              className={`mt-1 rounded px-1 py-0.5 text-[9px] font-medium ${
                                dayNum === 3
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                                  : dayNum === 7 || dayNum === 22
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                    : dayNum === 14 || dayNum === 25
                                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                                      : "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                              }`}
                            >
                              {dayNum === 3
                                ? "📝 Blog Draft"
                                : dayNum === 7
                                  ? "🎬 Film Video"
                                  : dayNum === 10
                                    ? "✍️ Write Post"
                                    : dayNum === 14
                                      ? "🚀 Publish"
                                      : dayNum === 18
                                        ? "🔍 Edit Draft"
                                        : dayNum === 22
                                          ? "🎬 YouTube"
                                          : "📱 Social"}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}