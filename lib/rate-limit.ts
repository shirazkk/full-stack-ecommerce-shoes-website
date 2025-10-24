// Simple in-memory rate limiting utility
// For production, consider using Redis or a dedicated rate limiting service

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (request: Request) => string; // Custom key generator
}

const defaultOptions: RateLimitOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per window
  keyGenerator: (request: Request) => {
    // Default: use IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    return ip;
  },
};

export function createRateLimit(options: Partial<RateLimitOptions> = {}) {
  const config = { ...defaultOptions, ...options };

  return async (request: Request): Promise<{ allowed: boolean; remaining: number; resetTime: number }> => {
    const key = config.keyGenerator!(request);
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Clean up expired entries
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) {
        rateLimitStore.delete(k);
      }
    }

    const entry = rateLimitStore.get(key);

    if (!entry || entry.resetTime < now) {
      // First request or window expired
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + config.windowMs,
      };
      rateLimitStore.set(key, newEntry);

      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: newEntry.resetTime,
      };
    }

    if (entry.count >= config.maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Increment counter
    entry.count++;
    rateLimitStore.set(key, entry);

    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  };
}

// Pre-configured rate limiters for common use cases
export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 minutes
});

export const apiRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 API calls per 15 minutes
});

export const webhookRateLimit = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 webhook calls per minute
});

// Middleware helper for Next.js API routes
export function withRateLimit(
  rateLimiter: ReturnType<typeof createRateLimit>,
  options: { skipSuccessfulRequests?: boolean } = {}
) {
  return async (request: Request) => {
    const result = await rateLimiter(request);

    if (!result.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.resetTime.toString(),
          },
        }
      );
    }

    return null; // No rate limit exceeded
  };
}
