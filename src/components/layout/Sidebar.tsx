// ============================================
// Sidebar Navigation
// ============================================
// Main sidebar for desktop view with navigation
// links, branding, and usage meter

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  LayoutDashboard,
  Columns3,
  FileText,
  Settings,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Map icon names to components
const iconMap = {
  LayoutDashboard,
  Calendar,
  Columns3,
  FileText,
  Settings,
  CreditCard,
};

// Navigation sections
const mainNav = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Calendar", href: "/calendar", icon: "Calendar" },
  { label: "Board", href: "/board", icon: "Columns3" },
  { label: "All Posts", href: "/posts", icon: "FileText" },
];

const bottomNav = [
  { label: "Settings", href: "/settings", icon: "Settings" },
  { label: "Billing", href: "/settings/billing", icon: "CreditCard" },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300 dark:border-surface-700 dark:bg-surface-900",
        isCollapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* ---- Logo / Brand ---- */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-surface-700">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 overflow-hidden"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 shadow-md shadow-brand-500/20">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              ContentCal
            </span>
          )}
        </Link>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={onToggle}
          className={cn(
            "hidden lg:flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors",
            "hover:bg-slate-100 hover:text-slate-600",
            "dark:hover:bg-surface-700 dark:hover:text-slate-300",
            isCollapsed && "ml-auto"
          )}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* ---- Main Navigation ---- */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Menu
            </p>
          )}
          {mainNav.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-surface-800 dark:hover:text-white",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    active
                      ? "text-brand-600 dark:text-brand-400"
                      : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                  )}
                />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ---- Upgrade Card (only when expanded, for free users) ---- */}
      {!isCollapsed && (
        <div className="px-3 pb-2">
          <div className="rounded-xl bg-gradient-to-br from-brand-500/10 to-purple-500/10 p-4 dark:from-brand-500/20 dark:to-purple-500/20">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Upgrade to Pro
              </p>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Unlimited posts & features for $5/mo
            </p>
            <Link
              href="/settings/billing"
              className="mt-3 flex w-full items-center justify-center rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Upgrade Now
            </Link>
          </div>
        </div>
      )}

      {/* ---- Bottom Navigation ---- */}
      <div className="border-t border-slate-200 px-3 py-3 dark:border-surface-700">
        <div className="space-y-1">
          {bottomNav.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-surface-800 dark:hover:text-white",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    active
                      ? "text-brand-600 dark:text-brand-400"
                      : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                  )}
                />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}