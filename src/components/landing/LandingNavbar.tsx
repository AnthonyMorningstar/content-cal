// ============================================
// Landing Page Navbar
// ============================================
// Clean top nav for public pages with CTA buttons

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Calendar, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function LandingNavbar() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Add glass effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
        isScrolled
          ? "border-b border-slate-200/50 bg-white/80 shadow-sm backdrop-blur-xl dark:border-surface-700/50 dark:bg-surface-900/80"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ---- Logo ---- */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 shadow-md shadow-brand-500/20">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            ContentCal
          </span>
        </Link>

        {/* ---- Desktop Nav Links ---- */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-surface-800 dark:hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* ---- Right Side ---- */}
        <div className="flex items-center gap-3">
          <ThemeToggle variant="icon" />

          <div className="hidden items-center gap-2 sm:flex">
            {session ? (
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started Free</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 md:hidden dark:hover:bg-surface-800"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* ---- Mobile Menu ---- */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white p-4 md:hidden dark:border-surface-700 dark:bg-surface-900">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-surface-800"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 dark:border-surface-700">
            {session ? (
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button fullWidth size="sm">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" fullWidth size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button fullWidth size="sm">
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}