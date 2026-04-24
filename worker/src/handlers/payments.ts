import { Context } from 'hono';

export async function getWhopPlans(c: Context) {
  try {
    // TODO: Fetch plans from Whop API
    return c.json({
      plans: [
        {
          id: 'plan_explorer',
          name: 'Explorer',
          description: 'Perfect to get started',
          price: 0,
          billing_cycle: 'free',
          ai_credits: 5,
          features: ['5 AI evaluations/month', 'Basic analytics', 'Email support'],
        },
        {
          id: 'plan_creator',
          name: 'Creator',
          description: 'For serious learners',
          price: 999,
          billing_cycle: 'monthly',
          ai_credits: 30,
          features: ['30 AI evaluations/month', 'Advanced analytics', 'Priority support'],
        },
        {
          id: 'plan_architect',
          name: 'Architect',
          description: 'Professional tier',
          price: 2999,
          billing_cycle: 'monthly',
          ai_credits: 80,
          features: ['80 AI evaluations/month', 'Team management', 'API access'],
        },
      ],
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch plans' }, 500);
  }
}

export async function createCheckout(c: Context, userId: string) {
  try {
    const { plan_id, billing_cycle = 'monthly' } = await c.req.json();

    if (!plan_id) {
      return c.json({ error: 'Plan ID is required' }, 400);
    }

    // TODO: Create Whop checkout session
    const checkoutUrl = `https://whop.com/checkout/${plan_id}?user_id=${userId}&billing=${billing_cycle}`;

    return c.json({
      success: true,
      checkout_url: checkoutUrl,
      expires_at: Date.now() + 30 * 60 * 1000, // 30 minutes
    }, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create checkout' }, 400);
  }
}

export async function syncWhopSubscription(c: Context, userId: string) {
  try {
    const { whop_subscription_id } = await c.req.json();

    if (!whop_subscription_id) {
      return c.json({ error: 'Whop subscription ID is required' }, 400);
    }

    // TODO: Fetch subscription from Whop API
    // TODO: Update user subscription in D1

    return c.json({
      success: true,
      user_id: userId,
      subscription_id: whop_subscription_id,
      synced_at: new Date().toISOString(),
    });
  } catch (error) {
    return c.json({ error: 'Failed to sync subscription' }, 500);
  }
}

export async function cancelSubscription(c: Context, userId: string) {
  try {
    const { subscription_id } = await c.req.json();

    if (!subscription_id) {
      return c.json({ error: 'Subscription ID is required' }, 400);
    }

    // TODO: Call Whop API to cancel subscription
    // TODO: Update user plan to free

    return c.json({
      success: true,
      user_id: userId,
      subscription_id,
      cancelled_at: new Date().toISOString(),
      refund_issued: true,
    });
  } catch (error) {
    return c.json({ error: 'Failed to cancel subscription' }, 500);
  }
}

export async function handleWhopWebhook(c: Context) {
  try {
    const signature = c.req.header('X-Whop-Signature');
    const body = await c.req.text();

    // TODO: Verify webhook signature
    // TODO: Process webhook event

    const event = JSON.parse(body);
    const { event_type, data } = event;

    if (event_type === 'subscription.created') {
      // TODO: Update user subscription in D1
    } else if (event_type === 'subscription.updated') {
      // TODO: Update user subscription plan/credits
    } else if (event_type === 'subscription.cancelled') {
      // TODO: Downgrade user to free plan
    }

    return c.json({ success: true, processed: event_type });
  } catch (error) {
    return c.json({ error: 'Failed to process webhook' }, 400);
  }
}

export async function getUserSubscription(c: Context, userId: string) {
  try {
    // TODO: Fetch user subscription from D1
    return c.json({
      user_id: userId,
      subscription_id: null,
      plan_type: 'free',
      plan_name: 'Explorer',
      status: 'active',
      billing_cycle: 'free',
      ai_credits: 5,
      ai_credits_used: 0,
      renewal_date: null,
      cancel_at_period_end: false,
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch subscription' }, 500);
  }
}
