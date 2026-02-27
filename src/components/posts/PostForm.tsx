// ============================================
// Post Form Component
// ============================================
// Used for both creating and editing posts
// Full form with all post fields

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Calendar as CalendarIcon,
  Tag,
  Palette,
  Save,
  ArrowLeft,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import ColorPicker from "@/components/ui/ColorPicker";
import { StatusBadge, ContentTypeBadge } from "@/components/posts/StatusBadge";
import { useCategories } from "@/hooks/usePosts";
import { STATUS_CONFIG, CONTENT_TYPE_CONFIG } from "@/lib/constants";
import toast from "react-hot-toast";
import type { PostWithCategory, CreatePostInput } from "@/types";

// Status options
const statusOptions = Object.entries(STATUS_CONFIG).map(([value, config]) => ({
  value,
  label: `${config.icon} ${config.label}`,
}));

// Content type options
const contentTypeOptions = Object.entries(CONTENT_TYPE_CONFIG).map(
  ([value, config]) => ({
    value,
    label: `${config.icon} ${config.label}`,
  })
);

interface PostFormProps {
  /** Existing post data (for edit mode) */
  post?: PostWithCategory | null;
  /** Mode: create or edit */
  mode?: "create" | "edit";
}

export default function PostForm({ post, mode = "create" }: PostFormProps) {
  const router = useRouter();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ---- Form State ----
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("IDEA");
  const [contentType, setContentType] = useState("BLOG_POST");
  const [calendarDate, setCalendarDate] = useState("");
  const [notes, setNotes] = useState("");
  const [color, setColor] = useState("#6366F1");
  const [categoryId, setCategoryId] = useState("");

  // ---- Populate form for edit mode ----
  useEffect(() => {
    if (post && mode === "edit") {
      setTitle(post.title);
      setDescription(post.description || "");
      setStatus(post.status);
      setContentType(post.contentType);
      setCalendarDate(
        post.calendarDate
          ? new Date(post.calendarDate).toISOString().split("T")[0]
          : ""
      );
      setNotes(post.notes || "");
      setColor(post.color || "#6366F1");
      setCategoryId(post.categoryId || "");
    }
  }, [post, mode]);

  // ---- Category options ----
  const categoryOptions = [
    { value: "", label: "No category" },
    ...categories.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })),
  ];

  // ---- Handle Submit ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsSubmitting(true);

    const postData: CreatePostInput = {
      title: title.trim(),
      description: description.trim() || undefined,
      status: status as CreatePostInput["status"],
      contentType: contentType as CreatePostInput["contentType"],
      calendarDate: calendarDate || null,
      notes: notes.trim() || undefined,
      color,
      categoryId: categoryId || null,
    };

    try {
      const url =
        mode === "edit" ? `/api/posts/${post?.id}` : "/api/posts";
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || `Failed to ${mode} post`);
        return;
      }

      toast.success(
        mode === "edit"
          ? "Post updated successfully!"
          : "Post created successfully!"
      );

      router.push("/posts");
      router.refresh();
    } catch {
      toast.error(`Failed to ${mode} post`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ---- Header ---- */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/posts")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingText="Saving..."
            leftIcon={<Save className="h-4 w-4" />}
          >
            {mode === "edit" ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </div>

      {/* ---- Main Content ---- */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Primary Fields */}
        <div className="space-y-6 lg:col-span-2">
          {/* Title */}
          <div className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
              <FileText className="h-5 w-5 text-brand-500" />
              Content Details
            </h2>

            <div className="space-y-5">
              <Input
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title..."
                required
                maxLength={200}
              />

              <Textarea
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of this content piece..."
                rows={3}
                helperText={`${description.length}/1000 characters`}
              />

              <Textarea
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Detailed notes, outlines, key points, research links..."
                rows={8}
                helperText="Use this space for outlines, research, links, etc."
              />
            </div>
          </div>
        </div>

        {/* Right Column: Meta Fields */}
        <div className="space-y-6">
          {/* Status & Type */}
          <div className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
              <Tag className="h-5 w-5 text-brand-500" />
              Properties
            </h2>

            <div className="space-y-5">
              <Select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={statusOptions}
              />

              {/* Status Preview */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Preview:
                </span>
                <StatusBadge
                  status={status as "IDEA" | "WRITING" | "EDITING" | "PUBLISHED"}
                />
              </div>

              <Select
                label="Content Type"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                options={contentTypeOptions}
              />

              {/* Type Preview */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Preview:
                </span>
                <ContentTypeBadge
                  type={
                    contentType as
                    | "BLOG_POST"
                    | "YOUTUBE_VIDEO"
                    | "SOCIAL_MEDIA"
                    | "PODCAST"
                    | "OTHER"
                  }
                />
              </div>

              <Select
                label="Category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                options={categoryOptions}
                disabled={categoriesLoading}
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
              <CalendarIcon className="h-5 w-5 text-brand-500" />
              Schedule
            </h2>

            <Input
              label="Calendar Date"
              type="date"
              value={calendarDate}
              onChange={(e) => setCalendarDate(e.target.value)}
              helperText="When this content is planned for"
            />
          </div>

          {/* Color */}
          <div className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
              <Palette className="h-5 w-5 text-brand-500" />
              Appearance
            </h2>

            <ColorPicker
              label="Post Color"
              value={color}
              onChange={setColor}
            />

            {/* Color preview */}
            <div className="mt-4 flex items-center gap-3">
              <div
                className="h-8 w-8 rounded-lg shadow-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {color}
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}