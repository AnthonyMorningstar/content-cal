/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================
// Stripe Webhook Handler
// ============================================
// POST /api/stripe/webhook
// Handles Stripe events for subscription lifecycle:
//   - checkout.session.completed
//   - invoice.payment_succeeded
//   - customer.subscription.updated
//   - customer.subscription.deleted

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

// Disable body parsing — Stripe needs the raw body for signature verification
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Handle different event types
    switch (event.type) {
      // ---- Checkout completed (new subscription) ----
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (!userId || !session.subscription) break;

        // Get subscription details
        const stripeSub = (await stripe.subscriptions.retrieve(
          session.subscription as string
        )) as Stripe.Subscription;

        // Update database
        await prisma.subscription.upsert({
          where: { userId },
          update: {
            plan: "PRO",
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: stripeSub.id,
            stripePriceId: stripeSub.items.data[0]?.price.id,
            currentPeriodEnd: new Date(
              (stripeSub as any).current_period_end * 1000
            ),
            cancelAtPeriodEnd: (stripeSub as any).cancel_at_period_end,
          },
          create: {
            userId,
            plan: "PRO",
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: stripeSub.id,
            stripePriceId: stripeSub.items.data[0]?.price.id,
            currentPeriodEnd: new Date(
              (stripeSub as any).current_period_end * 1000
            ),
            cancelAtPeriodEnd: false,
          },
        });

        console.log(`✅ Pro subscription activated for user: ${userId}`);
        break;
      }

      // ---- Invoice paid (renewal) ----
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription as string;

        if (!subscriptionId) break;

        // Get subscription details
        const stripeSub = (await stripe.subscriptions.retrieve(
          subscriptionId
        )) as Stripe.Subscription;
        const userId = stripeSub.metadata?.userId;

        if (!userId) break;

        // Update period end
        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            plan: "PRO",
            currentPeriodEnd: new Date(
              (stripeSub as any).current_period_end * 1000
            ),
            cancelAtPeriodEnd: (stripeSub as any).cancel_at_period_end,
          },
        });

        console.log(`✅ Subscription renewed for user: ${userId}`);
        break;
      }

      // ---- Subscription updated (cancel/reactivate) ----
      case "customer.subscription.updated": {
        const stripeSub = event.data.object as Stripe.Subscription;

        const dbSub = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: stripeSub.id },
        });

        if (!dbSub) break;

        await prisma.subscription.update({
          where: { stripeSubscriptionId: stripeSub.id },
          data: {
            cancelAtPeriodEnd: (stripeSub as any).cancel_at_period_end,
            currentPeriodEnd: new Date(
              (stripeSub as any).current_period_end * 1000
            ),
          },
        });

        console.log(
          `✅ Subscription updated: cancelAtPeriodEnd=${(stripeSub as any).cancel_at_period_end}`
        );
        break;
      }

      // ---- Subscription deleted/expired ----
      case "customer.subscription.deleted": {
        const stripeSub = event.data.object as Stripe.Subscription;

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: stripeSub.id },
          data: {
            plan: "FREE",
            stripeSubscriptionId: null,
            stripePriceId: null,
            currentPeriodEnd: null,
            cancelAtPeriodEnd: false,
          },
        });

        console.log(`✅ Subscription canceled/expired: ${stripeSub.id}`);
        break;
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}