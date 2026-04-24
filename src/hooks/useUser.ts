import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { get } from '@/lib/api';
import type { AuthUser } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: string;
  plan_type: 'free' | 'creator' | 'architect';
  plan_name: string;
  subscription_status: string;
  billing_cycle: string | null;
  expires_at: number | null;
  dashboard_mode: 'basic' | 'business';
}

export function useUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        // Check if supabase is initialized
        if (!supabase) {
          console.error('Supabase client not initialized. Check environment variables.');
          setError(new Error('Authentication service unavailable'));
          setLoading(false);
          return;
        }

        const {
          data: { user: authUser },
          error: authError,
        } = await supabase?.auth.getUser();

        if (authError) throw authError;

        if (authUser) {
          setUser(authUser as AuthUser);
          // Fetch full profile from API
          try {
            const profileData = await get<UserProfile>('/api/user/profile');
            setProfile(profileData);
          } catch (profileError) {
            console.error('Failed to fetch profile:', profileError);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user'));
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Set up auth state listener if supabase is available
    if (!supabase) {
      return;
    }

    const {
      data: { subscription },
    } = supabase?.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user as AuthUser);
        getUser();
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  return { user, profile, loading, error, isAuthenticated: !!user };
}
