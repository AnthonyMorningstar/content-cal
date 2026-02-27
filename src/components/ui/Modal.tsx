// ============================================
// Modal Component
// ============================================
// Accessible dialog overlay with animations,
// multiple sizes, and close-on-click-outside

"use client";

import { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const modalSizes = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[90vw]",
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: keyof typeof modalSizes;
  children: React.ReactNode;
  /** Footer content (buttons, etc.) */
  footer?: React.ReactNode;
  /** Whether clicking the backdrop closes the modal */
  closeOnBackdrop?: boolean;
  /** Whether pressing Escape closes the modal */
  closeOnEscape?: boolean;
  /** Hide the close (X) button */
  hideCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = "md",
  children,
  footer,
  closeOnBackdrop = true,
  closeOnEscape = true,
  hideCloseButton = false,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle Escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEscape) {
        onClose();
      }
    },
    [onClose, closeOnEscape]
  );

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === overlayRef.current) {
      onClose();
    }
  };

  // Add/remove event listeners and body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";

      // Focus trap — focus the modal content
      contentRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* ---- Backdrop ---- */}
      <div
        ref={overlayRef}
        onClick={handleBackdropClick}
        className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in"
      >
        {/* ---- Modal Content ---- */}
        <div
          ref={contentRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          aria-describedby={description ? "modal-description" : undefined}
          tabIndex={-1}
          className={cn(
            "relative w-full rounded-2xl bg-white shadow-2xl animate-scale-in dark:bg-surface-800",
            "max-h-[90vh] overflow-hidden",
            modalSizes[size]
          )}
        >
          {/* ---- Header ---- */}
          {(title || !hideCloseButton) && (
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4 dark:border-surface-700">
              <div>
                {title && (
                  <h2
                    id="modal-title"
                    className="text-lg font-semibold text-slate-900 dark:text-white"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    id="modal-description"
                    className="mt-1 text-sm text-slate-500 dark:text-slate-400"
                  >
                    {description}
                  </p>
                )}
              </div>

              {!hideCloseButton && (
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-surface-700 dark:hover:text-slate-300"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          {/* ---- Body ---- */}
          <div className="overflow-y-auto px-6 py-4">{children}</div>

          {/* ---- Footer ---- */}
          {footer && (
            <div className="border-t border-slate-200 px-6 py-4 dark:border-surface-700">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}