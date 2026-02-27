// ============================================
// Content Type Chart Component
// ============================================
// Donut-style visual showing breakdown by
// content type (Blog, YouTube, Social, etc.)

"use client";

import { CONTENT_TYPE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { DashboardStats } from "@/types";

interface ContentTypeChartProps {
  stats: DashboardStats;
}

export default function ContentTypeChart({ stats }: ContentTypeChartProps) {
  const total = stats.totalPosts;

  const types = [
    {
      key: "BLOG_POST" as const,
      count: stats.postsByType.BLOG_POST,
      config: CONTENT_TYPE_CONFIG.BLOG_POST,
    },
    {
      key: "YOUTUBE_VIDEO" as const,
      count: stats.postsByType.YOUTUBE_VIDEO,
      config: CONTENT_TYPE_CONFIG.YOUTUBE_VIDEO,
    },
    {
      key: "SOCIAL_MEDIA" as const,
      count: stats.postsByType.SOCIAL_MEDIA,
      config: CONTENT_TYPE_CONFIG.SOCIAL_MEDIA,
    },
    {
      key: "PODCAST" as const,
      count: stats.postsByType.PODCAST,
      config: CONTENT_TYPE_CONFIG.PODCAST,
    },
    {
      key: "OTHER" as const,
      count: stats.postsByType.OTHER,
      config: CONTENT_TYPE_CONFIG.OTHER,
    },
  ].filter((t) => t.count > 0);

  // Calculate donut segments
  let cumulativePercent = 0;
  const segments = types.map((type) => {
    const percent = total > 0 ? (type.count / total) * 100 : 0;
    const segment = {
      ...type,
      percent,
      offset: cumulativePercent,
    };
    cumulativePercent += percent;
    return segment;
  });

  return (
    <div className="card p-6">
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
        Content Types
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        What you create
      </p>

      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
        {/* Donut chart */}
        <div className="relative h-36 w-36 shrink-0">
          <svg
            viewBox="0 0 36 36"
            className="h-full w-full -rotate-90"
          >
            {/* Background circle */}
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              className="stroke-slate-100 dark:stroke-surface-700"
              strokeWidth="3"
            />

            {/* Segments */}
            {total > 0 &&
              segments.map((segment) => (
                <circle
                  key={segment.key}
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke={segment.config.color}
                  strokeWidth="3"
                  strokeDasharray={`${segment.percent} ${100 - segment.percent}`}
                  strokeDashoffset={`${-segment.offset}`}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              ))}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {total}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              TOTAL
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2.5">
          {types.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">
              No posts yet
            </p>
          ) : (
            types.map((type) => (
              <div
                key={type.key}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: type.config.color }}
                  />
                  <span className="text-sm">{type.config.icon}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {type.config.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {type.count}
                  </span>
                  <span className="w-10 text-right text-xs text-slate-400 dark:text-slate-500">
                    {Math.round(type.percent)}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}