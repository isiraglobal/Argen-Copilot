import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (url && key) {
  supabase = createClient(url, key);
} else {
  console.error('Supabase ENV missing');
}

export { supabase };
export type AuthUser = any;