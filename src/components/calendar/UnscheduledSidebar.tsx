// ============================================
// Unscheduled Posts Sidebar
// ============================================
// Shows posts without a date — users can drag
// them onto the calendar

"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Inbox, Calendar } from "lucide-react";
import DraggablePost from "./DraggablePost";
import { cn } from "@/lib/utils";
import type { PostWithCategory } from "@/types";

interface UnscheduledSidebarProps {
  posts: PostWithCategory[];
  onPostClick: (post: PostWithCategory) => void;
  isCollapsed?: boolean;
}

export default function UnscheduledSidebar({
  posts,
  onPostClick,
  isCollapsed = false,
}: UnscheduledSidebarProps) {
  // Make the sidebar a droppable zone (to unschedule posts)
  const { isOver, setNodeRef } = useDroppable({
    id: "unscheduled",
    data: {
      type: "unscheduled",
    },
  });

  const postIds = posts.map((p) => p.id);

  if (isCollapsed) return null;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-full flex-col rounded-xl border border-slate-200 bg-white transition-all dark:border-surface-700 dark:bg-surface-800 lg:w-72",
        isOver &&
          "border-brand-500 bg-brand-50 ring-2 ring-brand-500/30 dark:bg-brand-900/20"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-surface-700">
        <Inbox className="h-4 w-4 text-slate-400" />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Unscheduled
        </h3>
        <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-slate-100 px-1.5 text-xs font-medium text-slate-600 dark:bg-surface-600 dark:text-slate-400">
          {posts.length}
        </span>
      </div>

      {/* Posts list */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-hide" style={{ maxHeight: "calc(100vh - 300px)" }}>
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
            <p className="text-xs text-slate-400 dark:text-slate-500">
              All posts are scheduled!
            </p>
            <p className="mt-1 text-[10px] text-slate-300 dark:text-slate-600">
              Drag posts here to unschedule
            </p>
          </div>
        ) : (
          <SortableContext
            items={postIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1.5">
              {posts.map((post) => (
                <DraggablePost
                  key={post.id}
                  post={post}
                  onClick={onPostClick}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>

      {/* Helper text */}
      <div className="border-t border-slate-100 px-4 py-2 dark:border-surface-700">
        <p className="text-[10px] text-slate-400 dark:text-slate-500">
          💡 Drag posts onto calendar dates to schedule them
        </p>
      </div>
    </div>
  );
}