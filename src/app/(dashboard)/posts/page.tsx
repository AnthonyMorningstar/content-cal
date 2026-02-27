// ============================================
// All Posts Page
// ============================================
// Lists all user's posts with filters, search,
// and list/grid view toggle

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  FileText,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import PostCard from "@/components/posts/PostCard";
import { usePosts } from "@/hooks/usePosts";
import { STATUS_CONFIG, CONTENT_TYPE_CONFIG } from "@/lib/constants";

// Filter options
const statusFilterOptions = [
  { value: "", label: "All Statuses" },
  ...Object.entries(STATUS_CONFIG).map(([value, config]) => ({
    value,
    label: `${config.icon} ${config.label}`,
  })),
];

const typeFilterOptions = [
  { value: "", label: "All Types" },
  ...Object.entries(CONTENT_TYPE_CONFIG).map(([value, config]) => ({
    value,
    label: `${config.icon} ${config.label}`,
  })),
];

export default function PostsPage() {
  // View state
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Fetch posts
  const { posts, isLoading, deletePost } = usePosts();

  // Apply client-side filtering
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter) {
      result = result.filter((post) => post.status === statusFilter);
    }

    // Type filter
    if (typeFilter) {
      result = result.filter((post) => post.contentType === typeFilter);
    }

    return result;
  }, [posts, searchQuery, statusFilter, typeFilter]);

  // Active filter count
  const activeFilters = [statusFilter, typeFilter].filter(Boolean).length;

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setTypeFilter("");
  };

  return (
    <div className="space-y-6">
      {/* ---- Header ---- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">All Posts</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {posts.length} total post{posts.length !== 1 ? "s" : ""}
            {filteredPosts.length !== posts.length &&
              ` · ${filteredPosts.length} shown`}
          </p>
        </div>

        <Link href="/posts/new">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            New Post
          </Button>
        </Link>
      </div>

      {/* ---- Search & Filter Bar ---- */}
      <div className="card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="input-field pl-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={showFilters ? "secondary" : "outline"}
              size="md"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<Filter className="h-4 w-4" />}
            >
              Filters
              {activeFilters > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-xs text-white">
                  {activeFilters}
                </span>
              )}
            </Button>

            {/* View toggle */}
            <div className="flex rounded-lg border border-slate-200 dark:border-surface-600">
              <button
                onClick={() => setViewMode("list")}
                className={`flex h-10 w-10 items-center justify-center rounded-l-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex h-10 w-10 items-center justify-center rounded-r-lg border-l border-slate-200 transition-colors dark:border-surface-600 ${
                  viewMode === "grid"
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
                title="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter dropdowns */}
        {showFilters && (
          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 dark:border-surface-700 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statusFilterOptions}
              />
            </div>
            <div className="flex-1">
              <Select
                label="Content Type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={typeFilterOptions}
              />
            </div>
            {activeFilters > 0 && (
              <Button
                variant="ghost"
                size="md"
                onClick={clearFilters}
                leftIcon={<X className="h-4 w-4" />}
              >
                Clear
              </Button>
            )}
          </div>
        )}
      </div>

      {/* ---- Posts List/Grid ---- */}
      {isLoading ? (
        <SkeletonTable rows={6} />
      ) : filteredPosts.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-8 w-8" />}
          title={
            posts.length === 0
              ? "No posts yet"
              : "No posts match your filters"
          }
          description={
            posts.length === 0
              ? "Create your first content piece to get started."
              : "Try adjusting your search or filters."
          }
          action={
            posts.length === 0 ? (
              <Link href="/posts/new">
                <Button leftIcon={<Plus className="h-4 w-4" />}>
                  Create First Post
                </Button>
              </Link>
            ) : (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )
          }
        />
      ) : viewMode === "list" ? (
        <div className="space-y-2">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={deletePost}
              view="list"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={deletePost}
              view="grid"
            />
          ))}
        </div>
      )}
    </div>
  );
}