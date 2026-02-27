// ============================================
// Status Badge Component
// ============================================
// Displays content status with proper color coding
// Used throughout calendar, board, and post lists

import Badge from "@/components/ui/Badge";
import { STATUS_CONFIG, CONTENT_TYPE_CONFIG } from "@/lib/constants";
import type { PostStatus, ContentType } from "@prisma/client";

// ---- Status Badge ----
interface StatusBadgeProps {
  status: PostStatus;
  size?: "xs" | "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function StatusBadge({
  status,
  size = "sm",
  showIcon = true,
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  const variantMap: Record<string, "warning" | "info" | "purple" | "success"> = {
    IDEA: "warning",
    WRITING: "info",
    EDITING: "purple",
    PUBLISHED: "success",
  };

  return (
    <Badge variant={variantMap[status]} size={size}>
      {showIcon && <span>{config.icon}</span>}
      {config.label}
    </Badge>
  );
}

// ---- Content Type Badge ----
interface ContentTypeBadgeProps {
  type: ContentType;
  size?: "xs" | "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function ContentTypeBadge({
  type,
  size = "sm",
  showIcon = true,
}: ContentTypeBadgeProps) {
  const config = CONTENT_TYPE_CONFIG[type];

  const variantMap: Record<string, "primary" | "danger" | "pink" | "orange" | "default"> = {
    BLOG_POST: "primary",
    YOUTUBE_VIDEO: "danger",
    SOCIAL_MEDIA: "pink",
    PODCAST: "orange",
    OTHER: "default",
  };

  return (
    <Badge variant={variantMap[type]} size={size}>
      {showIcon && <span>{config.icon}</span>}
      {config.label}
    </Badge>
  );
}