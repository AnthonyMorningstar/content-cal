// ============================================
// Kanban Card Component
// ============================================
// A single post card inside a Kanban column
// Draggable between columns to change status

"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Calendar, MessageSquare } from "lucide-react";
import { ContentTypeBadge } from "@/components/posts/StatusBadge";
import { cn, formatDate, truncate } from "@/lib/utils";
import type { PostWithCategory } from "@/types";

interface KanbanCardProps {
  post: PostWithCategory;
  onClick: (post: PostWithCategory) => void;
  isDraggingOverlay?: boolean;
}

export default function KanbanCard({
  post,
  onClick,
  isDraggingOverlay = false,
}: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: post.id,
    data: {
      type: "kanban-card",
      post,
      status: post.status,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-xl border bg-white p-4 transition-all",
        "border-slate-200 hover:border-slate-300 hover:shadow-md",
        "dark:border-surface-600 dark:bg-surface-800 dark:hover:border-surface-500",
        isDragging && "opacity-30 shadow-none",
        isDraggingOverlay &&
          "shadow-2xl ring-2 ring-brand-500 rotate-1 scale-105 cursor-grabbing"
      )}
    >
      {/* ---- Color Bar ---- */}
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-xl"
        style={{ backgroundColor: post.color || "#6366F1" }}
      />

      {/* ---- Header Row ---- */}
      <div className="flex items-start justify-between gap-2">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 shrink-0 cursor-grab touch-none rounded p-0.5 text-slate-300 opacity-0 transition-opacity hover:text-slate-500 group-hover:opacity-100 active:cursor-grabbing dark:text-slate-600 dark:hover:text-slate-400"
          aria-label="Drag to move"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Content type badge */}
        <div className="flex-1 min-w-0">
          <ContentTypeBadge type={post.contentType} size="xs" />
        </div>
      </div>

      {/* ---- Title (clickable) ---- */}
      <button
        onClick={() => onClick(post)}
        className="mt-2 block w-full text-left"
      >
        <h4 className="text-sm font-semibold text-slate-900 line-clamp-2 hover:text-brand-600 dark:text-white dark:hover:text-brand-400">
          {post.title}
        </h4>
      </button>

      {/* ---- Description ---- */}
      {post.description && (
        <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 dark:text-slate-400">
          {truncate(post.description, 80)}
        </p>
      )}

      {/* ---- Footer ---- */}
      <div className="mt-3 flex items-center justify-between">
        {/* Category */}
        {post.category ? (
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: post.category.color }}
            />
            <span className="truncate max-w-[80px]">
              {post.category.name}
            </span>
          </span>
        ) : (
          <span />
        )}

        {/* Date & notes indicator */}
        <div className="flex items-center gap-2">
          {post.notes && (
            <MessageSquare className="h-3 w-3 text-slate-400 dark:text-slate-500" />
          )}
          {post.calendarDate && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
              <Calendar className="h-3 w-3" />
              {formatDate(post.calendarDate, {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}