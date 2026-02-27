// ============================================
// Usage Meter Component
// ============================================
// Shows monthly post usage relative to plan limit
// with upgrade prompt for free users

"use client";

import Link from "next/link";
import { Crown, AlertTriangle, Check, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { DashboardStats } from "@/types";

interface UsageMeterProps {
  stats: DashboardStats;
}

export default function UsageMeter({ stats }: UsageMeterProps) {
  const { postsThisMonth, monthlyLimit, isProUser } = stats;

  // Pro users see a different card
  if (isProUser) {
    return (
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 dark:from-amber-900/10 dark:to-orange-900/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Pro Plan
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Unlimited posts · All features
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
            <Check className="h-4 w-4" />
            <span>
              {postsThisMonth} posts created this month
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Free plan usage meter
  const usagePercent = (postsThisMonth / monthlyLimit) * 100;
  const remaining = monthlyLimit - postsThisMonth;
  const isNearLimit = usagePercent >= 70;
  const isAtLimit = postsThisMonth >= monthlyLimit;

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Monthly Usage
          </h3>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-semibold",
              isAtLimit
                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                : isNearLimit
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            )}
          >
            {isAtLimit ? "Limit Reached" : `${remaining} left`}
          </span>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              Posts this month
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {postsThisMonth} / {monthlyLimit}
            </span>
          </div>
          <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-surface-700">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700 ease-out",
                isAtLimit
                  ? "bg-red-500"
                  : isNearLimit
                    ? "bg-amber-500"
                    : "bg-emerald-500"
              )}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Warning */}
        {isNearLimit && !isAtLimit && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-900/10">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              You&apos;re approaching your monthly limit
            </p>
          </div>
        )}

        {isAtLimit && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 dark:bg-red-900/10">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
            <p className="text-xs text-red-700 dark:text-red-400">
              You&apos;ve reached your limit. Upgrade for unlimited posts!
            </p>
          </div>
        )}
      </div>

      {/* Upgrade CTA */}
      <div className="border-t border-slate-100 bg-slate-50/80 px-6 py-4 dark:border-surface-700 dark:bg-surface-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Upgrade to Pro
            </span>
          </div>
          <Link href="/settings/billing">
            <Button
              size="xs"
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              $5/mo
            </Button>
          </Link>
        </div>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          Unlimited posts, custom categories & more
        </p>
      </div>
    </div>
  );
}