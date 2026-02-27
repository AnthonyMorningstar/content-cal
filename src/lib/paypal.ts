// ============================================
// PayPal Client & Helpers
// ============================================
// Server-side PayPal REST API integration
// for subscription management

const PAYPAL_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

/**
 * Get PayPal access token using client credentials
 */
async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Failed to get PayPal access token");
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Create a PayPal subscription
 */
export async function createPayPalSubscription({
  userId,
  userEmail,
}: {
  userId: string;
  userEmail: string;
}) {
  const accessToken = await getAccessToken();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const planId = process.env.PAYPAL_PRO_PLAN_ID!;

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      plan_id: planId,
      subscriber: {
        email_address: userEmail,
      },
      custom_id: userId,
      application_context: {
        brand_name: "ContentCal",
        locale: "en-US",
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
        return_url: `${baseUrl}/settings/billing?paypal_success=true`,
        cancel_url: `${baseUrl}/settings/billing?paypal_canceled=true`,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("PayPal subscription creation error:", errorData);
    throw new Error("Failed to create PayPal subscription");
  }

  const subscription = await response.json();

  // Find the approval URL
  const approvalLink = subscription.links?.find(
    (link: { rel: string; href: string }) => link.rel === "approve"
  );

  return {
    subscriptionId: subscription.id,
    approvalUrl: approvalLink?.href,
    status: subscription.status,
  };
}

/**
 * Get PayPal subscription details
 */
export async function getPayPalSubscription(subscriptionId: string) {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

/**
 * Cancel PayPal subscription
 */
export async function cancelPayPalSubscription(
  subscriptionId: string,
  reason: string = "User requested cancellation"
) {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}/cancel`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    }
  );

  return response.ok;
}

/**
 * Verify PayPal webhook signature
 */
export async function verifyPayPalWebhook(
  headers: Record<string, string>,
  body: string
): Promise<boolean> {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_algo: headers["paypal-auth-algo"],
        cert_url: headers["paypal-cert-url"],
        transmission_id: headers["paypal-transmission-id"],
        transmission_sig: headers["paypal-transmission-sig"],
        transmission_time: headers["paypal-transmission-time"],
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: JSON.parse(body),
      }),
    }
  );

  if (!response.ok) return false;

  const data = await response.json();
  return data.verification_status === "SUCCESS";
}