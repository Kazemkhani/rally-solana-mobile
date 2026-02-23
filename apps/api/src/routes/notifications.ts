import { Router } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();
router.use(authMiddleware);

// POST /register — Register FCM token
const registerSchema = z.object({
  token: z.string().min(1),
});

router.post('/register', validate(registerSchema), async (req: AuthRequest, res) => {
  try {
    await prisma.user.update({
      where: { pubkey: req.userPubkey! },
      data: { fcmToken: req.body.token },
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register token' });
  }
});

// GET /preferences — Get notification preferences
router.get('/preferences', async (req: AuthRequest, res) => {
  try {
    let prefs = await prisma.notificationPreference.findUnique({
      where: { userId: req.userPubkey! },
    });

    if (!prefs) {
      prefs = await prisma.notificationPreference.create({
        data: {
          userId: req.userPubkey!,
          payments: true,
          votes: true,
          streams: true,
          splits: true,
        },
      });
    }

    res.json(prefs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

// PUT /preferences — Update notification preferences
const prefsSchema = z.object({
  payments: z.boolean().optional(),
  votes: z.boolean().optional(),
  streams: z.boolean().optional(),
  splits: z.boolean().optional(),
});

router.put('/preferences', validate(prefsSchema), async (req: AuthRequest, res) => {
  try {
    const prefs = await prisma.notificationPreference.upsert({
      where: { userId: req.userPubkey! },
      update: req.body,
      create: {
        userId: req.userPubkey!,
        payments: req.body.payments ?? true,
        votes: req.body.votes ?? true,
        streams: req.body.streams ?? true,
        splits: req.body.splits ?? true,
      },
    });

    res.json(prefs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

export default router;
