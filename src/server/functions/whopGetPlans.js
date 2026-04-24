/**
 * whopGetPlans — Returns available Whop plan IDs.
 * POST /functions/whopGetPlans
 * Also used as whopGetPlanId with body: { tier, cycle }
 */

// const PLAN_IDS = {
//   creator_monthly: process.env.WHOP_CREATOR_MONTHLY_PLAN_ID,
//   creator_yearly: process.env.WHOP_CREATOR_YEARLY_PLAN_ID,
//   architect_monthly: process.env.WHOP_ARCHITECT_MONTHLY_PLAN_ID,
//   architect_yearly: process.env.WHOP_ARCHITECT_YEARLY_PLAN_ID,
// };
//
// app.post("/functions/whopGetPlans", async (req, res) => {
//   return res.json({ success: true, plans: PLAN_IDS });
// });
//
// app.post("/functions/whopGetPlanId", async (req, res) => {
//   const { tier, cycle } = req.body;
//   const planId = PLAN_IDS[`${tier}_${cycle}`];
//   if (!planId) return res.status(400).json({ success: false, error: "Plan not found" });
//   return res.json({ success: true, planId });
// });

module.exports = {};
