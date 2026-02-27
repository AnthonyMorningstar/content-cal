// ============================================
// Quick Actions Component
// ============================================
// Action cards for common tasks: create post,
// open calendar, open board, etc.

"use client";

import Link from "next/link";
import {
  Plus,
  Calendar,
  Columns3,
  FileText,
  Zap,
} from "lucide-react";

const actions = [
  {
    label: "New Blog Post",
    description: "Start writing a new article",
    href: "/posts/new",
    icon: Plus,
    color: "from-brand-500 to-brand-600",
    shadowColor: "shadow-brand-500/20",
  },
  {
    label: "Open Calendar",
    description: "Plan your monthly content",
    href: "/calendar",
    icon: Calendar,
    color: "from-blue-500 to-cyan-500",
    shadowColor: "shadow-blue-500/20",
  },
  {
    label: "View Board",
    description: "Track your content pipeline",
    href: "/board",
    icon: Columns3,
    color: "from-purple-500 to-pink-500",
    shadowColor: "shadow-purple-500/20",
  },
  {
    label: "All Posts",
    description: "Manage all your content",
    href: "/posts",
    icon: FileText,
    color: "from-amber-500 to-orange-500",
    shadowColor: "shadow-amber-500/20",
  },
];

export default function QuickActions() {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-4 w-4 text-amber-500" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Quick Actions
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 transition-all hover:border-slate-300 hover:shadow-md dark:border-surface-600 dark:hover:border-surface-500"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${action.color} shadow-lg ${action.shadowColor}`}
            >
              <action.icon className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 group-hover:text-brand-600 dark:text-slate-200 dark:group-hover:text-brand-400">
                {action.label}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}