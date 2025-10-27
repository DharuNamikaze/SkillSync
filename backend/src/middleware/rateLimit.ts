import { Request, Response, NextFunction } from 'express';

type Key = string;
interface Bucket { count: number; resetAt: number; }

export interface RateLimitOptions {
  windowMs?: number; // time window in ms
  max?: number;      // max requests per window per key
  keyGenerator?: (req: Request) => Key; // how to key a client (default ip)
  message?: string;  // error message
  statusCode?: number; // status code on limit reached
}

// Simple in-memory fixed-window rate limiter suitable for small deployments/dev
export const rateLimit = (opts: RateLimitOptions = {}) => {
  const windowMs = opts.windowMs ?? 15 * 60 * 1000; // 15 minutes
  const max = opts.max ?? 100; // 100 requests per window
  const keyGen = opts.keyGenerator ?? ((req: Request) => req.ip || 'global');
  const statusCode = opts.statusCode ?? 429;
  const message = opts.message ?? 'Too many requests, please try again later.';

  const store = new Map<Key, Bucket>();

  function cleanup(now: number) {
    // Basic GC to prevent unbounded growth
    for (const [k, v] of store.entries()) {
      if (v.resetAt <= now) store.delete(k);
    }
  }

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    cleanup(now);
    const key = keyGen(req);
    const bucket = store.get(key);

    if (!bucket || bucket.resetAt <= now) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      res.setHeader('X-RateLimit-Limit', String(max));
      res.setHeader('X-RateLimit-Remaining', String(max - 1));
      res.setHeader('X-RateLimit-Reset', String(Math.ceil((now + windowMs) / 1000)));
      return next();
    }

    if (bucket.count >= max) {
      res.setHeader('Retry-After', String(Math.ceil((bucket.resetAt - now) / 1000)));
      return res.status(statusCode).json({ ok: false, error: message });
    }

    bucket.count += 1;
    res.setHeader('X-RateLimit-Limit', String(max));
    res.setHeader('X-RateLimit-Remaining', String(max - bucket.count));
    res.setHeader('X-RateLimit-Reset', String(Math.ceil(bucket.resetAt / 1000)));
    next();
  };
};
