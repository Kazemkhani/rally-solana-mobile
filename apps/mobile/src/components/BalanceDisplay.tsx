import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../utils/constants';

interface Props {
  solBalance: number;
  usdcBalance: number;
}

export default function BalanceDisplay({ solBalance, usdcBalance }: Props) {
  const totalUsd = solBalance * 145 + usdcBalance;

  return (
    <View style={styles.card}>
      {/* Glass border accent */}
      <View style={styles.glowTop} />

      <Text style={styles.label}>Total Balance</Text>
      <Text style={styles.totalUsd}>
        ${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </Text>

      <View style={styles.tokenRow}>
        <View style={styles.tokenItem}>
          <View style={[styles.tokenDot, { backgroundColor: '#9945FF' }]} />
          <Text style={styles.tokenAmount}>{solBalance.toFixed(2)}</Text>
          <Text style={styles.tokenSymbol}>SOL</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.tokenItem}>
          <View style={[styles.tokenDot, { backgroundColor: '#2775CA' }]} />
          <Text style={styles.tokenAmount}>
            {usdcBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
          <Text style={styles.tokenSymbol}>USDC</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.xl,
    backgroundColor: COLORS.glass,
    borderRadius: RADIUS.lg,
    padding: SPACING.xxl,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    alignItems: 'center',
    overflow: 'hidden',
  },
  glowTop: {
    position: 'absolute',
    top: 0,
    left: '20%',
    right: '20%',
    height: 2,
    backgroundColor: COLORS.primary,
    opacity: 0.6,
    borderRadius: 1,
  },
  label: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  totalUsd: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -1,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
    gap: SPACING.lg,
  },
  tokenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  tokenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tokenAmount: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  tokenSymbol: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.borderLight,
  },
});
