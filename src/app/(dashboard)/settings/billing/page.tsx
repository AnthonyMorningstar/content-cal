// ============================================
// Billing Page — Full Version
// ============================================
// Subscription management with Stripe + PayPal

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Receipt,
  Shield,
} from "lucide-react";
import PricingCards from "@/components/billing/PricingCards";
import { useSubscription } from "@/hooks/useSubscription";
import Button from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function BillingPage() {
  const searchParams = useSearchParams();
  const {
    billing,
    isLoading,
    refetch,
    startStripeCheckout,
    openStripePortal,
    startPayPalCheckout,
  } = useSubscription();

  // Show success/cancel toasts based on URL params
  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    if (toastShown) return;

    if (searchParams.get("success") === "true") {
      toast.success("🎉 Welcome to Pro! Your subscription is now active.", {
        duration: 6000,
      });
      setToastShown(true);
      refetch();
    }

    if (searchParams.get("canceled") === "true") {
      toast.error("Checkout was canceled. No charges were made.", {
        duration: 5000,
      });
      setToastShown(true);
    }

    if (searchParams.get("paypal_success") === "true") {
      toast.success(
        "🎉 PayPal subscription created! It may take a moment to activate.",
        { duration: 6000 }
      );
      setToastShown(true);
      // Poll for activation
      const interval = setInterval(() => {
        refetch();
      }, 3000);
      setTimeout(() => clearInterval(interval), 30000);
    }

    if (searchParams.get("paypal_canceled") === "true") {
      toast.error("PayPal checkout was canceled.", { duration: 5000 });
      setToastShown(true);
    }
  }, [searchParams, toastShown, refetch]);

  return (
    <div className="space-y-8">
      {/* ---- Header ---- */}
      <div>
        <h1 className="page-title">Billing & Subscription</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your plan and payment methods
        </p>
      </div>

      {/* ---- Current Plan Status ---- */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>
              <span className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-brand-500" />
                Current Plan
              </span>
            </CardTitle>
            <CardDescription>
              Your active subscription details
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Plan badge */}
              <div
                className={cn(
                  "flex items-center gap-4 rounded-xl p-4",
                  billing?.plan === "PRO"
                    ? "bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-900/10 dark:to-purple-900/10"
                    : "bg-slate-50 dark:bg-surface-700"
                )}
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl",
                    billing?.plan === "PRO"
                      ? "bg-gradient-to-br from-brand-500 to-purple-600 text-white shadow-lg shadow-brand-500/20"
                      : "bg-slate-200 dark:bg-surface-600"
                  )}
                >
                  {billing?.plan === "PRO" ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <span className="text-xl">🆓</span>
                  )}
                </div>

                <div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {billing?.plan === "PRO" ? "Pro Plan" : "Free Plan"}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {billing?.plan === "PRO"
                      ? "Unlimited posts · All features"
                      : "10 posts per month · Basic features"}
                  </p>
                </div>
              </div>

              {/* Usage meter */}
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Posts this month
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {billing?.postsUsedThisMonth || 0}
                    {billing?.plan !== "PRO" &&
                      ` / ${billing?.postsLimit || 10}`}
                    {billing?.plan === "PRO" && " (unlimited)"}
                  </span>
                </div>

                {billing?.plan !== "PRO" && (
                  <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-surface-700">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        (() => {
                          const pct =
                            ((billing?.postsUsedThisMonth || 0) /
                              (billing?.postsLimit || 10)) *
                            100;
                          if (pct >= 100) return "bg-red-500";
                          if (pct >= 70) return "bg-amber-500";
                          return "bg-emerald-500";
                        })()
                      )}
                      style={{
                        width: `${Math.min(
                          ((billing?.postsUsedThisMonth || 0) /
                            (billing?.postsLimit || 10)) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Manage button (Pro users) */}
              {billing?.plan === "PRO" && (
                <Button
                  variant="outline"
                  onClick={openStripePortal}
                  leftIcon={<Receipt className="h-4 w-4" />}
                >
                  Manage Subscription & Invoices
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ---- Pricing Cards ---- */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          {billing?.plan === "PRO" ? "Your Plan" : "Choose Your Plan"}
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Skeleton className="h-96 rounded-2xl" />
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        ) : (
          <PricingCards
            currentPlan={billing?.plan || "FREE"}
            onStripeCheckout={startStripeCheckout}
            onPayPalCheckout={startPayPalCheckout}
            onManageBilling={openStripePortal}
          />
        )}
      </div>

      {/* ---- FAQ / Trust Signals ---- */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>
              <span className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-500" />
                Frequently Asked Questions
              </span>
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes! You can cancel your Pro subscription at any time. You'll keep Pro access until the end of your current billing period.",
              },
              {
                q: "What happens to my posts if I downgrade?",
                a: "All your existing posts are safe. You'll still be able to view and edit them, but new post creation will be limited to 10 per month.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit/debit cards (Visa, Mastercard, Amex) via Stripe, and PayPal for direct payments.",
              },
              {
                q: "Is my payment information secure?",
                a: "Absolutely. All payments are processed through Stripe and PayPal. We never store your card details on our servers.",
              },
              {
                q: "Can I get a refund?",
                a: "If you're not satisfied within the first 7 days, contact us and we'll issue a full refund — no questions asked.",
              },
            ].map(({ q, a }) => (
              <div key={q}>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {q}
                </h4>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {a}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}