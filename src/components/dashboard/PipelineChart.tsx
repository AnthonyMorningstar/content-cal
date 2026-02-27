// ============================================
// Pipeline Chart Component
// ============================================
// Visual breakdown of posts by status with
// horizontal bars (no chart library needed!)

"use client";

import { STATUS_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { DashboardStats } from "@/types";

interface PipelineChartProps {
  stats: DashboardStats;
}

export default function PipelineChart({ stats }: PipelineChartProps) {
  const total = stats.totalPosts;

  const statuses = [
    {
      key: "IDEA" as const,
      count: stats.postsByStatus.IDEA,
      config: STATUS_CONFIG.IDEA,
    },
    {
      key: "WRITING" as const,
      count: stats.postsByStatus.WRITING,
      config: STATUS_CONFIG.WRITING,
    },
    {
      key: "EDITING" as const,
      count: stats.postsByStatus.EDITING,
      config: STATUS_CONFIG.EDITING,
    },
    {
      key: "PUBLISHED" as const,
      count: stats.postsByStatus.PUBLISHED,
      config: STATUS_CONFIG.PUBLISHED,
    },
  ];

  return (
    <div className="card p-6">
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
        Content Pipeline
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Breakdown by status
      </p>

      <div className="mt-6 space-y-4">
        {statuses.map(({ key, count, config }) => {
          const percentage = total > 0 ? (count / total) * 100 : 0;

          return (
            <div key={key}>
              {/* Label row */}
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{config.icon}</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {config.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {count}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    ({Math.round(percentage)}%)
                  </span>
                </div>
              </div>

              {/* Bar */}
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-surface-700">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: config.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      {total > 0 && (
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-surface-700">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Total
          </span>
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            {total}
          </span>
        </div>
      )}
    </div>
  );
}