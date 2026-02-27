// ============================================
// Card Component
// ============================================
// Flexible container with header, body, footer

import { cn } from "@/lib/utils";

// ---- Card Root ----
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  children,
  className,
  hoverable = false,
  onClick,
  padding = "md",
}: CardProps) {
  const paddingMap = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border border-slate-200 bg-white dark:border-surface-700 dark:bg-surface-800",
        hoverable &&
          "cursor-pointer transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-surface-600",
        onClick && "cursor-pointer",
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

// ---- Card Header ----
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function CardHeader({ children, className, action }: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between",
        className
      )}
    >
      <div>{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ---- Card Title ----
interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4";
}

export function CardTitle({
  children,
  className,
  as: Tag = "h3",
}: CardTitleProps) {
  return (
    <Tag
      className={cn(
        "text-lg font-semibold text-slate-900 dark:text-white",
        className
      )}
    >
      {children}
    </Tag>
  );
}

// ---- Card Description ----
interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p
      className={cn(
        "mt-1 text-sm text-slate-500 dark:text-slate-400",
        className
      )}
    >
      {children}
    </p>
  );
}

// ---- Card Content ----
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn("mt-4", className)}>{children}</div>;
}

// ---- Card Footer ----
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div
      className={cn(
        "mt-4 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-surface-700",
        className
      )}
    >
      {children}
    </div>
  );
}