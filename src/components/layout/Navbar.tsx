// ============================================
// Top Navigation Bar
// ============================================
// Fixed navbar at the top with page title,
// search, theme toggle, and user menu

"use client";

import { usePathname } from "next/navigation";
import { Menu, Plus, Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";
import { cn } from "@/lib/utils";

// Map routes to page titles
function getPageTitle(pathname: string): string {
  const titles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/calendar": "Calendar",
    "/board": "Board",
    "/posts": "All Posts",
    "/posts/new": "New Post",
    "/settings": "Settings",
    "/settings/billing": "Billing",
  };

  // Check exact match first
  if (titles[pathname]) return titles[pathname];

  // Check if it's a post edit page
  if (pathname.startsWith("/posts/") && pathname !== "/posts/new") {
    return "Edit Post";
  }

  return "ContentCal";
}

function getPageDescription(pathname: string): string {
  const descriptions: Record<string, string> = {
    "/dashboard": "Overview of your content pipeline",
    "/calendar": "Plan and schedule your content",
    "/board": "Track content through your workflow",
    "/posts": "Manage all your content pieces",
    "/posts/new": "Create a new content piece",
    "/settings": "Manage your account",
    "/settings/billing": "Manage your subscription",
  };

  return descriptions[pathname] || "";
}

interface NavbarProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

export default function Navbar({ onMenuClick, sidebarCollapsed }: NavbarProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const description = getPageDescription(pathname);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white/80 backdrop-blur-xl transition-all dark:border-surface-700 dark:bg-surface-900/80",
        sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-64"
      )}
    >
      <div className="flex w-full items-center justify-between px-4 sm:px-6">
        {/* ---- Left Side ---- */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:text-slate-400 dark:hover:bg-surface-700 dark:hover:text-white"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Page title */}
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              {title}
            </h1>
            {description && (
              <p className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* ---- Right Side ---- */}
        <div className="flex items-center gap-2">
          {/* Search button (placeholder for now) */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-surface-700 dark:hover:text-white"
            title="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Quick add button */}
          <a
            href="/posts/new"
            className="hidden items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md sm:inline-flex"
          >
            <Plus className="h-4 w-4" />
            New Post
          </a>

          {/* Mobile quick add */}
          <a
            href="/posts/new"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white transition-colors hover:bg-brand-700 sm:hidden"
            title="New Post"
          >
            <Plus className="h-5 w-5" />
          </a>

          {/* Theme toggle */}
          <ThemeToggle variant="icon" />

          {/* Divider */}
          <div className="mx-1 hidden h-6 w-px bg-slate-200 dark:bg-surface-700 sm:block" />

          {/* User menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}