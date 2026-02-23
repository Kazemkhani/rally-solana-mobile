import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../utils/constants';
import type { Transaction } from '../types';

const TYPE_CONFIG: Record<Transaction['type'], { label: string; color: string }> = {
  send: { label: 'Sent', color: COLORS.error },
  receive: { label: 'Received', color: COLORS.success },
  split: { label: 'Split', color: COLORS.splitGreen },
  pool: { label: 'Pooled', color: COLORS.primary },
  stream: { label: 'Stream', color: COLORS.streamBlue },
};

function formatTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface Props {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: Props) {
  const config = TYPE_CONFIG[transaction.type];
  const isPositive = transaction.type === 'receive' || transaction.type === 'stream';
  const avatar = isPositive ? transaction.fromAvatar : transaction.toAvatar;
  const name = isPositive ? transaction.fromName : transaction.toName;
  const avatarColor = isPositive ? COLORS.success : COLORS.primary;

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={[styles.avatarCircle, { backgroundColor: avatarColor + '15' }]}>
        <Text style={styles.avatarEmoji}>{avatar}</Text>
      </View>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <View style={[styles.typeBadge, { backgroundColor: config.color + '15' }]}>
            <Text style={[styles.typeText, { color: config.color }]}>{config.label}</Text>
          </View>
        </View>
        <Text style={styles.memo} numberOfLines={1}>
          {transaction.memo || config.label}
        </Text>
      </View>

      {/* Amount + Time */}
      <View style={styles.amountContainer}>
        <Text style={[styles.amount, isPositive ? styles.positive : styles.negative]}>
          {isPositive ? '+' : '-'}
          {transaction.currency === 'USDC' ? '$' : ''}
          {transaction.amount.toFixed(2)}
          {transaction.currency !== 'USDC' ? ` ${transaction.currency}` : ''}
        </Text>
        <Text style={styles.time}>{formatTime(transaction.timestamp)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarEmoji: {
    fontSize: 20,
  },
  details: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  name: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    flexShrink: 1,
  },
  typeBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  typeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  memo: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
    marginLeft: SPACING.sm,
  },
  amount: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  positive: {
    color: COLORS.success,
  },
  negative: {
    color: COLORS.text,
  },
  time: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
