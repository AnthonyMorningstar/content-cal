// ============================================
// Calendar Logic Hook
// ============================================
// Handles month navigation, date calculations,
// and mapping posts to calendar days

"use client";

import { useState, useMemo, useCallback } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  format,
} from "date-fns";
import type { PostWithCategory, CalendarDay } from "@/types";

export function useCalendar(posts: PostWithCategory[]) {
  // Current month being viewed
  const [currentDate, setCurrentDate] = useState(new Date());

  // Navigate months
  const goToNextMonth = useCallback(() => {
    setCurrentDate((prev) => addMonths(prev, 1));
  }, []);

  const goToPrevMonth = useCallback(() => {
    setCurrentDate((prev) => subMonths(prev, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const goToMonth = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  // Current month/year info
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthLabel = format(currentDate, "MMMM yyyy");

  // Generate calendar days (6 weeks grid = 42 cells)
  const calendarDays: CalendarDay[] = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);

    // Start from Monday of the week containing the 1st
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    // End on Sunday of the week containing the last day
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
    });

    return days.map((date) => {
      // Find posts scheduled for this day
      const dayPosts = posts
        .filter((post) => {
          if (!post.calendarDate) return false;
          return isSameDay(new Date(post.calendarDate), date);
        })
        .sort((a, b) => a.calendarOrder - b.calendarOrder);

      return {
        date,
        isCurrentMonth: isSameMonth(date, currentDate),
        isToday: isToday(date),
        posts: dayPosts,
      };
    });
  }, [currentDate, posts]);

  // Posts without a date (unscheduled)
  const unscheduledPosts = useMemo(() => {
    return posts.filter((post) => !post.calendarDate);
  }, [posts]);

  // Get the date range for the current month view (for API queries)
  const dateRange = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return {
      start: calendarStart,
      end: calendarEnd,
      monthStart,
      monthEnd,
    };
  }, [currentDate]);

  return {
    currentDate,
    currentMonth,
    currentYear,
    monthLabel,
    calendarDays,
    unscheduledPosts,
    dateRange,
    goToNextMonth,
    goToPrevMonth,
    goToToday,
    goToMonth,
  };
}