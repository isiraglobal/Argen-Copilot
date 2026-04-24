/**
 * joinTeam — Adds user to a team by invite code, upgrades their subscription.
 * POST /functions/joinTeam
 * Body: { invite_code: string }
 */

// app.post("/functions/joinTeam", authenticate, async (req, res) => {
//   const { invite_code } = req.body;
//   const user = req.user;
//
//   const teams = await db.entities.Team.filter({ invite_code: invite_code.toUpperCase() });
//   if (!teams.length) return res.status(404).json({ success: false, error: "Invalid invite code" });
//
//   const team = teams[0];
//   if (team.members?.includes(user.email)) return res.status(400).json({ success: false, error: "Already in team" });
//
//   await db.entities.Team.update(team.id, { members: [...(team.members || []), user.email] });
//   await updateUser(user.id, {
//     team_id: team.id,
//     subscription: { planType: "architect", planName: "Architect", status: "active" }
//   });
//
//   return res.json({ success: true, team_id: team.id });
// });

module.exports = {};
