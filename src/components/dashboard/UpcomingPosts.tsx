// ============================================
// Upcoming Posts Component
// ============================================
// Shows posts scheduled in the next 7 days

"use client";

import Link from "next/link";
import {
  Calendar,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { StatusBadge } from "@/components/posts/StatusBadge";
import { formatDate } from "@/lib/utils";
import { isToday, isTomorrow, differenceInDays, addDays } from "date-fns";
import type { PostWithCategory } from "@/types";

interface UpcomingPostsProps {
  posts: PostWithCategory[];
}

export default function UpcomingPosts({ posts }: UpcomingPostsProps) {
  // Filter to only show posts with dates in the next 7 days
  const now = new Date();
  const weekFromNow = addDays(now, 7);

  const upcoming = posts
    .filter((post) => {
      if (!post.calendarDate) return false;
      const date = new Date(post.calendarDate);
      return date >= new Date(now.toDateString()) && date <= weekFromNow;
    })
    .sort(
      (a, b) =>
        new Date(a.calendarDate!).getTime() -
        new Date(b.calendarDate!).getTime()
    )
    .slice(0, 6);

  // Helper to get relative date label
  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    const days = differenceInDays(date, now);
    return `In ${days} days`;
  };

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-surface-700">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-brand-500" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Upcoming (7 days)
          </h3>
        </div>
        <Link href="/calendar">
          <span className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
            Calendar
            <ArrowRight className="h-3 w-3" />
          </span>
        </Link>
      </div>

      {/* Posts */}
      {upcoming.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
          <CheckCircle2 className="mb-2 h-8 w-8 text-emerald-400" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            No upcoming posts
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Schedule content from the calendar
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-surface-700">
          {upcoming.map((post) => {
            const date = new Date(post.calendarDate!);
            const dateLabel = getDateLabel(date);
            const isPostToday = isToday(date);

            return (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="group flex items-center gap-3 px-6 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-surface-800/50"
              >
                {/* Date badge */}
                <div className="flex w-14 shrink-0 flex-col items-center rounded-lg bg-slate-50 py-1.5 dark:bg-surface-700">
                  <span className="text-[10px] font-medium uppercase text-slate-400 dark:text-slate-500">
                    {formatDate(date, { month: "short" }).split(" ")[0]}
                  </span>
                  <span
                    className={`text-lg font-bold ${isPostToday
                        ? "text-brand-600 dark:text-brand-400"
                        : "text-slate-700 dark:text-slate-300"
                      }`}
                  >
                    {date.getDate()}
                  </span>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800 group-hover:text-brand-600 dark:text-slate-200 dark:group-hover:text-brand-400">
                    {post.title}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <StatusBadge
                      status={post.status}
                      size="xs"
                      showIcon={false}
                    />
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      {dateLabel}
                    </span>
                  </div>
                </div>

                {/* Color dot */}
                <div
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: post.color || "#6366F1" }}
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}