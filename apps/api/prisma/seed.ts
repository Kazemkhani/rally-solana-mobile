import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Rally database...');

  // ─── Demo Users ──────────────────────────────────────────
  const users = await Promise.all([
    prisma.user.upsert({
      where: { pubkey: '7xKqR2mN5pWvLr8sYhX4J6zTbC9qE3nFp' },
      update: {},
      create: {
        pubkey: '7xKqR2mN5pWvLr8sYhX4J6zTbC9qE3nFp',
        displayName: 'Alex',
        avatar: '🚀',
      },
    }),
    prisma.user.upsert({
      where: { pubkey: '3mRkj2LqAbCdEfGhIjKlMnOpQrStUvWx' },
      update: {},
      create: {
        pubkey: '3mRkj2LqAbCdEfGhIjKlMnOpQrStUvWx',
        displayName: 'Maya',
        avatar: '🌸',
      },
    }),
    prisma.user.upsert({
      where: { pubkey: '9pQwm8RnAbCdEfGhIjKlMnOpQrStUvWx' },
      update: {},
      create: {
        pubkey: '9pQwm8RnAbCdEfGhIjKlMnOpQrStUvWx',
        displayName: 'Jordan',
        avatar: '⚡',
      },
    }),
    prisma.user.upsert({
      where: { pubkey: '5kLmx9WpAbCdEfGhIjKlMnOpQrStUvWx' },
      update: {},
      create: {
        pubkey: '5kLmx9WpAbCdEfGhIjKlMnOpQrStUvWx',
        displayName: 'Sam',
        avatar: '🎯',
      },
    }),
    prisma.user.upsert({
      where: { pubkey: '2nHjp4QsAbCdEfGhIjKlMnOpQrStUvWx' },
      update: {},
      create: {
        pubkey: '2nHjp4QsAbCdEfGhIjKlMnOpQrStUvWx',
        displayName: 'Riley',
        avatar: '🔥',
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  // ─── Demo Squads ─────────────────────────────────────────
  const squad1 = await prisma.squad.create({
    data: {
      name: 'Roommates',
      emoji: '🏠',
      description: 'Monthly rent and utilities',
      onchainAddress: `squad_${Date.now()}_1`,
      members: {
        create: [
          { userId: users[0].pubkey, role: 'OWNER' },
          { userId: users[1].pubkey, role: 'MEMBER' },
          { userId: users[2].pubkey, role: 'MEMBER' },
        ],
      },
    },
  });

  const squad2 = await prisma.squad.create({
    data: {
      name: 'Trip to Bali',
      emoji: '✈️',
      description: 'Saving for our group trip',
      onchainAddress: `squad_${Date.now()}_2`,
      members: {
        create: [
          { userId: users[0].pubkey, role: 'OWNER' },
          { userId: users[1].pubkey, role: 'MEMBER' },
          { userId: users[2].pubkey, role: 'MEMBER' },
          { userId: users[3].pubkey, role: 'MEMBER' },
          { userId: users[4].pubkey, role: 'MEMBER' },
        ],
      },
    },
  });

  const squad3 = await prisma.squad.create({
    data: {
      name: 'Weekend Crew',
      emoji: '🎉',
      description: 'Splitting weekend activities',
      onchainAddress: `squad_${Date.now()}_3`,
      members: {
        create: [
          { userId: users[0].pubkey, role: 'OWNER' },
          { userId: users[3].pubkey, role: 'MEMBER' },
          { userId: users[4].pubkey, role: 'MEMBER' },
        ],
      },
    },
  });

  console.log(`Created 3 squads: ${squad1.name}, ${squad2.name}, ${squad3.name}`);

  // ─── Demo Transactions ──────────────────────────────────
  const txs = await Promise.all([
    prisma.transaction.create({
      data: {
        type: 'SEND',
        amount: 2.5,
        currency: 'SOL',
        fromPubkey: users[0].pubkey,
        toPubkey: users[1].pubkey,
        txSignature: `tx_${Date.now()}_1`,
        memo: 'Movie tickets 🎬',
        status: 'CONFIRMED',
      },
    }),
    prisma.transaction.create({
      data: {
        type: 'RECEIVE',
        amount: 25.00,
        currency: 'USDC',
        fromPubkey: users[1].pubkey,
        toPubkey: users[0].pubkey,
        txSignature: `tx_${Date.now()}_2`,
        memo: 'Dinner split 🍕',
        status: 'CONFIRMED',
      },
    }),
    prisma.transaction.create({
      data: {
        type: 'POOL',
        amount: 5.0,
        currency: 'SOL',
        fromPubkey: users[0].pubkey,
        toPubkey: squad2.onchainAddress,
        squadId: squad2.id,
        txSignature: `tx_${Date.now()}_3`,
        memo: 'Trip contribution',
        status: 'CONFIRMED',
      },
    }),
    prisma.transaction.create({
      data: {
        type: 'SPLIT',
        amount: 48.50,
        currency: 'USDC',
        fromPubkey: squad3.onchainAddress,
        toPubkey: users[0].pubkey,
        squadId: squad3.id,
        txSignature: `tx_${Date.now()}_4`,
        memo: 'Groceries',
        status: 'CONFIRMED',
      },
    }),
  ]);

  console.log(`Created ${txs.length} transactions`);

  // ─── Demo Expense Split ──────────────────────────────────
  const split = await prisma.expenseSplit.create({
    data: {
      description: 'Friday dinner at Italian place',
      totalAmount: 88.75,
      currency: 'USDC',
      creatorId: users[0].pubkey,
      squadId: squad3.id,
      status: 'PENDING',
      items: {
        create: [
          { userPubkey: users[0].pubkey, amount: 29.58 },
          { userPubkey: users[3].pubkey, amount: 29.58 },
          { userPubkey: users[4].pubkey, amount: 29.59 },
        ],
      },
    },
  });

  console.log(`Created expense split: ${split.description}`);

  // ─── Demo Payment Streams ───────────────────────────────
  const now = new Date();
  const oneMonthLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  const streams = await Promise.all([
    prisma.paymentStream.create({
      data: {
        onchainAddress: `stream_${Date.now()}_1`,
        senderPubkey: users[2].pubkey,
        recipientPubkey: users[0].pubkey,
        amountPerSecond: 0.000004,
        startTime: twoDaysAgo,
        endTime: oneMonthLater,
        status: 'ACTIVE',
      },
    }),
    prisma.paymentStream.create({
      data: {
        onchainAddress: `stream_${Date.now()}_2`,
        senderPubkey: users[0].pubkey,
        recipientPubkey: users[1].pubkey,
        amountPerSecond: 0.000002,
        startTime: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        endTime: oneMonthLater,
        status: 'ACTIVE',
      },
    }),
  ]);

  console.log(`Created ${streams.length} payment streams`);

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
