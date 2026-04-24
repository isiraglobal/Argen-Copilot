import { Context } from 'hono';
import { Database } from '../lib/db';
import { challenges, user_progress } from '../db/schema';
import { eq, like, and } from 'drizzle-orm';

export async function getChallenges(c: Context, db: Database) {
  try {
    const search = c.req.query('search') || '';
    const difficulty = c.req.query('difficulty');
    const category = c.req.query('category');
    const limit = Math.min(parseInt(c.req.query('limit') || '50'), 100);
    const offset = parseInt(c.req.query('offset') || '0');

    let query = db.select().from(challenges);
    const conditions: any[] = [];

    if (search) {
      conditions.push(like(challenges.title, `%${search}%`));
    }
    if (difficulty && difficulty !== 'all') {
      conditions.push(eq(challenges.difficulty, difficulty));
    }
    if (category && category !== 'all') {
      conditions.push(eq(challenges.category, category));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const data = await query.limit(limit).offset(offset);
    const total = await db.select().from(challenges);

    return c.json({
      data,
      pagination: {
        total: total.length,
        limit,
        offset,
        hasMore: offset + limit < total.length,
      },
    });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return c.json({ error: 'Failed to fetch challenges', details: String(error) }, 500);
  }
}

export async function createChallenge(c: Context, db: Database, userId: string) {
  try {
    const {
      id,
      title,
      description,
      difficulty,
      category,
      points,
      expected_output,
      constraints,
      example_prompt,
      is_premium,
    } = await c.req.json();

    if (!id || !title || !description || !difficulty || !category) {
      return c.json(
        { error: 'Missing required fields' },
        400
      );
    }

    // Check if challenge already exists
    const existing = await db
      .select()
      .from(challenges)
      .where(eq(challenges.id, id))
      .limit(1);

    if (existing.length > 0) {
      return c.json({ error: 'Challenge already exists' }, 409);
    }

    // Insert challenge
    await db.insert(challenges).values({
      id,
      title,
      description,
      difficulty,
      category,
      points: points || 100,
      expected_output,
      constraints,
      example_prompt,
      is_premium: is_premium ? 1 : 0,
      created_by: userId,
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    });

    return c.json({
      id,
      title,
      description,
      difficulty,
      category,
      points: points || 100,
      is_premium: Boolean(is_premium),
      created_by: userId,
      created_at: new Date().toISOString(),
    }, 201);
  } catch (error) {
    console.error('Error creating challenge:', error);
    return c.json({ error: 'Failed to create challenge', details: String(error) }, 500);
  }
}

export async function getChallenge(c: Context, db: Database, userId: string) {
  try {
    const id = c.req.param('id');
    const challenge = await db
      .select()
      .from(challenges)
      .where(eq(challenges.id, id))
      .limit(1);

    if (!challenge.length) {
      return c.json({ error: 'Challenge not found' }, 404);
    }

    // Get user progress for this challenge
    const progress = await db
      .select()
      .from(user_progress)
      .where(
        and(
          eq(user_progress.user_id, userId),
          eq(user_progress.challenge_id, id)
        )
      )
      .limit(1);

    return c.json({
      ...challenge[0],
      user_progress: progress[0] || {
        best_score: 0,
        attempts: 0,
        is_completed: 0,
      },
    });
  } catch (error) {
    console.error('Error fetching challenge:', error);
    return c.json({ error: 'Failed to fetch challenge' }, 500);
  }
}

export async function getUserProgress(c: Context, db: Database, userId: string) {
  try {
    const challengeId = c.req.param('challengeId');
    const progress = await db
      .select()
      .from(user_progress)
      .where(
        and(
          eq(user_progress.user_id, userId),
          eq(user_progress.challenge_id, challengeId)
        )
      )
      .limit(1);

    return c.json(
      progress[0] || {
        user_id: userId,
        challenge_id: challengeId,
        best_score: 0,
        attempts: 0,
        is_completed: 0,
      }
    );
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return c.json({ error: 'Failed to fetch progress' }, 500);
  }
}

export async function getCategories(c: Context, db: Database) {
  try {
    const data = await db.select({ category: challenges.category }).from(challenges).distinct();
    const categories = data.map((d) => d.category).filter(Boolean);

    return c.json({ categories: [...new Set(categories)] });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return c.json({ error: 'Failed to fetch categories' }, 500);
  }
}

export async function getDifficulties(c: Context, db: Database) {
  try {
    const data = await db.select({ difficulty: challenges.difficulty }).from(challenges).distinct();
    const difficulties = data.map((d) => d.difficulty).filter(Boolean);

    return c.json({ difficulties: [...new Set(difficulties)] });
  } catch (error) {
    console.error('Error fetching difficulties:', error);
    return c.json({ error: 'Failed to fetch difficulties' }, 500);
  }
}
