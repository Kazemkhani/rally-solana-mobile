import { Router } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();
router.use(authMiddleware);

// POST / — Log new stream creation
const createStreamSchema = z.object({
  onchainAddress: z.string(),
  recipientPubkey: z.string().min(32).max(44),
  amountPerSecond: z.number().positive(),
  startTime: z.number(),
  endTime: z.number(),
});

router.post('/', validate(createStreamSchema), async (req: AuthRequest, res) => {
  try {
    const stream = await prisma.paymentStream.create({
      data: {
        onchainAddress: req.body.onchainAddress,
        senderPubkey: req.userPubkey!,
        recipientPubkey: req.body.recipientPubkey,
        amountPerSecond: req.body.amountPerSecond,
        startTime: new Date(req.body.startTime * 1000),
        endTime: new Date(req.body.endTime * 1000),
        status: 'ACTIVE',
      },
    });

    res.status(201).json(stream);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create stream' });
  }
});

// GET / — Get user's streams
router.get('/', async (req: AuthRequest, res) => {
  try {
    const streams = await prisma.paymentStream.findMany({
      where: {
        OR: [
          { senderPubkey: req.userPubkey! },
          { recipientPubkey: req.userPubkey! },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ streams });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch streams' });
  }
});

// POST /:id/withdraw — Log stream withdrawal
router.post('/:id/withdraw', async (req: AuthRequest, res) => {
  try {
    const stream = await prisma.paymentStream.findUnique({
      where: { id: req.params.id },
    });

    if (!stream) {
      res.status(404).json({ error: 'Stream not found' });
      return;
    }

    res.json({ success: true, streamId: stream.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log withdrawal' });
  }
});

// POST /:id/cancel — Log stream cancellation
router.post('/:id/cancel', async (req: AuthRequest, res) => {
  try {
    const stream = await prisma.paymentStream.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
    });

    res.json(stream);
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel stream' });
  }
});

export default router;
