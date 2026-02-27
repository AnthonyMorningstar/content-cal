// ============================================
// Kanban Column Component
// ============================================
// A single status column (Idea, Writing, etc.)
// Acts as a droppable zone for cards

"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import KanbanCard from "./KanbanCard";
import { cn } from "@/lib/utils";
import type { PostWithCategory } from "@/types";

interface KanbanColumnProps {
  id: string;
  title: string;
  icon: string;
  color: string;
  posts: PostWithCategory[];
  onPostClick: (post: PostWithCategory) => void;
  onAddPost: (status: string) => void;
}

export default function KanbanColumn({
  id,
  title,
  icon,
  color,
  posts,
  onPostClick,
  onAddPost,
}: KanbanColumnProps) {
  // Make column a droppable zone
  const { isOver, setNodeRef } = useDroppable({
    id: `column-${id}`,
    data: {
      type: "column",
      status: id,
    },
  });

  const postIds = posts.map((p) => p.id);

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border bg-slate-50/80 transition-all dark:bg-surface-900/50",
        isOver
          ? "border-brand-400 bg-brand-50/50 ring-2 ring-brand-400/20 dark:border-brand-500 dark:bg-brand-900/10 dark:ring-brand-500/20"
          : "border-slate-200 dark:border-surface-700"
      )}
    >
      {/* ---- Column Header ---- */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Status dot */}
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: color }}
          />

          {/* Icon + Title */}
          <span className="text-base">{icon}</span>
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {title}
          </h3>

          {/* Count */}
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-slate-200 px-1.5 text-[11px] font-semibold text-slate-600 dark:bg-surface-600 dark:text-slate-400">
            {posts.length}
          </span>
        </div>

        {/* Add button */}
        <button
          onClick={() => onAddPost(id)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white hover:text-slate-600 hover:shadow-sm dark:hover:bg-surface-700 dark:hover:text-slate-300"
          title={`Add post to ${title}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* ---- Cards Container ---- */}
      <div
        ref={setNodeRef}
        className="flex-1 space-y-2.5 overflow-y-auto px-3 pb-3 scrollbar-hide"
        style={{ maxHeight: "calc(100vh - 260px)", minHeight: "120px" }}
      >
        <SortableContext
          items={postIds}
          strategy={verticalListSortingStrategy}
        >
          {posts.length === 0 ? (
            /* Empty state */
            <div
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-10 text-center transition-colors",
                isOver
                  ? "border-brand-400 bg-brand-50/50 dark:border-brand-500 dark:bg-brand-900/20"
                  : "border-slate-200 dark:border-surface-600"
              )}
            >
              <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
                {isOver ? "Drop here!" : "No posts"}
              </p>
              <p className="mt-1 text-xs text-slate-300 dark:text-slate-600">
                {isOver
                  ? `Move to ${title}`
                  : "Drag posts here or click +"}
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <KanbanCard
                key={post.id}
                post={post}
                onClick={onPostClick}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}