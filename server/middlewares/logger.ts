import { Request, Response, NextFunction } from 'express';

// Log des requêtes entrantes
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  console.log(`📨 ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  next();
};