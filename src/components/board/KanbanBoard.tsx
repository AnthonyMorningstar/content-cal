// ============================================
// Kanban Board Component
// ============================================
// 4-column board: Idea → Writing → Editing → Published
// Full drag-and-drop between columns

"use client";

import { useState, useCallback, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";
import { STATUS_CONFIG } from "@/lib/constants";
import type { PostWithCategory } from "@/types";

interface KanbanBoardProps {
  posts: PostWithCategory[];
  onPostClick: (post: PostWithCategory) => void;
  onAddPost: (status: string) => void;
  onStatusChange: (postId: string, newStatus: string) => Promise<void>;
}

// Column definitions
const COLUMNS = [
  {
    id: "IDEA",
    title: STATUS_CONFIG.IDEA.label,
    icon: STATUS_CONFIG.IDEA.icon,
    color: STATUS_CONFIG.IDEA.color,
  },
  {
    id: "WRITING",
    title: STATUS_CONFIG.WRITING.label,
    icon: STATUS_CONFIG.WRITING.icon,
    color: STATUS_CONFIG.WRITING.color,
  },
  {
    id: "EDITING",
    title: STATUS_CONFIG.EDITING.label,
    icon: STATUS_CONFIG.EDITING.icon,
    color: STATUS_CONFIG.EDITING.color,
  },
  {
    id: "PUBLISHED",
    title: STATUS_CONFIG.PUBLISHED.label,
    icon: STATUS_CONFIG.PUBLISHED.icon,
    color: STATUS_CONFIG.PUBLISHED.color,
  },
];

export default function KanbanBoard({
  posts,
  onPostClick,
  onAddPost,
  onStatusChange,
}: KanbanBoardProps) {
  const [activePost, setActivePost] = useState<PostWithCategory | null>(null);

  // Configure sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  // Group posts by status
  const postsByStatus = useMemo(() => {
    const grouped: Record<string, PostWithCategory[]> = {
      IDEA: [],
      WRITING: [],
      EDITING: [],
      PUBLISHED: [],
    };

    posts.forEach((post) => {
      if (grouped[post.status]) {
        grouped[post.status].push(post);
      }
    });

    // Sort each column by updatedAt (most recent first)
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    });

    return grouped;
  }, [posts]);

  // Find post by ID
  const findPost = useCallback(
    (id: string): PostWithCategory | undefined => {
      return posts.find((p) => p.id === id);
    },
    [posts]
  );

  // ---- Drag Start ----
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const post = findPost(event.active.id as string);
      if (post) setActivePost(post);
    },
    [findPost]
  );

  // ---- Drag End ----
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActivePost(null);

      const { active, over } = event;
      if (!over) return;

      const postId = active.id as string;
      const overId = over.id as string;

      // Determine target status
      let targetStatus: string | null = null;

      if (overId.startsWith("column-")) {
        // Dropped directly on a column
        targetStatus = overId.replace("column-", "");
      } else {
        // Dropped on another card — find that card's status
        const overPost = findPost(overId);
        if (overPost) {
          targetStatus = overPost.status;
        }
      }

      if (!targetStatus) return;

      // Get current post
      const currentPost = findPost(postId);
      if (!currentPost) return;

      // Only update if status actually changed
      if (currentPost.status === targetStatus) return;

      await onStatusChange(postId, targetStatus);
    },
    [findPost, onStatusChange]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* ---- Columns Grid ---- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            icon={column.icon}
            color={column.color}
            posts={postsByStatus[column.id] || []}
            onPostClick={onPostClick}
            onAddPost={onAddPost}
          />
        ))}
      </div>

      {/* ---- Drag Overlay ---- */}
      <DragOverlay dropAnimation={null}>
        {activePost ? (
          <div className="w-72">
            <KanbanCard
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