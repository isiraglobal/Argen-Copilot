/**
 * Whop Payment Integration
 * Handles subscription management and checkout
 */

export interface WhopPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_cycle: 'free' | 'monthly' | 'yearly';
  ai_credits: number;
  features: string[];
}

export interface WhopCheckout {
  success: boolean;
  checkout_url: string;
  expires_at: number;
}

export interface UserSubscription {
  user_id: string;
  subscription_id: string | null;
  plan_type: string;
  plan_name: string;
  status: 'active' | 'cancelled' | 'expired';
  billing_cycle: string;
  ai_credits: number;
  ai_credits_used: number;
  renewal_date: string | null;
  cancel_at_period_end: boolean;
}

/**
 * Fetch available plans from Whop
 */
export async function fetchWhopPlans(): Promise<WhopPlan[]> {
  try {
    const response = await fetch('/api/whop/plans');
    if (!response.ok) throw new Error('Failed to fetch plans');
    const data = await response.json();
    return data.plans || [];
  } catch (error) {
    console.error('Failed to fetch Whop plans:', error);
    return [];
  }
}

/**
 * Create a checkout session
 */
export async function createCheckoutSession(
  planId: string,
  billingCycle: 'monthly' | 'yearly' = 'monthly'
): Promise<WhopCheckout | null> {
  try {
    const response = await fetch('/api/payments/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan_id: planId,
        billing_cycle,
      }),
    });

    if (!response.ok) throw new Error('Failed to create checkout');
    return await response.json();
  } catch (error) {
    console.error('Failed to create checkout:', error);
    return null;
  }
}

/**
 * Get user's current subscription
 */
export async function getUserSubscription(): Promise<UserSubscription | null> {
  try {
    const response = await fetch('/api/payments/subscription');
    if (!response.ok) throw new Error('Failed to fetch subscription');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch subscription:', error);
    return null;
  }
}

/**
 * Sync subscription with Whop
 */
export async function syncSubscription(whopSubscriptionId: string): Promise<boolean> {
  try {
    const response = await fetch('/api/payments/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ whop_subscription_id: whopSubscriptionId }),
    });

    if (!response.ok) throw new Error('Failed to sync subscription');
    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error('Failed to sync subscription:', error);
    return false;
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
  try {
    const response = await fetch('/api/payments/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription_id: subscriptionId }),
    });

    if (!response.ok) throw new Error('Failed to cancel subscription');
    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    return false;
  }
}

/**
 * Handle Whop webhook
 * This is called by Whop's servers, not by the client
 */
export async function handleWhopWebhook(event: {
  type: string;
  data: Record<string, any>;
}): Promise<void> {
  try {
    // Parse webhook payload
    const { type, data } = event;

    switch (type) {
      case 'subscription.created':
        // User subscribed to a plan
        await syncSubscription(data.subscription_id);
        break;

      case 'subscription.updated':
        // Subscription was updated (plan change, renewal, etc.)
        await syncSubscription(data.subscription_id);
        break;

      case 'subscription.cancelled':
        // Subscription was cancelled
        // User will be downgraded to free plan
        console.log(`Subscription cancelled: ${data.subscription_id}`);
        break;

      case 'payment.succeeded':
        // Payment was processed successfully
        console.log(`Payment succeeded: ${data.charge_id}`);
        break;

      case 'payment.failed':
        // Payment failed
        console.error(`Payment failed: ${data.charge_id}`);
        break;

      default:
        console.log(`Unknown webhook type: ${type}`);
    }
  } catch (error) {
    console.error('Error handling Whop webhook:', error);
  }
}

/**
 * Format price for display
 */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Calculate savings for yearly plan
 */
export function calculateYearlySavings(monthlyPrice: number, yearlyPrice: number): number {
  const annualMonthly = monthlyPrice * 12;
  return annualMonthly - yearlyPrice;
}

/**
 * Get plan features comparison
 */
export function getFeatureComparison(plans: WhopPlan[]): Record<string, any[]> {
  const comparison: Record<string, any[]> = {
    'AI Credits': plans.map((p) => p.ai_credits),
  };

  // Extract common features
  if (plans.length > 0) {
    const firstPlanFeatures = plans[0].features || [];
    firstPlanFeatures.forEach((feature) => {
      const allHave = plans.every((p) => p.features?.includes(feature));
      if (allHave) {
        comparison[feature] = plans.map(() => true);
      }
    });
  }

  return comparison;
}
