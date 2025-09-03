interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
}

class SimpleRateLimit {
  private requests: Map<string, number[]> = new Map();
  private readonly window: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 20) {
    this.window = windowMs;
    this.maxRequests = maxRequests;
  }

  check(identifier: string): RateLimitResult {
    const now = Date.now();
    const windowStart = now - this.window;

    // Get existing requests for this identifier
    const requests = this.requests.get(identifier) || [];
    
    // Filter out old requests
    const validRequests = requests.filter(time => time > windowStart);
    
    // Check if limit exceeded
    if (validRequests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...validRequests);
      const reset = new Date(oldestRequest + this.window);
      
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        reset,
      };
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);

    // Clean up old entries periodically
    if (Math.random() < 0.1) {
      this.cleanup(windowStart);
    }

    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - validRequests.length,
      reset: new Date(now + this.window),
    };
  }

  private cleanup(windowStart: number) {
    for (const [key, requests] of this.requests.entries()) {
      const validRequests = requests.filter(time => time > windowStart);
      if (validRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validRequests);
      }
    }
  }
}

const rateLimiter = new SimpleRateLimit(
  parseInt(process.env.RATE_LIMIT_WINDOW || '60') * 1000,
  parseInt(process.env.RATE_LIMIT_MAX || '20')
);

export function rateLimit(identifier: string): RateLimitResult {
  return rateLimiter.check(identifier);
}