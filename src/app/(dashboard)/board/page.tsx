// ============================================
// Board Page
// ============================================
// Full Kanban board with drag-and-drop status
// changes, filters, stats, and quick add

"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { Plus, Columns3 } from "lucide-react";
import KanbanBoard from "@/components/board/KanbanBoard";
import BoardStats from "@/components/board/BoardStats";
import BoardFilters from "@/components/board/BoardFilters";
import BoardQuickAdd from "@/components/board/BoardQuickAdd";
import PostSlideOver from "@/components/posts/PostSlideOver";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonStats } from "@/components/ui/Skeleton";
import { usePosts } from "@/hooks/usePosts";
import toast from "react-hot-toast";
import type { PostWithCategory } from "@/types";

export default function BoardPage() {
  // Fetch all posts
  const { posts, isLoading, createPost, updatePost, deletePost, fetchPosts } =
    usePosts();

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Quick add modal state
  const [quickAddStatus, setQuickAddStatus] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Slide-over panel state
  const [selectedPost, setSelectedPost] = useState<PostWithCategory | null>(
    null
  );
  const [showSlideOver, setShowSlideOver] = useState(false);

  // ---- Filter posts ----
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description?.toLowerCase().includes(query)
      );
    }

    if (typeFilter) {
      result = result.filter((post) => post.contentType === typeFilter);
    }

    return result;
  }, [posts, searchQuery, typeFilter]);

  // ---- Handle Add Post from column ----
  const handleAddPost = useCallback((status: string) => {
    setQuickAddStatus(status);
    setShowQuickAdd(true);
  }, []);

  const handleQuickAddSubmit = useCallback(
    async (data: {
      title: string;
      status: string;
      contentType: string;
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
      });
    },
    [createPost]
  );

  // ---- Handle Post Click ----
  const handlePostClick = useCallback((post: PostWithCategory) => {
    setSelectedPost(post);
    setShowSlideOver(true);
  }, []);

  // ---- Handle Status Change (drag-and-drop) ----
  const handleStatusChange = useCallback(
    async (postId: string, newStatus: string) => {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
          toast.error("Failed to update status");
          return;
        }

        await fetchPosts();

        // Find status label for toast
        const statusLabels: Record<string, string> = {
          IDEA: "💡 Idea",
          WRITING: "✍️ Writing",
          EDITING: "🔍 Editing",
          PUBLISHED: "🚀 Published",
        };

        toast.success(`Moved to ${statusLabels[newStatus] || newStatus}`, {
          duration: 2000,
        });
      } catch {
        toast.error("Failed to update status");
      }
    },
    [fetchPosts]
  );

  // ---- Handle Post Update (from slide-over) ----
  const handlePostUpdate = useCallback(
    async (id: string, data: Record<string, unknown>) => {
      const result = await updatePost(id, data);
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
        <div>
          <h1 className="page-title">Board</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Drag posts between columns to update their status
          </p>
        </div>

        <Link href="/posts/new">
          <Button leftIcon={<Plus className="h-4 w-4" />}>New Post</Button>
        </Link>
      </div>

      {/* ---- Loading ---- */}
      {isLoading ? (
        <div className="space-y-6">
          <SkeletonStats />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-96 animate-pulse rounded-xl border border-slate-200 bg-slate-50 dark:border-surface-700 dark:bg-surface-900/50"
              />
            ))}
          </div>
        </div>
      ) : posts.length === 0 ? (
        /* ---- Empty State ---- */
        <EmptyState
          icon={<Columns3 className="h-8 w-8" />}
          title="Your board is empty"
          description="Create your first post to see it on the Kanban board. Posts move through Idea → Writing → Editing → Published."
          action={
            <Link href="/posts/new">
              <Button leftIcon={<Plus className="h-4 w-4" />}>
                Create First Post
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          {/* ---- Stats Bar ---- */}
          <BoardStats posts={posts} />

          {/* ---- Filters ---- */}
          <BoardFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            totalCount={posts.length}
            filteredCount={filteredPosts.length}
          />

          {/* ---- Kanban Board ---- */}
          <KanbanBoard
            posts={filteredPosts}
            onPostClick={handlePostClick}
            onAddPost={handleAddPost}
            onStatusChange={handleStatusChange}
          />
        </>
      )}

      {/* ---- Quick Add Modal ---- */}
      <BoardQuickAdd
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        status={quickAddStatus}
        onSubmit={handleQuickAddSubmit}
      />

      {/* ---- Post Slide-Over ---- */}
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