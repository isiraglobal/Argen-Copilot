/**
 * whopCreateCheckout — Creates a Whop checkout session.
 * POST /functions/whopCreateCheckout
 * Body: { plan_type: "creator" | "architect", billing_cycle: "monthly" | "yearly" }
 *
 * Returns: { checkout_url: string }
 */

// const PLAN_IDS = {
//   creator_monthly: process.env.WHOP_CREATOR_MONTHLY_PLAN_ID,
//   creator_yearly: process.env.WHOP_CREATOR_YEARLY_PLAN_ID,
//   architect_monthly: process.env.WHOP_ARCHITECT_MONTHLY_PLAN_ID,
//   architect_yearly: process.env.WHOP_ARCHITECT_YEARLY_PLAN_ID,
// };
//
// app.post("/functions/whopCreateCheckout", authenticate, async (req, res) => {
//   const { plan_type, billing_cycle } = req.body;
//   const planId = PLAN_IDS[`${plan_type}_${billing_cycle}`];
//   if (!planId) return res.status(400).json({ success: false, error: "Invalid plan" });
//
//   const returnUrl = encodeURIComponent(`${process.env.APP_URL}/explore?checkout=success`);
//   const cancelUrl = encodeURIComponent(`${process.env.APP_URL}/explore?checkout=cancelled`);
//   const checkout_url = `https://whop.com/checkout/${planId}?returnUrl=${returnUrl}&cancelUrl=${cancelUrl}`;
//
//   return res.json({ success: true, checkout_url });
// });

module.exports = {};
