CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  plan_type TEXT DEFAULT 'free',
  plan_name TEXT DEFAULT 'Explorer',
  subscription_status TEXT DEFAULT 'inactive',
  billing_cycle TEXT,
  expires_at INTEGER,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  dashboard_mode TEXT DEFAULT 'basic'
);

CREATE TABLE IF NOT EXISTS challenges (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  category TEXT NOT NULL,
  points INTEGER DEFAULT 100,
  expected_output TEXT,
  constraints TEXT,
  example_prompt TEXT,
  is_premium INTEGER DEFAULT 0,
  created_by TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  challenge_id TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  clarity_score INTEGER,
  completeness_score INTEGER,
  creativity_score INTEGER,
  effectiveness_score INTEGER,
  overall_score INTEGER,
  feedback TEXT,
  is_solved INTEGER DEFAULT 0,
  attempt_number INTEGER,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS user_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  challenge_id TEXT NOT NULL,
  best_score INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  is_completed INTEGER DEFAULT 0,
  completed_at INTEGER
);
