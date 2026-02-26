import { Router } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();
router.use(authMiddleware);

const createSquadSchema = z.object({
  name: z.string().min(1).max(32),
  emoji: z.string().max(4).default('🏠'),
  members: z.array(z.string().min(32).max(44)).max(10),
  description: z.string().max(256).optional(),
});

// POST / — Create squad
router.post('/', validate(createSquadSchema), async (req: AuthRequest, res) => {
  try {
    const { name, emoji, members, description } = req.body;

    const squad = await prisma.squad.create({
      data: {
        name,
        emoji,
        description,
        onchainAddress: '', // Set after on-chain creation
        members: {
          create: [
            { userId: req.userPubkey!, role: 'OWNER' },
            ...members.map((pubkey: string) => ({
              userId: pubkey,
              role: 'MEMBER' as const,
            })),
          ],
        },
      },
      include: { members: true },
    });

    res.status(201).json(squad);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create squad' });
  }
});

// GET / — Get user's squads
router.get('/', async (req: AuthRequest, res) => {
  try {
    const memberships = await prisma.squadMembership.findMany({
      where: { userId: req.userPubkey! },
      include: {
        squad: {
          include: {
            members: true,
            transactions: { take: 5, orderBy: { createdAt: 'desc' } },
          },
        },
      },
    });

    res.json({ squads: memberships.map((m: { squad: any }) => m.squad) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch squads' });
  }
});

// GET /:id — Get squad details
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const squad = await prisma.squad.findUnique({
      where: { id: req.params.id as string },
      include: {
        members: true,
        transactions: { take: 20, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!squad) {
      res.status(404).json({ error: 'Squad not found' });
      return;
    }

    res.json(squad);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch squad' });
  }
});

// POST /:id/transactions — Log a transaction
const logTxSchema = z.object({
  type: z.enum(['SEND', 'RECEIVE', 'SPLIT', 'POOL', 'STREAM']),
  amount: z.number().positive(),
  currency: z.string().default('SOL'),
  txSignature: z.string(),
  memo: z.string().optional(),
});

router.post('/:id/transactions', validate(logTxSchema), async (req: AuthRequest, res) => {
  try {
    const tx = await prisma.transaction.create({
      data: {
        type: req.body.type,
        amount: req.body.amount,
        currency: req.body.currency,
        fromPubkey: req.userPubkey!,
        toPubkey: req.body.toPubkey || '',
        squadId: req.params.id as string,
        txSignature: req.body.txSignature,
        memo: req.body.memo,
        status: 'CONFIRMED',
      },
    });

    res.status(201).json(tx);
  } catch (error) {
    res.status(500).json({ error: 'Failed to log transaction' });
  }
});

// GET /:id/transactions — Get squad transactions
router.get('/:id/transactions', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { squadId: req.params.id as string },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

export default router;
