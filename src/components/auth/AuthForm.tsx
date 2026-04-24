import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthFormProps {
  mode?: 'login' | 'signup';
  onSuccess?: () => void;
}

export function AuthForm({ mode = 'login', onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if supabase is initialized
      if (!supabase) {
        setError('Authentication service is unavailable. Please check your configuration.');
        console.error('Supabase client not initialized. Check environment variables.');
        return;
      }

      const { error: authError } = 
        mode === 'login'
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (authError) {
        setError(authError.message);
        return;
      }

      onSuccess?.();
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // Check if supabase is initialized
      if (!supabase) {
        setError('Authentication service is unavailable. Please check your configuration.');
        console.error('Supabase client not initialized. Check environment variables.');
        setLoading(false);
        return;
      }

      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        setError(authError.message);
      }
    } catch (err) {
      setError('OAuth login failed. Please try again.');
      console.error('OAuth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md retro-box p-8">
      <h2 className="text-xl font-bold mb-6">
        {mode === 'login' ? 'Login to ArGen' : 'Sign Up for ArGen'}
      </h2>

      {error && (
        <div className="retro-box retro-box-dark mb-4 p-4">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="retro-btn-primary w-full"
        >
          {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="retro-btn w-full"
      >
        {loading ? 'Loading...' : '🔐 Login with Google'}
      </button>
    </div>
  );
}
