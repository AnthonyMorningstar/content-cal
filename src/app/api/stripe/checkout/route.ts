// ============================================
// Stripe Checkout API
// ============================================
// POST /api/stripe/checkout
// Creates a Stripe Checkout session and returns
// the URL to redirect the user to

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user already has an active pro subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (
      subscription?.plan === "PRO" &&
      subscription.currentPeriodEnd &&
      new Date(subscription.currentPeriodEnd) > new Date()
    ) {
      return NextResponse.json(
        { success: false, error: "You already have an active Pro subscription" },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const { url, customerId } = await createCheckoutSession({
      userId: session.user.id,
      userEmail: session.user.email,
      customerId: subscription?.stripeCustomerId,
    });

    // Save the Stripe customer ID if new
    if (customerId && (!subscription || !subscription.stripeCustomerId)) {
      await prisma.subscription.upsert({
        where: { userId: session.user.id },
        update: { stripeCustomerId: customerId },
        create: {
          userId: session.user.id,
          plan: "FREE",
          stripeCustomerId: customerId,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: { url },
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}