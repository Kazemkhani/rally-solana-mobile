import { Router } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { authMiddleware, AuthRequest, generateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

const registerSchema = z.object({
  pubkey: z.string().min(32).max(44),
  displayName: z.string().min(1).max(50),
  fcmToken: z.string().optional(),
});

// POST /register — Create or update user
router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { pubkey, displayName, fcmToken } = req.body;

    const user = await prisma.user.upsert({
      where: { pubkey },
      update: { displayName, fcmToken },
      create: { pubkey, displayName, fcmToken },
    });

    const token = generateToken(pubkey);
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// GET /me — Get current user profile
router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { pubkey: req.userPubkey! },
      include: {
        squads: {
          include: { squad: true },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// GET /:pubkey — Get public profile
router.get('/:pubkey', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { pubkey: req.params.pubkey },
      select: { pubkey: true, displayName: true, avatar: true, createdAt: true },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
