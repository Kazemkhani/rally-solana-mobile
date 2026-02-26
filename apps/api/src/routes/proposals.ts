import { Router } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();
router.use(authMiddleware);

// POST / — Create a spending proposal
const createProposalSchema = z.object({
  squadId: z.string(),
  title: z.string().min(1).max(128),
  description: z.string().min(1).max(512),
  amount: z.number().positive(),
  recipientPubkey: z.string().min(32).max(44),
  deadline: z.string(), // ISO date string
});

router.post('/', validate(createProposalSchema), async (req: AuthRequest, res) => {
  try {
    const { squadId, title, description, amount, recipientPubkey, deadline } = req.body;

    // Verify user is a member of the squad
    const membership = await prisma.squadMembership.findUnique({
      where: { userId_squadId: { userId: req.userPubkey!, squadId } },
    });

    if (!membership) {
      res.status(403).json({ error: 'Not a member of this squad' });
      return;
    }

    const proposal = await prisma.proposal.create({
      data: {
        squadId,
        title,
        description,
        amount,
        recipientPubkey,
        deadline: new Date(deadline),
        status: 'ACTIVE',
      },
    });

    res.status(201).json(proposal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create proposal' });
  }
});

// GET / — List proposals for user's squads
router.get('/', async (req: AuthRequest, res) => {
  try {
    const memberships = await prisma.squadMembership.findMany({
      where: { userId: req.userPubkey! },
      select: { squadId: true },
    });

    const squadIds = memberships.map((m: { squadId: string }) => m.squadId);

    const proposals = await prisma.proposal.findMany({
      where: { squadId: { in: squadIds } },
      orderBy: { createdAt: 'desc' },
      include: { squad: { select: { name: true, emoji: true } } },
    });

    res.json({ proposals });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

// GET /:id — Get proposal details
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: req.params.id as string },
      include: { squad: { select: { name: true, emoji: true, members: true } } },
    });

    if (!proposal) {
      res.status(404).json({ error: 'Proposal not found' });
      return;
    }

    res.json(proposal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch proposal' });
  }
});

// POST /:id/vote — Cast a vote (tracked via onchain program, logged here)
const voteSchema = z.object({
  vote: z.enum(['yes', 'no']),
});

router.post('/:id/vote', validate(voteSchema), async (req: AuthRequest, res) => {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: req.params.id as string },
    });

    if (!proposal) {
      res.status(404).json({ error: 'Proposal not found' });
      return;
    }

    if (proposal.status !== 'ACTIVE') {
      res.status(400).json({ error: 'Proposal is no longer active' });
      return;
    }

    if (new Date() > proposal.deadline) {
      res.status(400).json({ error: 'Proposal deadline has passed' });
      return;
    }

    // Vote is recorded on-chain via rally-vote program.
    // This endpoint logs the intent for the API layer.
    res.json({ success: true, vote: req.body.vote, proposalId: req.params.id as string });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cast vote' });
  }
});

// POST /:id/execute — Execute a passed proposal
router.post('/:id/execute', async (req: AuthRequest, res) => {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: req.params.id as string },
    });

    if (!proposal) {
      res.status(404).json({ error: 'Proposal not found' });
      return;
    }

    if (proposal.status !== 'ACTIVE') {
      res.status(400).json({ error: 'Proposal is not active' });
      return;
    }

    // Mark as executed (actual execution happens on-chain via rally-vote program)
    const updated = await prisma.proposal.update({
      where: { id: req.params.id as string },
      data: { status: 'EXECUTED' },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to execute proposal' });
  }
});

export default router;
