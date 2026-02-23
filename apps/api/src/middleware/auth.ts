import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rally-dev-secret';

export interface AuthRequest extends Request {
  userPubkey?: string;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Authorization header required' });
    return;
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // For hackathon: accept raw pubkey as token for simplicity
    // Production: verify JWT signed by wallet
    if (token.length >= 32 && token.length <= 44) {
      // Looks like a Solana pubkey (base58, 32-44 chars)
      req.userPubkey = token;
      next();
      return;
    }

    // Try JWT verification
    const decoded = jwt.verify(token, JWT_SECRET) as { pubkey: string };
    req.userPubkey = decoded.pubkey;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid authentication token' });
  }
}

export function generateToken(pubkey: string): string {
  return jwt.sign({ pubkey }, JWT_SECRET, { expiresIn: '7d' });
}
