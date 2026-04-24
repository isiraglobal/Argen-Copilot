import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client with fallback
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Log initialization status
if (!supabase) {
  console.warn(
    'Supabase not initialized. Missing environment variables:',
    {
      VITE_SUPABASE_URL: !!supabaseUrl,
      VITE_SUPABASE_ANON_KEY: !!supabaseAnonKey,
    }
  );
}

export type AuthUser = import('@supabase/supabase-js').User;