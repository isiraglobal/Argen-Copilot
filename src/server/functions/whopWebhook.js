/**
 * whopWebhook — Handles Whop payment webhook events.
 * POST /functions/whopWebhook
 *
 * Events handled:
 *   membership.went_valid   — activate subscription
 *   membership.went_invalid — deactivate / expire subscription
 *   payment.succeeded       — log transaction
 *   payment.failed          — log failed payment
 */

// const crypto = require("crypto");
//
// app.post("/functions/whopWebhook", express.raw({ type: "application/json" }), async (req, res) => {
//   const sig = req.headers["x-whop-signature"];
//   const secret = process.env.WHOP_WEBHOOK_SECRET;
//
//   // Verify signature
//   const hmac = crypto.createHmac("sha256", secret).update(req.body).digest("hex");
//   if (hmac !== sig) return res.status(401).json({ error: "Invalid signature" });
//
//   const event = JSON.parse(req.body);
//   const { action, data } = event;
//
//   if (action === "membership.went_valid") {
//     const membership = data;
//     const userEmail = membership.discord?.username || membership.user?.email;
//     const planType = membership.plan?.metadata?.tier || "creator";
//     const billingCycle = membership.renewal_period_start ? "monthly" : "yearly";
//     await updateUserSubscription(userEmail, {
//       planType, planName: planType.charAt(0).toUpperCase() + planType.slice(1),
//       status: "active", membershipId: membership.id,
//       billingCycle, expiresAt: new Date(membership.renewal_period_end * 1000).toISOString()
//     });
//   }
//
//   if (action === "membership.went_invalid") {
//     const membership = data;
//     const userEmail = membership.user?.email;
//     await updateUserSubscription(userEmail, { planType: "free", planName: "Explorer", status: "expired" });
//   }
//
//   res.json({ received: true });
// });

module.exports = {};
