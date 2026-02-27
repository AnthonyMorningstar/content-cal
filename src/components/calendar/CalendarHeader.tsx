// ============================================
// Calendar Header
// ============================================
// Month/year display with navigation arrows
// and "Today" button

"use client";

import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface CalendarHeaderProps {
  monthLabel: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  className?: string;
}

export default function CalendarHeader({
  monthLabel,
  onPrevMonth,
  onNextMonth,
  onToday,
  className,
}: CalendarHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      {/* Month & Year */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          {monthLabel}
        </h2>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2">
        {/* Today button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          leftIcon={<CalendarDays className="h-4 w-4" />}
        >
          Today
        </Button>

        {/* Prev / Next */}
        <div className="flex rounded-lg border border-slate-200 dark:border-surface-600">
          <button
            onClick={onPrevMonth}
            className="flex h-9 w-9 items-center justify-center rounded-l-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-surface-700 dark:hover:text-white"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="w-px bg-slate-200 dark:bg-surface-600" />
          <button
            onClick={onNextMonth}
            className="flex h-9 w-9 items-center justify-center rounded-r-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-surface-700 dark:hover:text-white"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}