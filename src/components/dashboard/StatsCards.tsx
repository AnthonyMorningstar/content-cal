// ============================================
// Stats Cards Component
// ============================================
// Four key metrics at the top of the dashboard

"use client";

import {
  FileText,
  Calendar,
  Pencil,
  Rocket,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats: DashboardStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "Total Posts",
      value: stats.totalPosts,
      icon: FileText,
      color:
        "text-brand-600 bg-brand-50 dark:text-brand-400 dark:bg-brand-900/20",
      iconColor: "text-brand-600 dark:text-brand-400",
      description: "All time",
    },
    {
      label: "This Month",
      value: `${stats.postsThisMonth}${
        stats.isProUser ? "" : ` / ${stats.monthlyLimit}`
      }`,
      icon: Calendar,
      color:
        "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      description: stats.isProUser ? "Unlimited (Pro)" : "Monthly limit",
      showProgress: !stats.isProUser,
      progress: stats.isProUser
        ? 0
        : (stats.postsThisMonth / stats.monthlyLimit) * 100,
    },
    {
      label: "In Progress",
      value:
        stats.postsByStatus.WRITING + stats.postsByStatus.EDITING,
      icon: Pencil,
      color:
        "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      description: `${stats.postsByStatus.WRITING} writing · ${stats.postsByStatus.EDITING} editing`,
    },
    {
      label: "Published",
      value: stats.postsByStatus.PUBLISHED,
      icon: Rocket,
      color:
        "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      description: "Completed content",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="card p-5 transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {card.label}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {card.value}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {card.description}
              </p>
            </div>

            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl",
                card.color
              )}
            >
              <card.icon className={cn("h-5 w-5", card.iconColor)} />
            </div>
          </div>

          {/* Monthly progress bar (free plan only) */}
          {card.showProgress && (
            <div className="mt-3">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-surface-700">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    card.progress! >= 90
                      ? "bg-red-500"
                      : card.progress! >= 70
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                  )}
                  style={{ width: `${Math.min(card.progress!, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}