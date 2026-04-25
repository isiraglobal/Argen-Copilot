import { Context } from 'hono';
import { eq, and, desc } from 'drizzle-orm';
import { Database } from '../lib/db';
import { submissions, user_progress } from '../db/schema';

interface SubmissionRequest {
  challenge_id: string;
  prompt_text: string;
  mode: 'offline' | 'api';
}

interface EvaluationResult {
  clarity_score: number;
  completeness_score: number;
  creativity_score: number;
  effectiveness_score: number;
  overall_score: number;
  feedback: string;
  mode: string;
}

function scorePrompt(prompt: string, mode: 'offline' | 'api' = 'offline'): EvaluationResult {
  const wordCount = prompt.trim().split(/\s+/).filter(Boolean).length;
  const hasRole = /\b(you are|act as|as a)\b/i.test(prompt);
  const hasFormat = /\b(format|json|table|list|bullets?|markdown)\b/i.test(prompt);
  const hasContext = /\b(context|audience|goal|background|for a)\b/i.test(prompt);
  const hasConstraints = /\b(limit|must|avoid|include|under|exactly|constraints?)\b/i.test(prompt);

  const clarity_score = Math.min(100, 35 + Math.min(wordCount, 30) + (hasRole ? 15 : 0) + (hasConstraints ? 10 : 0));
  const completeness_score = Math.min(100, 35 + Math.min(wordCount, 25) + (hasContext ? 20 : 0) + (hasFormat ? 15 : 0));
  const creativity_score = Math.min(100, 45 + Math.min(wordCount, 20) + (hasRole ? 10 : 0) + (hasContext ? 10 : 0));
  const effectiveness_score = Math.min(100, Math.round((clarity_score + completeness_score) / 2) + (hasConstraints ? 8 : 0));
  const overall_score = Math.round((clarity_score + completeness_score + creativity_score + effectiveness_score) / 4);

  return {
    clarity_score,
    completeness_score,
    creativity_score,
    effectiveness_score,
    overall_score,
    feedback: overall_score >= 70
      ? 'Strong submission. The prompt is clear enough to produce a useful response.'
      : 'Submission saved. Add clearer role, context, output format, and constraints to improve the score.',
    mode,
  };
}

export async function submitPrompt(c: Context, db: Database, userId: string) {
  try {
    const body = (await c.req.json()) as SubmissionRequest;
    const { challenge_id, prompt_text, mode = 'offline' } = body;

    if (!challenge_id || !prompt_text) {
      return c.json({ error: 'Challenge ID and prompt text are required' }, 400);
    }

    const evaluation = scorePrompt(prompt_text, mode);
    const creditsUsed = mode === 'api' ? 1 : 0;
    const isSolved = evaluation.overall_score >= 70 ? 1 : 0;

    const previousAttempts = await db
      .select()
      .from(submissions)
      .where(and(eq(submissions.user_id, userId), eq(submissions.challenge_id, challenge_id)));
    const attemptNumber = previousAttempts.length + 1;
    const submissionId = crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);

    await db.insert(submissions).values({
      id: submissionId,
      user_id: userId,
      challenge_id,
      prompt_text,
      clarity_score: evaluation.clarity_score,
      completeness_score: evaluation.completeness_score,
      creativity_score: evaluation.creativity_score,
      effectiveness_score: evaluation.effectiveness_score,
      overall_score: evaluation.overall_score,
      feedback: evaluation.feedback,
      is_solved: isSolved,
      attempt_number: attemptNumber,
      created_at: now,
      updated_at: now,
    });

    const existingProgress = await db
      .select()
      .from(user_progress)
      .where(and(eq(user_progress.user_id, userId), eq(user_progress.challenge_id, challenge_id)))
      .limit(1);

    if (existingProgress.length) {
      await db
        .update(user_progress)
        .set({
          best_score: Math.max(existingProgress[0].best_score || 0, evaluation.overall_score),
          attempts: (existingProgress[0].attempts || 0) + 1,
          is_completed: existingProgress[0].is_completed || isSolved,
          completed_at: existingProgress[0].completed_at || (isSolved ? now : null),
        })
        .where(eq(user_progress.id, existingProgress[0].id));
    } else {
      await db.insert(user_progress).values({
        id: crypto.randomUUID(),
        user_id: userId,
        challenge_id,
        best_score: evaluation.overall_score,
        attempts: 1,
        is_completed: isSolved,
        completed_at: isSolved ? now : null,
      });
    }

    return c.json({
      id: submissionId,
      challenge_id,
      user_id: userId,
      ...evaluation,
      credits_used: creditsUsed,
      is_solved: isSolved,
      attempt_number: attemptNumber,
      created_at: new Date().toISOString(),
    }, 201);
  } catch (error) {
    console.error('Failed to process submission:', error);
    return c.json({ error: 'Failed to process submission', details: String(error) }, 500);
  }
}

export async function getSubmission(c: Context, db: Database, userId: string) {
  try {
    const submissionId = c.req.param('id') || '';
    const data = await db
      .select()
      .from(submissions)
      .where(and(eq(submissions.id, submissionId), eq(submissions.user_id, userId)))
      .limit(1);
    if (!data.length) return c.json({ error: 'Submission not found' }, 404);
    return c.json(data[0]);
  } catch (error) {
    return c.json({ error: 'Failed to fetch submission' }, 500);
  }
}

export async function listSubmissions(c: Context, db: Database, userId: string) {
  try {
    const challengeId = c.req.query('challenge_id');
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const offset = (page - 1) * limit;

    const conditions = challengeId
      ? and(eq(submissions.user_id, userId), eq(submissions.challenge_id, challengeId))
      : eq(submissions.user_id, userId);
    const data = await db
      .select()
      .from(submissions)
      .where(conditions)
      .orderBy(desc(submissions.created_at))
      .limit(limit)
      .offset(offset);
    return c.json({
      submissions: data,
      total: data.length,
      page,
      limit,
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch submissions' }, 500);
  }
}

export async function deleteSubmission(c: Context, userId: string) {
  try {
    const submissionId = c.req.param('id');
    // TODO: Delete submission, verify ownership
    return c.json({ success: true, id: submissionId });
  } catch (error) {
    return c.json({ error: 'Failed to delete submission' }, 500);
  }
}

export async function evaluateSubmission(c: Context, userId: string) {
  try {
    const submissionId = c.req.param('id');
    const { prompt_text } = await c.req.json();
    const evaluation = scorePrompt(prompt_text, 'api');

    // TODO: Update submission in D1 with evaluation
    return c.json({
      id: submissionId,
      ...evaluation,
      evaluated_at: new Date().toISOString(),
    });
  } catch (error) {
    return c.json({ error: 'Failed to evaluate submission' }, 500);
  }
}

export async function getSubmissionStats(c: Context, userId: string) {
  try {
    // TODO: Calculate stats for user
    return c.json({
      total_submissions: 0,
      solved_challenges: 0,
      average_score: 0,
      best_score: 0,
      current_streak: 0,
      longest_streak: 0,
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch submission stats' }, 500);
  }
}
