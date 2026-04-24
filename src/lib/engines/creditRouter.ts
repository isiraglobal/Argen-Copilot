import { generateSimulatedOutput } from './SimulatedOutputEngine';

export interface CreditRoute {
  mode: 'cached' | 'structure_cache' | 'offline' | 'api';
  credits_used: number;
  reason: string;
}

const EVAL_CACHE_KEY = (hash: string) => `eval_${hash}`;
const STRUCTURE_CACHE_KEY = (challengeId: string, key: string) => `cache_${challengeId}_${key}`;

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

function getMonthKey(): string {
  const now = new Date();
  return `ai_usage_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

interface QuotaState {
  monthly_limit: number;
  used_this_month: number;
}

export async function routeToCredit(
  prompt: string,
  challengeId: string,
  userQuota: QuotaState,
  globalCache?: Record<string, any>
): Promise<CreditRoute> {
  const hash = hashString(prompt);
  const cacheKey = EVAL_CACHE_KEY(hash);

  // Layer 1: Exact hash cache (localStorage)
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return {
        mode: 'cached',
        credits_used: 0,
        reason: 'Exact prompt hash found in local cache',
      };
    }
  } catch {
    // localStorage might not be available
  }

  // Layer 2: Global structure cache (from SystemSettings entity)
  if (globalCache) {
    const structKey = STRUCTURE_CACHE_KEY(challengeId, 'output');
    if (globalCache[structKey]) {
      return {
        mode: 'structure_cache',
        credits_used: 0,
        reason: 'Structure cache hit for this challenge',
      };
    }
  }

  // Layer 3: Soft-cap check (80% of monthly quota)
  const softCapThreshold = userQuota.monthly_limit * 0.8;
  if (userQuota.used_this_month >= softCapThreshold) {
    return {
      mode: 'offline',
      credits_used: 0,
      reason: `At 80% quota (${userQuota.used_this_month}/${userQuota.monthly_limit}), using offline engine`,
    };
  }

  // Layer 4: Real Claude API call available
  return {
    mode: 'api',
    credits_used: 1,
    reason: 'Using real Claude API for full evaluation',
  };
}

export function cacheResult(prompt: string, result: any): void {
  const hash = hashString(prompt);
  const cacheKey = EVAL_CACHE_KEY(hash);

  try {
    localStorage.setItem(cacheKey, JSON.stringify(result));
  } catch {
    // localStorage might be full or unavailable
  }
}

// Credit limits per plan
export const CREDIT_LIMITS: Record<string, number> = {
  free: 5,
  creator: 30,
  architect: 80,
};

// Team pool calculation: base 300 + (seat_count * 10)
export function getTeamCredits(seatCount: number): number {
  return 300 + seatCount * 10;
}

export function getRemainingCredits(quota: QuotaState): number {
  return Math.max(0, quota.monthly_limit - quota.used_this_month);
}

export function getPercentageUsed(quota: QuotaState): number {
  return Math.round((quota.used_this_month / quota.monthly_limit) * 100);
}

export function canUseApi(quota: QuotaState): boolean {
  return quota.used_this_month < quota.monthly_limit;
}
