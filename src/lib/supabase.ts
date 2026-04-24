// Supabase integration (optional - not required for current build)
// To use Supabase, install @supabase/supabase-js and set environment variables

let supabase = null;

// Gracefully handle missing Supabase dependency
export { supabase };

export type AuthUser = {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
};
