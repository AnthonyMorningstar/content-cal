// ============================================
// Calendar Grid Component
// ============================================
// The main calendar grid with drag-and-drop
// powered by @dnd-kit

"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { format } from "date-fns";
import CalendarCell from "./CalendarCell";
import UnscheduledSidebar from "./UnscheduledSidebar";
import DraggablePost from "./DraggablePost";
import { DAYS_SHORT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { CalendarDay, PostWithCategory } from "@/types";

interface CalendarGridProps {
  days: CalendarDay[];
  unscheduledPosts: PostWithCategory[];
  onPostClick: (post: PostWithCategory) => void;
  onQuickAdd: (date: Date) => void;
  onPostMove: (
    postId: string,
    newDate: string | null,
    newOrder: number
  ) => Promise<void>;
}

export default function CalendarGrid({
  days,
  unscheduledPosts,
  onPostClick,
  onQuickAdd,
  onPostMove,
}: CalendarGridProps) {
  const [activePost, setActivePost] = useState<PostWithCategory | null>(null);

  // Configure sensors (pointer + touch)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // 200ms hold to start drag on touch
        tolerance: 5,
      },
    })
  );

  // Find which post is being dragged
  const findPost = useCallback(
    (id: string): PostWithCategory | undefined => {
      // Check all calendar days
      for (const day of days) {
        const found = day.posts.find((p) => p.id === id);
        if (found) return found;
      }
      // Check unscheduled
      return unscheduledPosts.find((p) => p.id === id);
    },
    [days, unscheduledPosts]
  );

  // ---- Drag Start ----
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const post = findPost(event.active.id as string);
      if (post) setActivePost(post);
    },
    [findPost]
  );

  // ---- Drag Over (preview) ----
  const handleDragOver = useCallback((event: DragOverEvent) => {
    // Could add preview logic here if needed
  }, []);

  // ---- Drag End (commit changes) ----
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActivePost(null);

      const { active, over } = event;
      if (!over) return;

      const postId = active.id as string;
      const overId = over.id as string;

      // Determine the target date
      let targetDate: string | null = null;

      if (overId === "unscheduled") {
        // Dropped in unscheduled zone
        targetDate = null;
      } else if (overId.startsWith("cell-")) {
        // Dropped on a calendar cell
        targetDate = overId.replace("cell-", "");
      } else {
        // Dropped on another post — find which cell that post is in
        const overPost = findPost(overId);
        if (overPost?.calendarDate) {
          targetDate = format(
            new Date(overPost.calendarDate),
            "yyyy-MM-dd"
          );
        }
      }

      // Get current post data
      const currentPost = findPost(postId);
      if (!currentPost) return;

      const currentDate = currentPost.calendarDate
        ? format(new Date(currentPost.calendarDate), "yyyy-MM-dd")
        : null;

      // Only update if something changed
      if (currentDate === targetDate) return;

      // Calculate new order (place at end)
      let newOrder = 0;
      if (targetDate) {
        const targetDay = days.find(
          (d) => format(d.date, "yyyy-MM-dd") === targetDate
        );
        if (targetDay) {
          newOrder = targetDay.posts.length;
        }
      }

      await onPostMove(postId, targetDate, newOrder);
    },
    [findPost, days, onPostMove]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* ---- Calendar Grid ---- */}
        <div className="flex-1">
          {/* Day headers */}
          <div className="mb-2 grid grid-cols-7 gap-1.5 sm:gap-2">
            {DAYS_SHORT.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {days.map((day) => (
              <CalendarCell
                key={format(day.date, "yyyy-MM-dd")}
                day={day}
                onPostClick={onPostClick}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>
        </div>

        {/* ---- Unscheduled Sidebar ---- */}
        <UnscheduledSidebar
          posts={unscheduledPosts}
          onPostClick={onPostClick}
        />
      </div>

      {/* ---- Drag Overlay ---- */}
      <DragOverlay dropAnimation={null}>
        {activePost ? (
          <div className="w-48">
            <DraggablePost
              post={activePost}
              onClick={() => {}}
              isDraggingOverlay
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}