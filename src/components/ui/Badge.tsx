// ============================================
// Badge Component
// ============================================
// Small label/tag for status, categories, etc.

import { cn } from "@/lib/utils";

const variants = {
  default:
    "bg-slate-100 text-slate-700 dark:bg-surface-700 dark:text-slate-300",
  primary:
    "bg-brand-100 text-brand-800 dark:bg-brand-900/30 dark:text-brand-400",
  success:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  warning:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  danger:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  info:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  purple:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  pink:
    "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  orange:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
};

const sizes = {
  xs: "px-1.5 py-0.5 text-[10px]",
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1 text-sm",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  dot?: boolean;
  dotColor?: string;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  size = "sm",
  dot = false,
  dotColor,
  icon,
  removable = false,
  onRemove,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {/* Color dot */}
      {dot && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: dotColor || "currentColor" }}
        />
      )}

      {/* Icon */}
      {icon && <span className="shrink-0">{icon}</span>}

      {/* Label */}
      {children}

      {/* Remove button */}
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
          aria-label="Remove"
        >
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L6 5.293l.646-.647a.5.5 0 0 1 .708.708L6.707 6l.647.646a.5.5 0 0 1-.708.708L6 6.707l-.646.647a.5.5 0 0 1-.708-.708L5.293 6l-.647-.646a.5.5 0 0 1 0-.708z" />
          </svg>
        </button>
      )}
    </span>
  );
}