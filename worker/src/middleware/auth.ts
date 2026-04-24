import { Context } from 'hono';

interface JWTPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as JWTPayload;
  } catch {
    return null;
  }
}

export async function verifyJWT(c: Context): Promise<string | null> {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7);
  const payload = decodeJWT(token);

  if (!payload) {
    return null;
  }

  // Check expiration
  if (payload.exp * 1000 < Date.now()) {
    return null;
  }

  return payload.sub;
}

export function requireAuth(
  handler: (c: Context, userId: string) => Promise<Response>
) {
  return async (c: Context) => {
    const userId = await verifyJWT(c);

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    return handler(c, userId);
  };
}

export function optionalAuth(
  handler: (c: Context, userId: string | null) => Promise<Response>
) {
  return async (c: Context) => {
    const userId = await verifyJWT(c);
    return handler(c, userId);
  };
}