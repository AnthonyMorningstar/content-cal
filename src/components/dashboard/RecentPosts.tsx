// ============================================
// Recent Posts Component
// ============================================
// Shows the 5 most recently updated posts
// with quick status indicator and actions

"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clock,
  FileText,
} from "lucide-react";
import { StatusBadge, ContentTypeBadge } from "@/components/posts/StatusBadge";
import Button from "@/components/ui/Button";
import { formatDate, truncate } from "@/lib/utils";
import type { PostWithCategory } from "@/types";

interface RecentPostsProps {
  posts: PostWithCategory[];
}

export default function RecentPosts({ posts }: RecentPostsProps) {
  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-surface-700">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-400" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Recent Activity
          </h3>
        </div>
        <Link href="/posts">
          <Button variant="ghost" size="xs" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
            View All
          </Button>
        </Link>
      </div>

      {/* Posts list */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <FileText className="mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            No posts yet
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Create your first post to see it here
          </p>
          <Link href="/posts/new" className="mt-4">
            <Button size="sm">Create Post</Button>
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-surface-700">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="group flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-surface-800/50"
            >
              {/* Color dot */}
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: post.color || "#6366F1" }}
              />

              {/* Title + description */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800 group-hover:text-brand-600 dark:text-slate-200 dark:group-hover:text-brand-400">
                  {post.title}
                </p>
                {post.description && (
                  <p className="mt-0.5 truncate text-xs text-slate-400 dark:text-slate-500">
                    {truncate(post.description, 60)}
                  </p>
                )}
              </div>

              {/* Badges */}
              <div className="hidden items-center gap-1.5 sm:flex">
                <StatusBadge status={post.status} size="xs" showIcon={false} />
                <ContentTypeBadge
                  type={post.contentType}
                  size="xs"
                  showIcon={false}
                />
              </div>

              {/* Date */}
              <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                {formatDate(post.updatedAt, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}