import { Router } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();
router.use(authMiddleware);

// POST /send — Log a P2P payment
const sendSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('SOL'),
  toPubkey: z.string().min(32).max(44),
  txSignature: z.string(),
  memo: z.string().optional(),
});

router.post('/send', validate(sendSchema), async (req: AuthRequest, res) => {
  try {
    const tx = await prisma.transaction.create({
      data: {
        type: 'SEND',
        amount: req.body.amount,
        currency: req.body.currency,
        fromPubkey: req.userPubkey!,
        toPubkey: req.body.toPubkey,
        txSignature: req.body.txSignature,
        memo: req.body.memo,
        status: 'CONFIRMED',
      },
    });

    res.status(201).json(tx);
  } catch (error) {
    res.status(500).json({ error: 'Failed to log payment' });
  }
});

// POST /split — Create an expense split
const splitSchema = z.object({
  description: z.string().min(1).max(256),
  totalAmount: z.number().positive(),
  currency: z.string().default('SOL'),
  squadId: z.string().optional(),
  splits: z.array(
    z.object({
      userPubkey: z.string().min(32).max(44),
      amount: z.number().positive(),
    })
  ),
});

router.post('/split', validate(splitSchema), async (req: AuthRequest, res) => {
  try {
    const { description, totalAmount, currency, squadId, splits } = req.body;

    const expenseSplit = await prisma.expenseSplit.create({
      data: {
        description,
        totalAmount,
        currency,
        creatorId: req.userPubkey!,
        squadId,
        status: 'PENDING',
        items: {
          create: splits.map((s: { userPubkey: string; amount: number }) => ({
            userPubkey: s.userPubkey,
            amount: s.amount,
            settled: false,
          })),
        },
      },
      include: { items: true },
    });

    res.status(201).json(expenseSplit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create split' });
  }
});

// GET /splits — Get pending splits for user
router.get('/splits', async (req: AuthRequest, res) => {
  try {
    const splits = await prisma.expenseSplit.findMany({
      where: {
        OR: [
          { creatorId: req.userPubkey! },
          { items: { some: { userPubkey: req.userPubkey! } } },
        ],
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ splits });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch splits' });
  }
});

// POST /splits/:id/settle — Settle a split item
const settleSchema = z.object({
  txSignature: z.string(),
});

router.post('/splits/:id/settle', validate(settleSchema), async (req: AuthRequest, res) => {
  try {
    const splitItem = await prisma.splitItem.updateMany({
      where: {
        splitId: req.params.id as string,
        userPubkey: req.userPubkey!,
      },
      data: {
        settled: true,
        txSignature: req.body.txSignature,
      },
    });

    // Check if all items are settled
    const remaining = await prisma.splitItem.count({
      where: { splitId: req.params.id as string, settled: false },
    });

    if (remaining === 0) {
      await prisma.expenseSplit.update({
        where: { id: req.params.id as string },
        data: { status: 'SETTLED' },
      });
    }

    res.json({ settled: true, remainingUnsettled: remaining });
  } catch (error) {
    res.status(500).json({ error: 'Failed to settle split' });
  }
});

export default router;
