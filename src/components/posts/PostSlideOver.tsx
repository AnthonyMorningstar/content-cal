// ============================================
// Post Slide-Over Panel
// ============================================
// Side panel that slides in from the right
// to view/edit post details without leaving
// the calendar or board view

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Edit3,
  Trash2,
  Calendar,
  ExternalLink,
  Save,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import { StatusBadge, ContentTypeBadge } from "@/components/posts/StatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { cn, formatDate } from "@/lib/utils";
import { STATUS_CONFIG, CONTENT_TYPE_CONFIG } from "@/lib/constants";
import toast from "react-hot-toast";
import type { PostWithCategory } from "@/types";

const statusOptions = Object.entries(STATUS_CONFIG).map(([value, config]) => ({
  value,
  label: `${config.icon} ${config.label}`,
}));

const contentTypeOptions = Object.entries(CONTENT_TYPE_CONFIG).map(
  ([value, config]) => ({
    value,
    label: `${config.icon} ${config.label}`,
  })
);

interface PostSlideOverProps {
  post: PostWithCategory | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: Record<string, unknown>) => Promise<unknown>;
  onDelete: (id: string) => Promise<boolean>;
}

export default function PostSlideOver({
  post,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: PostSlideOverProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [contentType, setContentType] = useState("");
  const [notes, setNotes] = useState("");
  const [calendarDate, setCalendarDate] = useState("");

  // Populate form when post changes
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setDescription(post.description || "");
      setStatus(post.status);
      setContentType(post.contentType);
      setNotes(post.notes || "");
      setCalendarDate(
        post.calendarDate
          ? new Date(post.calendarDate).toISOString().split("T")[0]
          : ""
      );
    }
  }, [post]);

  // Reset editing state when panel closes
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
    }
  }, [isOpen]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle save
  const handleSave = async () => {
    if (!post || !title.trim()) return;

    setIsSaving(true);
    try {
      await onUpdate(post.id, {
        title: title.trim(),
        description: description.trim() || null,
        status,
        contentType,
        notes: notes.trim() || null,
        calendarDate: calendarDate || null,
      });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!post) return;
    setIsDeleting(true);
    const success = await onDelete(post.id);
    setIsDeleting(false);
    if (success) {
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  // Quick status change
  const handleStatusChange = async (newStatus: string) => {
    if (!post) return;
    await onUpdate(post.id, { status: newStatus });
  };

  if (!post) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-surface-800",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-surface-700">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: post.color || "#6366F1" }}
            />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Post Details
            </h2>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => router.push(`/posts/${post.id}`)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-surface-700 dark:hover:text-slate-300"
              title="Open full editor"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                isEditing
                  ? "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400"
                  : "text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-surface-700 dark:hover:text-slate-300"
              )}
              title={isEditing ? "Cancel editing" : "Edit post"}
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-surface-700 dark:hover:text-slate-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isEditing ? (
            /* ---- Edit Mode ---- */
            <div className="space-y-5">
              <Input
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
              />

              <Textarea
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description..."
                rows={3}
              />

              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  options={statusOptions}
                />
                <Select
                  label="Type"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  options={contentTypeOptions}
                />
              </div>

              <Input
                label="Scheduled Date"
                type="date"
                value={calendarDate}
                onChange={(e) => setCalendarDate(e.target.value)}
              />

              <Textarea
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Detailed notes..."
                rows={8}
              />
            </div>
          ) : (
            /* ---- View Mode ---- */
            <div className="space-y-6">
              {/* Title */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {post.title}
                </h3>
                {post.description && (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {post.description}
                  </p>
                )}
              </div>

              {/* Status & Type Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={post.status} size="md" />
                <ContentTypeBadge type={post.contentType} size="md" />
                {post.category && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-surface-700 dark:text-slate-300">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: post.category.color }}
                    />
                    {post.category.name}
                  </span>
                )}
              </div>

              {/* Quick Status Change */}
              <div>
                <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Quick Status Change
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => handleStatusChange(key)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                        post.status === key
                          ? "border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-500 dark:bg-brand-900/20 dark:text-brand-300"
                          : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-surface-600 dark:text-slate-400 dark:hover:bg-surface-700"
                      )}
                    >
                      <span>{config.icon}</span>
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-surface-700">
                <Calendar className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Scheduled Date
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {post.calendarDate
                      ? formatDate(post.calendarDate, {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Not scheduled"}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {post.notes && (
                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Notes
                  </p>
                  <div className="rounded-lg bg-slate-50 p-4 dark:bg-surface-700">
                    <p className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-400">
                      {post.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="space-y-1 text-xs text-slate-400 dark:text-slate-500">
                <p>Created: {formatDate(post.createdAt)}</p>
                <p>Updated: {formatDate(post.updatedAt)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 dark:border-surface-700">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              leftIcon={<Trash2 className="h-4 w-4" />}
              className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              Delete
            </Button>

            {isEditing ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  isLoading={isSaving}
                  loadingText="Saving..."
                  leftIcon={<Save className="h-4 w-4" />}
                >
                  Save Changes
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/posts/${post.id}`)}
                leftIcon={<ExternalLink className="h-4 w-4" />}
              >
                Full Editor
              </Button>
            )}
          </div>
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