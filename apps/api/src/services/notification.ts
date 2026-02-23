import prisma from '../config/database';

// Firebase Admin SDK would be initialized here in production
// import * as admin from 'firebase-admin';

interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export async function sendPushNotification(
  userPubkey: string,
  payload: NotificationPayload
): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { pubkey: userPubkey },
      select: { fcmToken: true },
    });

    if (!user?.fcmToken) return;

    // In production: use Firebase Admin SDK
    // await admin.messaging().send({
    //   token: user.fcmToken,
    //   notification: { title: payload.title, body: payload.body },
    //   data: payload.data,
    // });

    console.log(`[PUSH] → ${userPubkey}: ${payload.title} - ${payload.body}`);
  } catch (error) {
    console.error('Failed to send push notification:', error);
  }
}

export async function notifySquadMembers(
  squadId: string,
  payload: NotificationPayload,
  excludePubkey?: string
): Promise<void> {
  const members = await prisma.squadMembership.findMany({
    where: { squadId },
    select: { userId: true },
  });

  for (const member of members) {
    if (member.userId !== excludePubkey) {
      await sendPushNotification(member.userId, payload);
    }
  }
}

export async function notifyPaymentReceived(
  recipientPubkey: string,
  amount: number,
  currency: string,
  senderName: string
): Promise<void> {
  await sendPushNotification(recipientPubkey, {
    title: 'Payment Received',
    body: `${senderName} sent you ${amount} ${currency}`,
    data: { type: 'payment_received', amount: amount.toString() },
  });
}

export async function notifyVoteRequired(
  squadId: string,
  proposalTitle: string,
  proposerPubkey: string
): Promise<void> {
  await notifySquadMembers(
    squadId,
    {
      title: 'Vote Required',
      body: `New proposal: "${proposalTitle}" — Cast your vote!`,
      data: { type: 'vote_required', squadId },
    },
    proposerPubkey
  );
}

export async function notifySplitCreated(
  splitMembers: string[],
  description: string,
  creatorName: string
): Promise<void> {
  for (const memberPubkey of splitMembers) {
    await sendPushNotification(memberPubkey, {
      title: 'New Split',
      body: `${creatorName} wants to split "${description}" with you`,
      data: { type: 'split_created' },
    });
  }
}
