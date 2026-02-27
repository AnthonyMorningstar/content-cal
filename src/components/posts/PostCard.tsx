// ============================================
// Post Card Component
// ============================================
// Displays a single post in list/grid views
// Shows title, status, type, date, and actions

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Edit3,
  Trash2,
  Calendar,
  ExternalLink,
  Copy,
} from "lucide-react";
import { StatusBadge, ContentTypeBadge } from "@/components/posts/StatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { cn, formatDate, truncate } from "@/lib/utils";
import type { PostWithCategory } from "@/types";

interface PostCardProps {
  post: PostWithCategory;
  onDelete: (id: string) => Promise<boolean>;
  view?: "list" | "grid";
}

export default function PostCard({
  post,
  onDelete,
  view = "list",
}: PostCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await onDelete(post.id);
    setIsDeleting(false);
    if (success) setShowDeleteConfirm(false);
  };

  // ---- List View ----
  if (view === "list") {
    return (
      <>
        <div className="card-hover group flex items-center gap-4 p-4">
          {/* Color indicator */}
          <div
            className="h-10 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: post.color || "#6366F1" }}
          />

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Link
                href={`/posts/${post.id}`}
                className="truncate text-sm font-semibold text-slate-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-400"
              >
                {post.title}
              </Link>
            </div>

            {post.description && (
              <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                {truncate(post.description, 100)}
              </p>
            )}
          </div>

          {/* Badges */}
          <div className="hidden items-center gap-2 sm:flex">
            <StatusBadge status={post.status} size="xs" />
            <ContentTypeBadge type={post.contentType} size="xs" />
          </div>

          {/* Category */}
          {post.category && (
            <span className="hidden items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-surface-700 dark:text-slate-300 md:inline-flex">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: post.category.color }}
              />
              {post.category.name}
            </span>
          )}

          {/* Date */}
          <div className="hidden text-xs text-slate-500 dark:text-slate-400 lg:block">
            {post.calendarDate ? (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(post.calendarDate)}
              </span>
            ) : (
              <span className="text-slate-400 dark:text-slate-500">
                No date
              </span>
            )}
          </div>

          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 opacity-0 transition-all hover:bg-slate-100 hover:text-slate-600 group-hover:opacity-100 dark:hover:bg-surface-700 dark:hover:text-slate-300"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-surface-600 dark:bg-surface-800">
                  <Link
                    href={`/posts/${post.id}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-surface-700"
                    onClick={() => setShowMenu(false)}
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </Link>
                  <Link
                    href={`/posts/${post.id}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-surface-700"
                    onClick={() => setShowMenu(false)}
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Details
                  </Link>
                  <button
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-surface-700"
                    onClick={() => {
                      navigator.clipboard.writeText(post.title);
                      setShowMenu(false);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                    Copy Title
                  </button>
                  <hr className="my-1 border-slate-100 dark:border-surface-700" />
                  <button
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    onClick={() => {
                      setShowMenu(false);
                      setShowDeleteConfirm(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Delete confirmation */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          title="Delete this post?"
          description={`"${post.title}" will be permanently deleted. This action cannot be undone.`}
          confirmText="Delete Post"
          isLoading={isDeleting}
          variant="danger"
        />
      </>
    );
  }

  // ---- Grid View ----
  return (
    <>
      <div className="card-hover group relative p-5">
        {/* Color bar */}
        <div
          className="absolute left-0 top-0 h-1 w-full rounded-t-xl"
          style={{ backgroundColor: post.color || "#6366F1" }}
        />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <ContentTypeBadge type={post.contentType} size="xs" />
            <StatusBadge status={post.status} size="xs" />
          </div>

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 opacity-0 transition-all hover:bg-slate-100 hover:text-slate-600 group-hover:opacity-100 dark:hover:bg-surface-700 dark:hover:text-slate-300"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {/* Dropdown menu (same as list view) */}
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-4 top-12 z-20 w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-surface-600 dark:bg-surface-800">
                <Link
                  href={`/posts/${post.id}`}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-surface-700"
                  onClick={() => setShowMenu(false)}
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
                </Link>
                <hr className="my-1 border-slate-100 dark:border-surface-700" />
                <button
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  onClick={() => {
                    setShowMenu(false);
                    setShowDeleteConfirm(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>

        {/* Title */}
        <Link href={`/posts/${post.id}`} className="mt-3 block">
          <h3 className="font-semibold text-slate-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-400">
            {post.title}
          </h3>
        </Link>

        {/* Description */}
        {post.description && (
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
            {post.description}
          </p>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-surface-700">
          {/* Category */}
          {post.category ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: post.category.color }}
              />
              {post.category.name}
            </span>
          ) : (
            <span />
          )}

          {/* Date */}
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {post.calendarDate
              ? formatDate(post.calendarDate)
              : formatDate(post.createdAt)}
          </span>
        </div>
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete this post?"
        description={`"${post.title}" will be permanently deleted.`}
        confirmText="Delete Post"
        isLoading={isDeleting}
        variant="danger"
      />
    </>
  );
}