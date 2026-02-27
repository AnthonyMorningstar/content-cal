// ============================================
// Button Component
// ============================================
// Versatile button with multiple variants,
// sizes, loading states, and icon support

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ---- Variant Styles ----
const variants = {
  primary:
    "bg-brand-600 text-white shadow-sm hover:bg-brand-700 focus:ring-brand-500 dark:bg-brand-600 dark:hover:bg-brand-500",
  secondary:
    "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400 dark:bg-surface-700 dark:text-slate-200 dark:hover:bg-surface-600",
  outline:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-brand-500 dark:border-surface-600 dark:bg-surface-800 dark:text-slate-200 dark:hover:bg-surface-700",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400 dark:text-slate-400 dark:hover:bg-surface-700 dark:hover:text-white",
  danger:
    "bg-red-600 text-white shadow-sm hover:bg-red-700 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-500",
  success:
    "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus:ring-emerald-500",
  link:
    "text-brand-600 underline-offset-4 hover:underline focus:ring-brand-500 dark:text-brand-400",
};

// ---- Size Styles ----
const sizes = {
  xs: "h-7 px-2.5 text-xs rounded-md gap-1",
  sm: "h-8 px-3 text-sm rounded-lg gap-1.5",
  md: "h-10 px-4 text-sm rounded-lg gap-2",
  lg: "h-11 px-6 text-base rounded-lg gap-2",
  xl: "h-12 px-8 text-base rounded-xl gap-2.5",
  icon_sm: "h-8 w-8 rounded-lg",
  icon_md: "h-10 w-10 rounded-lg",
  icon_lg: "h-12 w-12 rounded-xl",
};

// ---- Types ----
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// ---- Component ----
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center font-semibold transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-surface-900",
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Applied variant and size
          variants[variant],
          sizes[size],
          // Full width
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        )}

        {/* Left icon (hidden when loading) */}
        {!isLoading && leftIcon && (
          <span className="shrink-0">{leftIcon}</span>
        )}

        {/* Label */}
        {children && (
          <span>
            {isLoading && loadingText ? loadingText : children}
          </span>
        )}

        {/* Right icon */}
        {!isLoading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;