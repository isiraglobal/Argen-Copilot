import { useState, useEffect } from 'react';
import { get } from '@/lib/api';

export interface QuotaInfo {
  monthly_limit: number;
  used_this_month: number;
  remaining: number;
  percentage_used: number;
  can_use_api: boolean;
  next_reset_date: number;
}

export function useQuota() {
  const [quota, setQuota] = useState<QuotaInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const data = await get<QuotaInfo>('/api/user/quota');
        setQuota(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch quota'));
        // Default quota for free users
        setQuota({
          monthly_limit: 5,
          used_this_month: 0,
          remaining: 5,
          percentage_used: 0,
          can_use_api: true,
          next_reset_date: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuota();
  }, []);

  return { quota, loading, error };
}
