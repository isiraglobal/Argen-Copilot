/**
 * syncWhopSubscription — Syncs subscription state from Whop API.
 * POST /functions/syncWhopSubscription
 * Body: { receipt_id?: string }
 *
 * Fetches the user's current membership from Whop and updates the user record.
 */

// const axios = require("axios");
//
// app.post("/functions/syncWhopSubscription", authenticate, async (req, res) => {
//   const user = req.user;
//   const WHOP_API_KEY = process.env.WHOP_API_KEY;
//   const WHOP_PRODUCT_ID = process.env.WHOP_PRODUCT_ID;
//
//   try {
//     // Fetch memberships for this user
//     const response = await axios.get(`https://api.whop.com/v2/memberships?user_id=${user.whop_user_id}&product_id=${WHOP_PRODUCT_ID}`, {
//       headers: { Authorization: `Bearer ${WHOP_API_KEY}` }
//     });
//     const memberships = response.data.data || [];
//     const activeMembership = memberships.find(m => m.status === "active" || m.status === "trialing");
//
//     if (!activeMembership) {
//       await updateUser(user.id, { subscription: { planType: "free", planName: "Explorer", status: "expired" } });
//       return res.json({ success: true, subscription: { planType: "free", status: "expired" } });
//     }
//
//     const planType = activeMembership.plan?.metadata?.tier || "creator";
//     const subscription = {
//       planType, planName: planType.charAt(0).toUpperCase() + planType.slice(1),
//       status: activeMembership.status, membershipId: activeMembership.id,
//       billingCycle: "monthly",
//       expiresAt: activeMembership.renewal_period_end ? new Date(activeMembership.renewal_period_end * 1000).toISOString() : null
//     };
//     await updateUser(user.id, { subscription });
//     return res.json({ success: true, subscription });
//   } catch (error) {
//     console.error("Whop sync error:", error);
//     return res.status(500).json({ success: false, error: error.message });
//   }
// });

module.exports = {};
