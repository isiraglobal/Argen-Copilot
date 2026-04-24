import { Context } from 'hono';

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

export function rateLimit(maxRequests: number = 60, windowSeconds: number = 60) {
  return (c: Context, next: () => Promise<void>) => {
    const ip = c.req.header('x-forwarded-for') || c.req.header('cf-connecting-ip') || 'unknown';
    const now = Date.now();

    if (!store[ip]) {
      store[ip] = { count: 0, resetTime: now + windowSeconds * 1000 };
    }

    const record = store[ip];

    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + windowSeconds * 1000;
    }

    record.count++;

    if (record.count > maxRequests) {
      return c.json(
        { error: 'Rate limit exceeded' },
        429
      );
    }

    c.header('X-RateLimit-Limit', maxRequests.toString());
    c.header('X-RateLimit-Remaining', (maxRequests - record.count).toString());
    c.header('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000).toString());

    return next();
  };
}
