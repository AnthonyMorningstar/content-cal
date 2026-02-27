// ============================================
// Empty State Component
// ============================================
// Shown when there's no data to display
// (no posts, empty calendar, etc.)

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center dark:border-surface-700 dark:bg-surface-800/50",
        className
      )}
    >
      {/* Icon */}
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-surface-700 dark:text-slate-500">
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}

      {/* Action button */}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}