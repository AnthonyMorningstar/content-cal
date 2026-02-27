// ============================================
// Landing Page Footer
// ============================================
// Clean footer with links, social, and branding

"use client";

import Link from "next/link";
import { Calendar, Github, Twitter, Heart } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Changelog", href: "#" },
    { label: "Roadmap", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Documentation", href: "#" },
    { label: "Status", href: "#" },
    { label: "API", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-surface-700 dark:bg-surface-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* ---- Top Section ---- */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-purple-600">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                ContentCal
              </span>
            </Link>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              The content calendar for creators who want to stay consistent.
            </p>

            {/* Social links */}
            <div className="mt-5 flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-surface-800 dark:hover:text-slate-300"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-surface-800 dark:hover:text-slate-300"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {category}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ---- Bottom Bar ---- */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 dark:border-surface-700 sm:flex-row">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} ContentCal. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-sm text-slate-400 dark:text-slate-500">
            Made with <Heart className="h-3.5 w-3.5 text-red-500" /> for
            creators everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}