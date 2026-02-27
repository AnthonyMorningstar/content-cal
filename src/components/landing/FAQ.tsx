// ============================================
// FAQ Section
// ============================================
// Accordion-style frequently asked questions

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What types of content can I plan with ContentCal?",
    answer:
      "ContentCal supports Blog Posts, YouTube Videos, Social Media content, Podcasts, and a general 'Other' category. Each type has its own icon and color coding so you can quickly see what's scheduled.",
  },
  {
    question: "Can I use ContentCal for free?",
    answer:
      "Absolutely! The free plan gives you up to 10 posts per month with full access to the calendar view, Kanban board, and status tracking. It's perfect for getting started.",
  },
  {
    question: "How does the drag-and-drop calendar work?",
    answer:
      "Simply create a post with a title and type, then drag it onto any date on the calendar. You can also drag posts between dates to reschedule them, or drag them to the 'Unscheduled' sidebar to remove them from the calendar.",
  },
  {
    question: "What's the difference between the Calendar and Board view?",
    answer:
      "The Calendar view shows your content on a monthly grid organized by date — great for scheduling. The Board view shows your content in columns organized by status (Idea → Writing → Editing → Published) — great for tracking progress.",
  },
  {
    question: "Can I cancel my Pro subscription?",
    answer:
      "Yes! You can cancel anytime from the Billing page. You'll keep Pro access until the end of your current billing period. If you cancel within 7 days, we'll give you a full refund.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. We use industry-standard encryption, secure authentication with NextAuth.js, and all payments are processed through Stripe and PayPal — we never see or store your card details.",
  },
  {
    question: "Can I use ContentCal on my phone?",
    answer:
      "Yes! ContentCal is fully responsive and works beautifully on all devices — desktop, tablet, and mobile. It also supports dark mode for comfortable late-night planning sessions.",
  },
  {
    question: "Do you offer team plans?",
    answer:
      "Currently ContentCal is designed for solo creators. Team collaboration features are on our roadmap — stay tuned for updates!",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-slate-50 py-20 dark:bg-surface-800/50 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* ---- Section Header ---- */}
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            FAQ
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Everything you need to know about ContentCal.
          </p>
        </div>

        {/* ---- Accordion ---- */}
        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={cn(
                "overflow-hidden rounded-xl border transition-all",
                openIndex === index
                  ? "border-brand-200 bg-white shadow-md dark:border-brand-800 dark:bg-surface-800"
                  : "border-slate-200 bg-white hover:border-slate-300 dark:border-surface-700 dark:bg-surface-800 dark:hover:border-surface-600"
              )}
            >
              {/* Question */}
              <button
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span
                  className={cn(
                    "text-sm font-semibold sm:text-base",
                    openIndex === index
                      ? "text-brand-700 dark:text-brand-400"
                      : "text-slate-900 dark:text-white"
                  )}
                >
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "ml-4 h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200",
                    openIndex === index && "rotate-180 text-brand-500"
                  )}
                />
              </button>

              {/* Answer */}
              <div
                className={cn(
                  "grid transition-all duration-200",
                  openIndex === index
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}