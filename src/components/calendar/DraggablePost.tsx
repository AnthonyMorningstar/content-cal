// ============================================
// Draggable Post Card (Calendar)
// ============================================
// Small post card that can be dragged between
// calendar cells. Uses @dnd-kit

"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_CONFIG, CONTENT_TYPE_CONFIG } from "@/lib/constants";
import type { PostWithCategory } from "@/types";

interface DraggablePostProps {
  post: PostWithCategory;
  onClick: (post: PostWithCategory) => void;
  isDraggingOverlay?: boolean;
}

export default function DraggablePost({
  post,
  onClick,
  isDraggingOverlay = false,
}: DraggablePostProps) {
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
      type: "post",
      post,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const statusConfig = STATUS_CONFIG[post.status];
  const typeConfig = CONTENT_TYPE_CONFIG[post.contentType];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex items-start gap-1.5 rounded-lg border p-2 text-left transition-all",
        "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm",
        "dark:border-surface-600 dark:bg-surface-800 dark:hover:border-surface-500",
        isDragging && "opacity-30 shadow-none",
        isDraggingOverlay &&
          "shadow-xl ring-2 ring-brand-500 rotate-2 scale-105 opacity-90 cursor-grabbing"
      )}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="mt-0.5 shrink-0 cursor-grab touch-none rounded p-0.5 text-slate-300 opacity-0 transition-opacity hover:text-slate-500 group-hover:opacity-100 active:cursor-grabbing dark:text-slate-600 dark:hover:text-slate-400"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>

      {/* Content (clickable) */}
      <button
        onClick={() => onClick(post)}
        className="min-w-0 flex-1 text-left"
      >
        {/* Color bar + title */}
        <div className="flex items-center gap-1.5">
          <div
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: post.color || "#6366F1" }}
          />
          <span className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">
            {post.title}
          </span>
        </div>

        {/* Meta row */}
        <div className="mt-1 flex items-center gap-1.5">
          <span className="text-[10px]">{typeConfig.icon}</span>
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
              post.status === "IDEA" &&
                "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
              post.status === "WRITING" &&
                "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
              post.status === "EDITING" &&
                "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
              post.status === "PUBLISHED" &&
                "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
            )}
          >
            {statusConfig.icon} {statusConfig.label}
          </span>
        </div>
      </button>
    </div>
  );
}