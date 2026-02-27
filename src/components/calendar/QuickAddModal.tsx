// ============================================
// Quick Add Post Modal
// ============================================
// Simple modal to quickly create a post from
// a calendar cell click

"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Zap } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { STATUS_CONFIG, CONTENT_TYPE_CONFIG } from "@/lib/constants";

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

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  onSubmit: (data: {
    title: string;
    status: string;
    contentType: string;
    calendarDate: string;
    description?: string;
  }) => Promise<void>;
}

export default function QuickAddModal({
  isOpen,
  onClose,
  date,
  onSubmit,
}: QuickAddModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("IDEA");
  const [contentType, setContentType] = useState("BLOG_POST");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !date) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        contentType,
        calendarDate: format(date, "yyyy-MM-dd"),
      });

      // Reset form
      setTitle("");
      setDescription("");
      setStatus("IDEA");
      setContentType("BLOG_POST");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setStatus("IDEA");
    setContentType("BLOG_POST");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Quick Add Post"
      description={
        date
          ? `Creating post for ${format(date, "EEEE, MMMM d, yyyy")}`
          : undefined
      }
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
        {/* Date badge */}
        {date && (
          <div className="flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 dark:bg-brand-900/20">
            <Calendar className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            <span className="text-sm font-medium text-brand-700 dark:text-brand-300">
              {format(date, "EEEE, MMMM d, yyyy")}
            </span>
          </div>
        )}

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

        {/* Status & Type side by side */}
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
      </form>
    </Modal>
  );
}