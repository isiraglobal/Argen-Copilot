import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../db/schema';

export function initializeDB(env: any) {
  const db = drizzle(env.DB, { schema });
  return db;
}

export type Database = ReturnType<typeof initializeDB>;
