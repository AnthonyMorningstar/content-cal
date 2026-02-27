// ============================================
// Mobile Sidebar Overlay
// ============================================
// Slide-out sidebar for mobile screens
// Shows when hamburger menu is tapped

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  LayoutDashboard,
  Columns3,
  FileText,
  Settings,
  CreditCard,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  LayoutDashboard,
  Calendar,
  Columns3,
  FileText,
  Settings,
  CreditCard,
};

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

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ---- Backdrop Overlay ---- */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ---- Slide-out Panel ---- */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-white transition-transform duration-300 ease-in-out dark:bg-surface-900 lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-surface-700">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
            onClick={onClose}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-purple-600">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              ContentCal
            </span>
          </Link>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-surface-700 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Menu
          </p>
          <div className="space-y-1">
            {mainNav.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all",
                    active
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-surface-800 dark:hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Upgrade Card */}
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
              onClick={onClose}
              className="mt-3 flex w-full items-center justify-center rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Upgrade Now
            </Link>
          </div>
        </div>

        {/* Bottom links */}
        <div className="border-t border-slate-200 px-3 py-3 dark:border-surface-700">
          {bottomNav.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all",
                  active
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-surface-800 dark:hover:text-white"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}