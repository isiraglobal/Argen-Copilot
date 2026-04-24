# Payments Migration: Whop → Stripe

## Current state
ArGen uses Whop for subscriptions. Backend functions involved:
- whopCreateCheckout → creates checkout URL
- whopWebhook → handles payment events  
- syncWhopSubscription → verifies and syncs subscription
- whopCancelSubscription → cancels subscription
- whopGetPlans / whopGetPlanId → returns plan IDs

## Stripe equivalent

### 1. Create checkout session
```js
const session = await stripe.checkout.sessions.create({
  mode: "subscription",
  payment_method_types: ["card"],
  line_items: [{ price: "price_xxx", quantity: 1 }],
  success_url: `${APP_URL}/explore?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${APP_URL}/explore?checkout=cancelled`,
});
return { checkout_url: session.url };
```

### 2. Webhook handler
```js
app.post("/webhooks/stripe", express.raw({ type: "application/json" }), (req, res) => {
  const event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET);
  if (event.type === "checkout.session.completed") { /* activate subscription */ }
  if (event.type === "customer.subscription.deleted") { /* downgrade to free */ }
  res.json({ received: true });
});
```

### 3. Plan prices
| Plan       | Monthly       | Yearly        |
|------------|---------------|---------------|
| Creator    | $9.99/month   | $99/year      |
| Architect  | $19.99/month  | $199/year     |

### 4. Subscription object shape (keep compatible)
```json
{
  "planType": "creator",
  "planName": "Creator",
  "status": "active",
  "billingCycle": "monthly",
  "expiresAt": "2026-12-01T00:00:00Z",
  "cancelAtPeriodEnd": false
}
```
