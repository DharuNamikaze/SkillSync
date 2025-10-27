import { Request, Response, NextFunction } from 'express';

function genId(): string {
  // Prefer built-in randomUUID when available
  try {
    const uuid = (global as any).crypto?.randomUUID?.();
    if (uuid) return uuid;
  } catch {}
  // Fallback simple id
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export const requestId = (req: Request, res: Response, next: NextFunction) => {
  const incoming = (req.headers['x-request-id'] as string) || undefined;
  const id = incoming || genId();
  (req as any).id = id;
  res.setHeader('X-Request-Id', id);
  next();
};
