import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withDelay,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../utils/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  solBalance: number;
  usdcBalance: number;
}

export default function BalanceDisplay({ solBalance, usdcBalance }: Props) {
  const totalUsd = solBalance * 145 + usdcBalance;
  const shimmer = useSharedValue(-300);

  useEffect(() => {
    shimmer.value = withDelay(
      1500,
      withRepeat(
        withSequence(
          withTiming(SCREEN_WIDTH + 300, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withDelay(5000, withTiming(-300, { duration: 0 })),
        ),
        -1,
        false,
      ),
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmer.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Glowing Orbs */}
      <LinearGradient
        colors={['rgba(139, 92, 246, 0.3)', 'transparent']}
        style={styles.orbTopLeft}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <LinearGradient
        colors={['transparent', 'rgba(59, 130, 246, 0.2)']}
        style={styles.orbBottomRight}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Glassmorphism Card — using LinearGradient overlay instead of BlurView */}
      <View style={styles.card}>
        {/* Glass overlay */}
        <LinearGradient
          colors={['rgba(30, 30, 60, 0.85)', 'rgba(15, 15, 35, 0.9)']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        {/* Top accent glow */}
        <LinearGradient
          colors={['transparent', 'rgba(139, 92, 246, 0.5)', 'rgba(59, 130, 246, 0.3)', 'transparent']}
          style={styles.topAccent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />

        {/* Inner glow highlight */}
        <LinearGradient
          colors={['rgba(139, 92, 246, 0.08)', 'transparent']}
          style={styles.innerGlow}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        <Text style={styles.label}>TOTAL BALANCE</Text>
        <Text style={styles.totalUsd}>
          ${totalUsd.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>

        <View style={styles.profitBadge}>
          <Text style={styles.profitText}>↑ 2.4% today</Text>
        </View>

        <View style={styles.tokenRow}>
          <View style={styles.tokenItem}>
            <LinearGradient
              colors={['#9945FF', '#7B3FE4']}
              style={styles.tokenDot}
            />
            <Text style={styles.tokenAmount}>{solBalance.toFixed(2)}</Text>
            <Text style={styles.tokenSymbol}>SOL</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.tokenItem}>
            <LinearGradient
              colors={['#2775CA', '#1A5FA0']}
              style={styles.tokenDot}
            />
            <Text style={styles.tokenAmount}>
              {usdcBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
            <Text style={styles.tokenSymbol}>USDC</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.tokenItem}>
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              style={styles.tokenDot}
            />
            <Text style={styles.tokenAmount}>7.50</Text>
            <Text style={styles.tokenSymbol}>SKR</Text>
          </View>
        </View>

        {/* Shimmer sweep */}
        <Animated.View style={[styles.shimmer, shimmerStyle]}>
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.06)', 'transparent']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.sm,
    position: 'relative',
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  orbTopLeft: {
    position: 'absolute', top: -50, left: -50,
    width: 200, height: 200, borderRadius: 100,
  },
  orbBottomRight: {
    position: 'absolute', bottom: -60, right: -20,
    width: 250, height: 250, borderRadius: 125,
  },
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    paddingTop: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.12)',
    alignItems: 'center',
    overflow: 'hidden',
  },
  topAccent: {
    position: 'absolute', top: 0,
    left: '10%', right: '10%', height: 1.5,
  },
  innerGlow: {
    position: 'absolute', top: 0, left: 0,
    width: '60%', height: '60%', borderRadius: RADIUS.xl,
  },
  label: {
    fontSize: 10, fontWeight: '600', color: '#6B7280',
    letterSpacing: 3, marginBottom: SPACING.sm,
  },
  totalUsd: {
    fontSize: 48, fontWeight: '800', color: COLORS.text,
    letterSpacing: -2, fontVariant: ['tabular-nums'],
  },
  profitBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: SPACING.md, paddingVertical: 4,
    borderRadius: RADIUS.full, marginTop: SPACING.sm,
    borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.15)',
  },
  profitText: {
    color: COLORS.success, fontSize: 12, fontWeight: '600',
  },
  tokenRow: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: SPACING.xl, gap: SPACING.lg,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: SPACING.lg, paddingVertical: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)',
  },
  tokenItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tokenDot: { width: 8, height: 8, borderRadius: 4 },
  tokenAmount: {
    fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text,
    fontVariant: ['tabular-nums'],
  },
  tokenSymbol: { fontSize: FONT_SIZES.xs, color: '#6B7280', fontWeight: '600' },
  divider: { width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.06)' },
  shimmer: {
    position: 'absolute', top: 0, bottom: 0, width: 120,
    transform: [{ skewX: '-15deg' }],
  },
});
