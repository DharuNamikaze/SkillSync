import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    const logLine = [
      new Date().toISOString(),
      req.ip,
      req.method,
      req.originalUrl,
      res.statusCode,
      `${durationMs.toFixed(1)}ms`
    ].join(' ');
    console.log(logLine);
  });

  next();
};
