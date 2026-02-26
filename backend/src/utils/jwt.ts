import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface TokenPayload {
  userId: string;
  role: string;
}

// Signs a JWT with userId and role — expires based on JWT_EXPIRES_IN env var
export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

// Verifies and decodes a JWT — throws JsonWebTokenError or TokenExpiredError on failure
// Both error types are already handled by our central errorHandler
export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, env.jwtSecret) as TokenPayload;
}
