/**
 * generateDailyChallenges — Generates new AI challenges and adds to existing courses.
 * POST /functions/generateDailyChallenges
 * Body: { count: number (max 10), mode: "existing" | "new_courses" }
 */

// const OpenAI = require("openai");
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
//
// app.post("/functions/generateDailyChallenges", authenticate, requireAdmin, async (req, res) => {
//   const { count = 5, mode = "existing" } = req.body;
//   const safeCount = Math.min(count, 10);
//   let generatedChallenges = 0;
//
//   const courses = await db.entities.Course.list();
//   if (!courses.length) return res.json({ success: false, error: "No courses found" });
//
//   for (let i = 0; i < safeCount; i++) {
//     const course = courses[Math.floor(Math.random() * courses.length)];
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [{ role: "user", content: `Generate a prompt engineering challenge for course: ${course.title}.
// Return JSON: { title, description, difficulty, category, constraints, example_prompt, expected_outcome, base_points }` }],
//       response_format: { type: "json_object" }
//     });
//     const challenge = JSON.parse(completion.choices[0].message.content);
//     await db.entities.Challenge.create({ ...challenge, course_id: course.id, is_premium: false, total_attempts: 0 });
//     generatedChallenges++;
//   }
//
//   return res.json({ success: true, generatedChallenges });
// });

module.exports = {};
