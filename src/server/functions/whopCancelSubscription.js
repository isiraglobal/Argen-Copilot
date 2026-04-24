/**
 * whopCancelSubscription — Cancels the user's active Whop membership.
 * POST /functions/whopCancelSubscription
 * No body required — uses authenticated user's membership ID.
 */

// const axios = require("axios");
//
// app.post("/functions/whopCancelSubscription", authenticate, async (req, res) => {
//   const user = req.user;
//   const WHOP_API_KEY = process.env.WHOP_API_KEY;
//   const membershipId = user.subscription?.membershipId;
//
//   if (!membershipId) return res.status(400).json({ success: false, error: "No active subscription found" });
//
//   try {
//     await axios.post(`https://api.whop.com/v2/memberships/${membershipId}/cancel`, {}, {
//       headers: { Authorization: `Bearer ${WHOP_API_KEY}` }
//     });
//     await updateUser(user.id, { subscription: { ...user.subscription, cancelAtPeriodEnd: true, status: "cancelling" } });
//     return res.json({ success: true });
//   } catch (error) {
//     console.error("Cancel error:", error);
//     return res.status(500).json({ success: false, error: error.message });
//   }
// });

module.exports = {};
