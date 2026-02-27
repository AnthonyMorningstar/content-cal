// ============================================
// Board Statistics Bar
// ============================================
// Shows a visual progress bar of posts across
// all statuses at the top of the board

"use client";

import { STATUS_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { PostWithCategory } from "@/types";

interface BoardStatsProps {
  posts: PostWithCategory[];
}

export default function BoardStats({ posts }: BoardStatsProps) {
  const total = posts.length;

  if (total === 0) return null;

  const counts = {
    IDEA: posts.filter((p) => p.status === "IDEA").length,
    WRITING: posts.filter((p) => p.status === "WRITING").length,
    EDITING: posts.filter((p) => p.status === "EDITING").length,
    PUBLISHED: posts.filter((p) => p.status === "PUBLISHED").length,
  };

  const statuses = Object.entries(STATUS_CONFIG) as [
    keyof typeof STATUS_CONFIG,
    (typeof STATUS_CONFIG)[keyof typeof STATUS_CONFIG],
  ][];

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Pipeline Overview
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {total} total post{total !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Progress bar */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-surface-700">
        {statuses.map(([key, config]) => {
          const count = counts[key];
          const percentage = (count / total) * 100;

          if (count === 0) return null;

          return (
            <div
              key={key}
              className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
              style={{
                width: `${percentage}%`,
                backgroundColor: config.color,
              }}
              title={`${config.label}: ${count} (${Math.round(percentage)}%)`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
        {statuses.map(([key, config]) => {
          const count = counts[key];

          return (
            <div key={key} className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {config.icon} {config.label}
              </span>
              <span
                className={cn(
                  "text-xs font-semibold",
                  count > 0
                    ? "text-slate-700 dark:text-slate-300"
                    : "text-slate-300 dark:text-slate-600"
                )}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}