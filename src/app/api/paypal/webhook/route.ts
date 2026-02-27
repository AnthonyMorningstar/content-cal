// ============================================
// PayPal Webhook Handler
// ============================================
// POST /api/paypal/webhook
// Handles PayPal subscription events:
//   - BILLING.SUBSCRIPTION.ACTIVATED
//   - BILLING.SUBSCRIPTION.CANCELLED
//   - BILLING.SUBSCRIPTION.EXPIRED
//   - PAYMENT.SALE.COMPLETED

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPayPalWebhook } from "@/lib/paypal";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headers: Record<string, string> = {};

    // Collect PayPal headers
    request.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    // Verify webhook signature (skip in development if no webhook ID)
    if (process.env.PAYPAL_WEBHOOK_ID) {
      const isValid = await verifyPayPalWebhook(headers, body);
      if (!isValid) {
        console.error("PayPal webhook signature verification failed");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 400 }
        );
      }
    }

    const event = JSON.parse(body);
    const eventType = event.event_type;
    const resource = event.resource;

    console.log(`PayPal webhook received: ${eventType}`);

    switch (eventType) {
      // ---- Subscription activated ----
      case "BILLING.SUBSCRIPTION.ACTIVATED": {
        const subscriptionId = resource.id;
        const userId = resource.custom_id;

        if (!userId) {
          console.error("No custom_id (userId) in PayPal subscription");
          break;
        }

        // Calculate period end (1 month from now)
        const currentPeriodEnd = new Date();
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

        await prisma.subscription.upsert({
          where: { userId },
          update: {
            plan: "PRO",
            paypalSubscriptionId: subscriptionId,
            currentPeriodEnd,
            cancelAtPeriodEnd: false,
          },
          create: {
            userId,
            plan: "PRO",
            paypalSubscriptionId: subscriptionId,
            currentPeriodEnd,
            cancelAtPeriodEnd: false,
          },
        });

        console.log(`✅ PayPal Pro subscription activated for user: ${userId}`);
        break;
      }

      // ---- Payment completed (renewal) ----
      case "PAYMENT.SALE.COMPLETED": {
        const billingAgreementId = resource.billing_agreement_id;

        if (!billingAgreementId) break;

        const sub = await prisma.subscription.findUnique({
          where: { paypalSubscriptionId: billingAgreementId },
        });

        if (sub) {
          const currentPeriodEnd = new Date();
          currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

          await prisma.subscription.update({
            where: { paypalSubscriptionId: billingAgreementId },
            data: {
              plan: "PRO",
              currentPeriodEnd,
            },
          });

          console.log(`✅ PayPal subscription renewed: ${billingAgreementId}`);
        }
        break;
      }

      // ---- Subscription cancelled ----
      case "BILLING.SUBSCRIPTION.CANCELLED": {
        const subscriptionId = resource.id;

        await prisma.subscription.updateMany({
          where: { paypalSubscriptionId: subscriptionId },
          data: {
            cancelAtPeriodEnd: true,
          },
        });

        console.log(`✅ PayPal subscription cancelled: ${subscriptionId}`);
        break;
      }

      // ---- Subscription expired ----
      case "BILLING.SUBSCRIPTION.EXPIRED": {
        const subscriptionId = resource.id;

        await prisma.subscription.updateMany({
          where: { paypalSubscriptionId: subscriptionId },
          data: {
            plan: "FREE",
            paypalSubscriptionId: null,
            currentPeriodEnd: null,
            cancelAtPeriodEnd: false,
          },
        });

        console.log(`✅ PayPal subscription expired: ${subscriptionId}`);
        break;
      }

      default:
        console.log(`Unhandled PayPal event: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}