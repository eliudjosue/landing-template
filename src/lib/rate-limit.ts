interface RateLimitStore {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimit {
  private store: RateLimitStore = {};
  private window: number; // in seconds
  private max: number;

  constructor() {
    this.window = parseInt(process.env.RATE_LIMIT_WINDOW || '60');
    this.max = parseInt(process.env.RATE_LIMIT_MAX || '20');
  }

  check(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const key = ip;

    // Clean up expired entries
    this.cleanup();

    if (!this.store[key]) {
      this.store[key] = {
        count: 1,
        resetTime: now + (this.window * 1000),
      };
      return {
        allowed: true,
        remaining: this.max - 1,
        resetTime: this.store[key].resetTime,
      };
    }

    const record = this.store[key];

    if (now > record.resetTime) {
      // Reset the window
      record.count = 1;
      record.resetTime = now + (this.window * 1000);
      return {
        allowed: true,
        remaining: this.max - 1,
        resetTime: record.resetTime,
      };
    }

    if (record.count >= this.max) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
      };
    }

    record.count++;
    return {
      allowed: true,
      remaining: this.max - record.count,
      resetTime: record.resetTime,
    };
  }

  private cleanup() {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (now > this.store[key].resetTime) {
        delete this.store[key];
      }
    });
  }
}

export const rateLimiter = new RateLimit();