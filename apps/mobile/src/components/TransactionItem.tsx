import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';
import type { Transaction } from '../types';

const TYPE_CONFIG: Record<Transaction['type'], { icon: string; label: string }> = {
  send: { icon: '↑', label: 'Sent' },
  receive: { icon: '↓', label: 'Received' },
  split: { icon: '✂', label: 'Split' },
  pool: { icon: '🏦', label: 'Pooled' },
  stream: { icon: '🔄', label: 'Streamed' },
};

function formatTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
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

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{config.icon}</Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.label}>
          {config.label} {transaction.memo ? `· ${transaction.memo}` : ''}
        </Text>
        <Text style={styles.peer}>
          {isPositive ? `From ${transaction.from}` : `To ${transaction.to}`}
        </Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={[styles.amount, isPositive ? styles.positive : styles.neutral]}>
          {isPositive ? '+' : '-'}{transaction.amount.toFixed(4)}
        </Text>
        <Text style={styles.currency}>{transaction.currency}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 18,
  },
  details: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  peer: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  positive: {
    color: COLORS.success,
  },
  neutral: {
    color: COLORS.text,
  },
  currency: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
});
