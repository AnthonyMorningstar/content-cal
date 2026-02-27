// ============================================
// Board Quick Add Modal
// ============================================
// Creates a new post with a pre-set status
// from clicking the + button on a Kanban column

"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { StatusBadge } from "@/components/posts/StatusBadge";
import { CONTENT_TYPE_CONFIG, STATUS_CONFIG } from "@/lib/constants";
import type { PostStatus } from "@prisma/client";

const contentTypeOptions = Object.entries(CONTENT_TYPE_CONFIG).map(
  ([value, config]) => ({
    value,
    label: `${config.icon} ${config.label}`,
  })
);

interface BoardQuickAddProps {
  isOpen: boolean;
  onClose: () => void;
  status: string;
  onSubmit: (data: {
    title: string;
    status: string;
    contentType: string;
    description?: string;
  }) => Promise<void>;
}

export default function BoardQuickAdd({
  isOpen,
  onClose,
  status,
  onSubmit,
}: BoardQuickAddProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState("BLOG_POST");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        contentType,
      });

      // Reset
      setTitle("");
      setDescription("");
      setContentType("BLOG_POST");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setContentType("BLOG_POST");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Post"
      description={`This post will be added to the ${statusConfig?.label || status} column`}
      size="md"
      footer={
        <div className="flex w-full justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Creating..."
            leftIcon={<Zap className="h-4 w-4" />}
            disabled={!title.trim()}
          >
            Create Post
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Status:
          </span>
          <StatusBadge status={status as PostStatus} size="md" />
        </div>

        {/* Title */}
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What are you creating?"
          required
          autoFocus
        />

        {/* Description */}
        <Input
          label="Short Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief summary..."
        />

        {/* Content Type */}
        <Select
          label="Content Type"
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          options={contentTypeOptions}
        />
      </form>
    </Modal>
  );
}