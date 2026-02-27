// ============================================
// Upgrade Prompt Component
// ============================================
// Inline prompt shown when user hits their limit
// or tries to use a Pro feature on Free plan

"use client";

import { useState } from "react";
import Link from "next/link";
import { Crown, ArrowRight, X, Sparkles, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface UpgradePromptProps {
  /** Where to show the prompt */
  variant?: "banner" | "inline" | "modal-like";
  /** Whether the prompt can be dismissed */
  dismissible?: boolean;
  /** Custom title */
  title?: string;
  /** Custom description */
  description?: string;
  className?: string;
}

export default function UpgradePrompt({
  variant = "inline",
  dismissible = true,
  title,
  description,
  className,
}: UpgradePromptProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  // ---- Banner variant (full width) ----
  if (variant === "banner") {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-xl bg-gradient-to-r from-brand-600 via-purple-600 to-brand-700 p-4 text-white shadow-lg shadow-brand-500/20 sm:p-5",
          className
        )}
      >
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-8 right-12 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">
                {title || "Upgrade to Pro"}
              </h3>
              <p className="text-sm text-white/80">
                {description ||
                  "Get unlimited posts, custom categories, and more for just $5/month"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/settings/billing">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-brand-700 hover:bg-brand-50 dark:bg-white dark:text-brand-700"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Upgrade
              </Button>
            </Link>
            {dismissible && (
              <button
                onClick={() => setIsDismissed(true)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---- Inline variant (compact) ----
  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800/50 dark:bg-amber-900/10",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <p className="text-sm text-amber-800 dark:text-amber-300">
            {title ||
              "You've reached your monthly limit. Upgrade for unlimited posts!"}
          </p>
        </div>
        <Link href="/settings/billing">
          <Button size="xs" className="shrink-0">
            Upgrade
          </Button>
        </Link>
      </div>
    );
  }

  // ---- Modal-like variant (centered card) ----
  return (
    <div
      className={cn(
        "mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-surface-700 dark:bg-surface-800",
        className
      )}
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 shadow-lg shadow-brand-500/20">
        <Sparkles className="h-8 w-8 text-white" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        {title || "Unlock Pro Features"}
      </h3>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {description ||
          "You've reached the free plan limit. Upgrade to Pro for unlimited posts and premium features."}
      </p>

      <div className="mt-6 space-y-3">
        <Link href="/settings/billing" className="block">
          <Button
            fullWidth
            leftIcon={<Crown className="h-4 w-4" />}
          >
            Upgrade to Pro — $5/mo
          </Button>
        </Link>

        {dismissible && (
          <button
            onClick={() => setIsDismissed(true)}
            className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          >
            Maybe later
          </button>
        )}
      </div>
    </div>
  );
}