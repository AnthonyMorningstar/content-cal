// ============================================
// Calendar Cell Component
// ============================================
// Single day cell in the calendar grid
// Acts as a droppable zone for posts

"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import DraggablePost from "./DraggablePost";
import type { CalendarDay } from "@/types";
import type { PostWithCategory } from "@/types";

interface CalendarCellProps {
  day: CalendarDay;
  onPostClick: (post: PostWithCategory) => void;
  onQuickAdd: (date: Date) => void;
}

export default function CalendarCell({
  day,
  onPostClick,
  onQuickAdd,
}: CalendarCellProps) {
  const dateStr = format(day.date, "yyyy-MM-dd");

  // Make this cell a droppable zone
  const { isOver, setNodeRef } = useDroppable({
    id: `cell-${dateStr}`,
    data: {
      type: "cell",
      date: dateStr,
    },
  });

  const postIds = day.posts.map((p) => p.id);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        // Base cell styles
        "group relative flex min-h-[110px] flex-col rounded-lg border p-1.5 transition-all sm:min-h-[130px] sm:p-2",

        // Current month vs other month
        day.isCurrentMonth
          ? "border-slate-200 bg-white dark:border-surface-700 dark:bg-surface-800"
          : "border-slate-100 bg-slate-50/50 opacity-50 dark:border-surface-700/50 dark:bg-surface-900/50",

        // Today highlight
        day.isToday &&
          "border-brand-400 bg-brand-50/30 ring-1 ring-brand-400/30 dark:border-brand-500 dark:bg-brand-900/10 dark:ring-brand-500/20",

        // Drop target highlight
        isOver &&
          "border-brand-500 bg-brand-50 ring-2 ring-brand-500/30 dark:bg-brand-900/20 dark:ring-brand-400/30"
      )}
    >
      {/* ---- Day Header ---- */}
      <div className="mb-1 flex items-center justify-between">
        {/* Date number */}
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium sm:h-7 sm:w-7 sm:text-sm",
            day.isToday
              ? "bg-brand-600 font-bold text-white"
              : day.isCurrentMonth
                ? "text-slate-700 dark:text-slate-300"
                : "text-slate-400 dark:text-slate-600"
          )}
        >
          {format(day.date, "d")}
        </span>

        {/* Quick add button (visible on hover) */}
        {day.isCurrentMonth && (
          <button
            onClick={() => onQuickAdd(day.date)}
            className="flex h-5 w-5 items-center justify-center rounded-md text-slate-300 opacity-0 transition-all hover:bg-brand-100 hover:text-brand-600 group-hover:opacity-100 dark:text-slate-600 dark:hover:bg-brand-900/30 dark:hover:text-brand-400"
            title="Quick add post"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* ---- Posts in this cell ---- */}
      <div className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
        <SortableContext
          items={postIds}
          strategy={verticalListSortingStrategy}
        >
          {day.posts.map((post) => (
            <DraggablePost
              key={post.id}
              post={post}
              onClick={onPostClick}
            />
          ))}
        </SortableContext>
      </div>

      {/* Post count indicator for mobile (when too many posts) */}
      {day.posts.length > 2 && (
        <div className="mt-1 text-center text-[10px] font-medium text-slate-400 dark:text-slate-500 sm:hidden">
          +{day.posts.length - 2} more
        </div>
      )}
    </div>
  );
}