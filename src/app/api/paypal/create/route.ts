// ============================================
// PayPal Create Subscription API
// ============================================
// POST /api/paypal/create
// Creates a PayPal subscription and returns
// the approval URL to redirect the user

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPayPalSubscription } from "@/lib/paypal";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if already Pro
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

    // Create PayPal subscription
    const { subscriptionId, approvalUrl } = await createPayPalSubscription({
      userId: session.user.id,
      userEmail: session.user.email,
    });

    return NextResponse.json({
      success: true,
      data: {
        subscriptionId,
        approvalUrl,
      },
    });
  } catch (error) {
    console.error("PayPal create subscription error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create PayPal subscription" },
      { status: 500 }
    );
  }
}