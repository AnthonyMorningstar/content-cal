// ============================================
// Global Loading State
// ============================================
// Shown during page transitions

import { Calendar } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 shadow-xl shadow-brand-500/20">
            <Calendar className="h-7 w-7 text-white" />
          </div>
          {/* Pulse ring */}
          <div className="absolute -inset-2 animate-ping rounded-2xl bg-brand-500/20" />
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Loading...
        </p>
      </div>
    </div>
  );
}