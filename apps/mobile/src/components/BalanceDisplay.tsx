import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../utils/constants';

interface Props {
  solBalance: number;
  usdcBalance: number;
}

export default function BalanceDisplay({ solBalance, usdcBalance }: Props) {
  const totalUsd = solBalance * 145 + usdcBalance;

  return (
    <View style={styles.container}>
      {/* ─── Glowing Orbs Background ─── */}
      <View style={styles.glowContainer}>
        <LinearGradient
          colors={['rgba(139, 92, 246, 0.4)', 'transparent']}
          style={styles.orbTopLeft}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <LinearGradient
          colors={['transparent', 'rgba(59, 130, 246, 0.3)']}
          style={styles.orbBottomRight}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Total Balance</Text>
        <Text style={styles.totalUsd}>
          ${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
        {/* Mock profit indicator to match spec */}
        <View style={styles.profitBadge}>
          <Text style={styles.profitText}>+2.4% today</Text>
        </View>

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
          <View style={styles.divider} />
          <View style={styles.tokenItem}>
            <View style={[styles.tokenDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.tokenAmount}>7.50</Text>
            <Text style={styles.tokenSymbol}>SKR</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.sm,
    position: 'relative',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
  },
  orbTopLeft: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  orbBottomRight: {
    position: 'absolute',
    bottom: -60,
    right: -20,
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  card: {
    backgroundColor: 'rgba(20, 20, 43, 0.65)',
    borderRadius: RADIUS.lg,
    padding: SPACING.xxl,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    // Minimal shadow for web glass effect, blur not directly supported in vanilla React Native without BlurView
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
  profitBadge: {
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    marginTop: SPACING.xs,
  },
  profitText: {
    color: COLORS.success,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xl,
    gap: SPACING.lg,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  tokenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tokenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tokenAmount: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  tokenSymbol: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: COLORS.borderLight,
  },
});
