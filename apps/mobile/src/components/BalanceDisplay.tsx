import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../utils/constants';

interface Props {
  balance: number;
  onRefresh?: () => void;
}

export default function BalanceDisplay({ balance, onRefresh }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Total Balance</Text>
      <View style={styles.amountRow}>
        <Text style={styles.amount}>{balance.toFixed(4)}</Text>
        <Text style={styles.currency}> SOL</Text>
        {onRefresh && (
          <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
            <Text style={styles.refreshIcon}>↻</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.usdEquivalent}>
        ≈ ${(balance * 145).toFixed(2)} USD
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  amount: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.text,
  },
  currency: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  refreshBtn: {
    marginLeft: 8,
    padding: 4,
  },
  refreshIcon: {
    fontSize: 18,
    color: COLORS.textMuted,
  },
  usdEquivalent: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
