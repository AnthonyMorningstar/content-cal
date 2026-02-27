// ============================================
// Stripe Client & Helpers
// ============================================
// Server-side Stripe SDK configuration
// and helper functions for checkout, portal, etc.

import Stripe from "stripe";

// Initialize Stripe with secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

/**
 * Create a Stripe Checkout Session for Pro subscription
 */
export async function createCheckoutSession({
  userId,
  userEmail,
  customerId,
}: {
  userId: string;
  userEmail: string;
  customerId?: string | null;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Create or reuse Stripe customer
  let stripeCustomerId = customerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: userEmail,
      metadata: {
        userId,
      },
    });
    stripeCustomerId = customer.id;
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/settings/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/settings/billing?canceled=true`,
    subscription_data: {
      metadata: {
        userId,
      },
    },
    metadata: {
      userId,
    },
  });

  return { sessionId: session.id, url: session.url, customerId: stripeCustomerId };
}

/**
 * Create a Stripe Customer Portal session
 * (for managing subscription, invoices, payment methods)
 */
export async function createPortalSession(customerId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${baseUrl}/settings/billing`,
  });

  return { url: session.url };
}

/**
 * Get subscription details from Stripe
 */
export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch {
    return null;
  }
}

/**
 * Cancel a subscription at period end
 */
export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
  return subscription;
}

/**
 * Reactivate a canceled subscription (before period ends)
 */
export async function reactivateSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
  return subscription;
}