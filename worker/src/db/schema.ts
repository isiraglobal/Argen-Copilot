import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// === USERS & AUTHENTICATION ===
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  avatar_url: text('avatar_url'),
  role: text('role').default('user'),
  plan_type: text('plan_type').default('free'),
  plan_name: text('plan_name').default('Explorer'),
  subscription_status: text('subscription_status').default('inactive'),
  billing_cycle: text('billing_cycle'),
  expires_at: integer('expires_at'),
  created_at: integer('created_at').default(sql`(unixepoch())`),
  updated_at: integer('updated_at').default(sql`(unixepoch())`),
  dashboard_mode: text('dashboard_mode').default('basic'),
});

// === CHALLENGES ===
export const challenges = sqliteTable('challenges', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  difficulty: text('difficulty').notNull(),
  category: text('category').notNull(),
  points: integer('points').default(100),
  expected_output: text('expected_output'),
  constraints: text('constraints'),
  example_prompt: text('example_prompt'),
  is_premium: integer('is_premium').default(0),
  created_by: text('created_by'),
  created_at: integer('created_at').default(sql`(unixepoch())`),
  updated_at: integer('updated_at').default(sql`(unixepoch())`),
});

// === SUBMISSIONS ===
export const submissions = sqliteTable('submissions', {
  id: text('id').primaryKey(),
  user_id: text('user_id').notNull(),
  challenge_id: text('challenge_id').notNull(),
  prompt_text: text('prompt_text').notNull(),
  clarity_score: integer('clarity_score'),
  completeness_score: integer('completeness_score'),
  creativity_score: integer('creativity_score'),
  effectiveness_score: integer('effectiveness_score'),
  overall_score: integer('overall_score'),
  feedback: text('feedback'),
  is_solved: integer('is_solved').default(0),
  attempt_number: integer('attempt_number'),
  created_at: integer('created_at').default(sql`(unixepoch())`),
  updated_at: integer('updated_at').default(sql`(unixepoch())`),
});

// === USER PROGRESS ===
export const user_progress = sqliteTable('user_progress', {
  id: text('id').primaryKey(),
  user_id: text('user_id').notNull(),
  challenge_id: text('challenge_id').notNull(),
  best_score: integer('best_score').default(0),
  attempts: integer('attempts').default(0),
  is_completed: integer('is_completed').default(0),
  completed_at: integer('completed_at'),
});

// === TEAMS ===
export const teams = sqliteTable('teams', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  owner_id: text('owner_id').notNull(),
  member_count: integer('member_count').default(1),
  plan_type: text('plan_type').default('free'),
  ai_pool_year_month: text('ai_pool_year_month'),
  ai_pool_usage: integer('ai_pool_usage').default(0),
  created_at: integer('created_at').default(sql`(unixepoch())`),
  updated_at: integer('updated_at').default(sql`(unixepoch())`),
});

// === NOTIFICATIONS ===
export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  user_id: text('user_id').notNull(),
  title: text('title').notNull(),
  message: text('message'),
  is_read: integer('is_read').default(0),
  action_url: text('action_url'),
  created_at: integer('created_at').default(sql`(unixepoch())`),
});

// === COURSES ===
export const courses = sqliteTable('courses', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  created_by: text('created_by'),
  created_at: integer('created_at').default(sql`(unixepoch())`),
});

// === FEEDBACK ===
export const feedback = sqliteTable('feedback', {
  id: text('id').primaryKey(),
  user_id: text('user_id').notNull(),
  message: text('message').notNull(),
  rating: integer('rating'),
  created_at: integer('created_at').default(sql`(unixepoch())`),
});

// === SYSTEM SETTINGS (for cache) ===
export const system_settings = sqliteTable('system_settings', {
  id: text('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  updated_at: integer('updated_at').default(sql`(unixepoch())`),
});

// TODO: Add remaining tables (blogs, tutorials, documentation, team_pricing_config, etc.)
