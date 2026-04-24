import { Context } from 'hono';

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

// Placeholder for Claude API integration
async function evaluateWithClaudeAPI(
  prompt: string,
  challengeDescription: string,
  expectedOutput: string
): Promise<EvaluationResult> {
  try {
    // TODO: Call Claude API via Anthropic SDK
    // For now, return simulated scores
    return {
      clarity_score: 75,
      completeness_score: 80,
      creativity_score: 70,
      effectiveness_score: 75,
      overall_score: 75,
      feedback: 'Excellent prompt with clear instructions and good structure.',
      mode: 'api',
    };
  } catch (error) {
    throw new Error('Failed to evaluate with Claude API');
  }
}

export async function submitPrompt(c: Context, userId: string) {
  try {
    const body = (await c.req.json()) as SubmissionRequest;
    const { challenge_id, prompt_text, mode } = body;

    if (!challenge_id || !prompt_text) {
      return c.json({ error: 'Challenge ID and prompt text are required' }, 400);
    }

    // TODO: Implement 4-layer credit routing
    let evaluation: EvaluationResult;
    let creditsUsed = 0;

    if (mode === 'api') {
      // Route through Claude API
      evaluation = await evaluateWithClaudeAPI(prompt_text, '', '');
      creditsUsed = 1;
    } else {
      // Offline simulation
      evaluation = {
        clarity_score: 70,
        completeness_score: 75,
        creativity_score: 65,
        effectiveness_score: 70,
        overall_score: 70,
        feedback: 'Good attempt. Try to be more specific with constraints.',
        mode: 'offline',
      };
      creditsUsed = 0;
    }

    // TODO: Save submission to D1
    const submissionId = `sub_${Date.now()}`;

    return c.json({
      id: submissionId,
      challenge_id,
      user_id: userId,
      ...evaluation,
      credits_used: creditsUsed,
      created_at: new Date().toISOString(),
    }, 201);
  } catch (error) {
    return c.json({ error: 'Failed to process submission' }, 500);
  }
}

export async function getSubmission(c: Context, userId: string) {
  try {
    const submissionId = c.req.param('id');
    // TODO: Fetch submission from D1, verify ownership
    return c.json({
      id: submissionId,
      user_id: userId,
      challenge_id: 'challenge_1',
      prompt_text: 'Sample prompt',
      clarity_score: 75,
      completeness_score: 80,
      creativity_score: 70,
      effectiveness_score: 75,
      overall_score: 75,
      feedback: 'Good prompt',
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch submission' }, 500);
  }
}

export async function listSubmissions(c: Context, userId: string) {
  try {
    const challengeId = c.req.query('challenge_id');
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');

    // TODO: Fetch user's submissions, optionally filtered by challenge
    return c.json({
      submissions: [],
      total: 0,
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
    const { prompt_text, challenge_id } = await c.req.json();

    // Evaluate with Claude API
    const evaluation = await evaluateWithClaudeAPI(prompt_text, '', '');

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
