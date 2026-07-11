import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', err.message);

  const statusCode = (err as any).statusCode || 500;
  const response: ApiResponse = {
    success: false,
    error: err.message || 'Internal server error',
  };

  res.status(statusCode).json(response);
}
