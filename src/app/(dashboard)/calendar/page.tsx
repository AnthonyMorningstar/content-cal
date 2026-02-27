// ============================================
// Calendar Page
// ============================================
// Full calendar view with drag-and-drop,
// quick add, and post slide-over

"use client";

import { useState, useCallback } from "react";
import { Plus, Inbox } from "lucide-react";
import Link from "next/link";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import QuickAddModal from "@/components/calendar/QuickAddModal";
import PostSlideOver from "@/components/posts/PostSlideOver";
import Button from "@/components/ui/Button";
import { SkeletonCalendar } from "@/components/ui/Skeleton";
import { usePosts } from "@/hooks/usePosts";
import { useCalendar } from "@/hooks/useCalendar";
import toast from "react-hot-toast";
import type { PostWithCategory } from "@/types";

export default function CalendarPage() {
  // Fetch all posts
  const { posts, isLoading, createPost, updatePost, deletePost, fetchPosts } =
    usePosts();

  // Calendar logic
  const {
    monthLabel,
    calendarDays,
    unscheduledPosts,
    goToNextMonth,
    goToPrevMonth,
    goToToday,
  } = useCalendar(posts);

  // Quick add modal state
  const [quickAddDate, setQuickAddDate] = useState<Date | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Slide-over panel state
  const [selectedPost, setSelectedPost] = useState<PostWithCategory | null>(
    null
  );
  const [showSlideOver, setShowSlideOver] = useState(false);

  // ---- Handle Quick Add ----
  const handleQuickAdd = useCallback((date: Date) => {
    setQuickAddDate(date);
    setShowQuickAdd(true);
  }, []);

  const handleQuickAddSubmit = useCallback(
    async (data: {
      title: string;
      status: string;
      contentType: string;
      calendarDate: string;
      description?: string;
    }) => {
      await createPost({
        title: data.title,
        description: data.description,
        status: data.status as "IDEA" | "WRITING" | "EDITING" | "PUBLISHED",
        contentType: data.contentType as
          | "BLOG_POST"
          | "YOUTUBE_VIDEO"
          | "SOCIAL_MEDIA"
          | "PODCAST"
          | "OTHER",
        calendarDate: data.calendarDate,
      });
    },
    [createPost]
  );

  // ---- Handle Post Click (open slide-over) ----
  const handlePostClick = useCallback((post: PostWithCategory) => {
    setSelectedPost(post);
    setShowSlideOver(true);
  }, []);

  // ---- Handle Post Move (drag-and-drop) ----
  const handlePostMove = useCallback(
    async (postId: string, newDate: string | null, newOrder: number) => {
      try {
        const response = await fetch("/api/posts/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            updates: [
              {
                postId,
                calendarDate: newDate,
                calendarOrder: newOrder,
              },
            ],
          }),
        });

        if (!response.ok) {
          toast.error("Failed to move post");
          return;
        }

        // Refresh posts to get updated data
        await fetchPosts();

        toast.success(
          newDate ? "Post scheduled!" : "Post unscheduled",
          { duration: 2000 }
        );
      } catch {
        toast.error("Failed to move post");
      }
    },
    [fetchPosts]
  );

  // ---- Handle Post Update (from slide-over) ----
  const handlePostUpdate = useCallback(
    async (id: string, data: Record<string, unknown>) => {
      const result = await updatePost(id, data);

      // Update selected post if it's the one being edited
      if (result && selectedPost?.id === id) {
        setSelectedPost(result);
      }

      return result;
    },
    [updatePost, selectedPost]
  );

  // ---- Handle Post Delete ----
  const handlePostDelete = useCallback(
    async (id: string) => {
      const success = await deletePost(id);
      return success;
    },
    [deletePost]
  );

  return (
    <div className="space-y-6">
      {/* ---- Page Header ---- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CalendarHeader
          monthLabel={monthLabel}
          onPrevMonth={goToPrevMonth}
          onNextMonth={goToNextMonth}
          onToday={goToToday}
        />

        <div className="flex items-center gap-2">
          {/* Unscheduled count badge */}
          {unscheduledPosts.length > 0 && (
            <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
              <Inbox className="h-3.5 w-3.5" />
              {unscheduledPosts.length} unscheduled
            </div>
          )}

          <Link href="/posts/new">
            <Button
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              New Post
            </Button>
          </Link>
        </div>
      </div>

      {/* ---- Calendar Grid ---- */}
      {isLoading ? (
        <SkeletonCalendar />
      ) : (
        <CalendarGrid
          days={calendarDays}
          unscheduledPosts={unscheduledPosts}
          onPostClick={handlePostClick}
          onQuickAdd={handleQuickAdd}
          onPostMove={handlePostMove}
        />
      )}

      {/* ---- Quick Add Modal ---- */}
      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        date={quickAddDate}
        onSubmit={handleQuickAddSubmit}
      />

      {/* ---- Post Slide-Over Panel ---- */}
      <PostSlideOver
        post={selectedPost}
        isOpen={showSlideOver}
        onClose={() => {
          setShowSlideOver(false);
          setSelectedPost(null);
        }}
        onUpdate={handlePostUpdate}
        onDelete={handlePostDelete}
      />
    </div>
  );
}