// ============================================
// Stripe Customer Portal API
// ============================================
// POST /api/stripe/portal
// Creates a portal session for managing billing

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPortalSession } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's Stripe customer ID
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json(
        { success: false, error: "No billing account found. Please subscribe first." },
        { status: 400 }
      );
    }

    const { url } = await createPortalSession(subscription.stripeCustomerId);

    return NextResponse.json({
      success: true,
      data: { url },
    });
  } catch (error) {
    console.error("Stripe portal error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}