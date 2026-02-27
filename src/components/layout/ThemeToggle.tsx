// ============================================
// Theme Toggle Component
// ============================================
// Switches between light, dark, and system theme
// Uses next-themes under the hood

"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  /** Show as a simple icon button or full toggle with labels */
  variant?: "icon" | "full";
  /** Additional CSS classes */
  className?: string;
}

export default function ThemeToggle({
  variant = "icon",
  className,
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return placeholder with same dimensions to prevent layout shift
    return (
      <div
        className={cn(
          "h-9 w-9 rounded-lg bg-slate-100 dark:bg-surface-700",
          className
        )}
      />
    );
  }

  // Simple icon button (used in navbar)
  if (variant === "icon") {
    return (
      <button
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-all",
          "hover:bg-slate-100 hover:text-slate-900",
          "dark:text-slate-400 dark:hover:bg-surface-700 dark:hover:text-white",
          className
        )}
        aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
        title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      >
        {resolvedTheme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </button>
    );
  }

  // Full toggle with labels (used in settings)
  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  return (
    <div
      className={cn(
        "inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-surface-600 dark:bg-surface-800",
        className
      )}
    >
      {themes.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
            theme === value
              ? "bg-white text-slate-900 shadow-sm dark:bg-surface-600 dark:text-white"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          )}
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}