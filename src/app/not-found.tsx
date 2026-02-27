// ============================================
// 404 Not Found Page
// ============================================

import Link from "next/link";
import { Calendar, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-50 px-4 dark:bg-surface-900">
      {/* Logo */}
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-purple-600">
          <Calendar className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold text-slate-900 dark:text-white">
          ContentCal
        </span>
      </Link>

      {/* Content */}
      <div className="text-center">
        <p className="text-8xl font-extrabold text-brand-600 dark:text-brand-400">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
          Page not found
        </h1>
        <p className="mt-3 max-w-md text-slate-600 dark:text-slate-400">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-surface-600 dark:bg-surface-800 dark:text-slate-200 dark:hover:bg-surface-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}