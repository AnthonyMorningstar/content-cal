// ============================================
// Confirm Dialog Component
// ============================================
// "Are you sure?" dialog for delete actions, etc.

"use client";

import Modal from "./Modal";
import Button from "./Button";
import { AlertTriangle, Trash2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  danger: {
    icon: Trash2,
    iconBg: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    confirmVariant: "danger" as const,
  },
  warning: {
    icon: AlertTriangle,
    iconBg:
      "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    confirmVariant: "primary" as const,
  },
  info: {
    icon: Info,
    iconBg:
      "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    confirmVariant: "primary" as const,
  },
};

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: keyof typeof variants;
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" hideCloseButton>
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div
          className={cn(
            "mb-4 flex h-14 w-14 items-center justify-center rounded-full",
            config.iconBg
          )}
        >
          <Icon className="h-7 w-7" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}

        {/* Buttons */}
        <div className="mt-6 flex w-full gap-3">
          <Button
            variant="outline"
            fullWidth
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={config.confirmVariant}
            fullWidth
            onClick={onConfirm}
            isLoading={isLoading}
            loadingText="Processing..."
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}