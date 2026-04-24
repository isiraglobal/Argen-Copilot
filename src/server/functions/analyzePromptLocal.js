/**
 * analyzePromptLocal — Smart AI credit routing backend function.
 * In Base44 this runs as a Deno serverless function.
 * For self-hosted: implement as an Express endpoint at POST /functions/analyzePromptLocal
 *
 * Credit tiers:
 *   Individual: free=5, creator=30, architect=80 per month
 *   Team: 300 + (seat_count * 10) shared pool per month
 *
 * Actions:
 *   check_quota — returns hasQuota, used, limit, nearLimit
 *   analyze     — local scoring (no AI, no credits)
 *   evaluate    — smart routing: cache → offline → real AI
 *   cache_result — store result after real AI evaluation
 */

const INDIVIDUAL_LIMITS = { free: 5, creator: 30, architect: 80 };
const BASE_TEAM_POOL = 300;
const PER_SEAT_CREDITS = 10;
const SOFT_CAP_PCT = 0.80;

function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

function localAnalyzePrompt(prompt, challenge) {
  const words = prompt.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const hasRole = /you are|act as|as a|as an/i.test(prompt);
  const hasFormat = /bullet|list|table|paragraph|format|structure/i.test(prompt);
  const hasTone = /tone|formal|informal|professional|friendly|concise/i.test(prompt);
  const hasContext = /context|background|because|given that|assuming/i.test(prompt);
  const hasConstraint = /limit|max|only|avoid|don't|do not|must|should/i.test(prompt);

  let score = 40;
  const strengths = [], weaknesses = [], suggestions = [];
  if (wordCount >= 20) { score += 15; strengths.push("Good length with enough detail"); }
  else if (wordCount >= 10) { score += 8; strengths.push("Reasonable prompt length"); }
  else { weaknesses.push("Prompt is very short"); suggestions.push("Add more detail"); }
  if (hasRole) { score += 12; strengths.push("Sets a clear role for the AI"); }
  else { weaknesses.push("No role defined"); suggestions.push("Add 'You are a [role]...' at the start"); }
  if (hasFormat) { score += 10; strengths.push("Specifies output format"); }
  else { weaknesses.push("No format specified"); suggestions.push("Specify bullet points, paragraph, table, etc."); }
  if (hasTone) { score += 8; strengths.push("Tone/style specified"); }
  if (hasContext) { score += 8; strengths.push("Context provided"); }
  if (hasConstraint) { score += 7; strengths.push("Has constraints"); }
  if (wordCount < 8) score = Math.min(score, 30);
  score = Math.min(100, Math.max(10, score));
  return { readiness_score: score, strengths, weaknesses, suggestions, mode: "local" };
}

function offlineEvaluate(prompt, challenge) {
  const analysis = localAnalyzePrompt(prompt, challenge);
  const base = analysis.readiness_score;
  const jitter = () => Math.round((Math.random() * 12) - 6);
  const scores = {
    clarity: Math.min(100, Math.max(10, base + jitter())),
    completeness: Math.min(100, Math.max(10, base - 5 + jitter())),
    creativity: Math.min(100, Math.max(10, base - 8 + jitter())),
    effectiveness: Math.min(100, Math.max(10, base + jitter())),
  };
  const overall = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 4);
  let feedback = overall >= 75
    ? `Strong prompt. ${analysis.strengths.slice(0, 2).join('. ')}. Add precise constraints to push further.`
    : overall >= 55
    ? `Decent effort. To improve: ${analysis.suggestions.slice(0, 1).join('. ')}.`
    : `Needs work. ${analysis.weaknesses.slice(0, 2).join('. ')}. ${analysis.suggestions.join('. ')}.`;
  return { scores, overall_score: overall, feedback, mode: "offline" };
}

// Express handler:
// app.post('/functions/analyzePromptLocal', async (req, res) => {
//   const user = await getUserFromToken(req);
//   const { action, prompt, challenge } = req.body;
//   const monthKey = new Date().toISOString().slice(0, 7);
//   const indivLimit = INDIVIDUAL_LIMITS[user.subscription?.planType] || INDIVIDUAL_LIMITS.free;
//   const used = user[`ai_usage_${monthKey}`] || 0;
//   const hasQuota = used < indivLimit;
//   const nearLimit = used >= Math.floor(indivLimit * SOFT_CAP_PCT);
//
//   if (action === 'check_quota') return res.json({ hasQuota, used, limit: indivLimit, nearLimit });
//   if (action === 'analyze') return res.json({ ...localAnalyzePrompt(prompt, challenge), hasQuota, used, limit: indivLimit });
//   if (action === 'evaluate') {
//     if (!hasQuota || nearLimit) return res.json({ ...offlineEvaluate(prompt, challenge), useRealAI: false, used, limit: indivLimit });
//     // Consume quota then return useRealAI: true for frontend to call OpenAI
//     await updateUser(user.id, { [`ai_usage_${monthKey}`]: used + 1 });
//     return res.json({ useRealAI: true, quotaConsumed: true, used: used + 1, limit: indivLimit });
//   }
//   res.status(400).json({ error: 'Unknown action' });
// });

module.exports = { localAnalyzePrompt, offlineEvaluate, INDIVIDUAL_LIMITS, BASE_TEAM_POOL, PER_SEAT_CREDITS };
