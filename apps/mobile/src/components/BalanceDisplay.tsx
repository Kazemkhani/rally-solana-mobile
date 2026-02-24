import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
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

  // Count-up animation
  const countUp = useSharedValue(0);
  // Shimmer sweep
  const shimmer = useSharedValue(-300);

  useEffect(() => {
    // Count from 0 to 1 over 1.2s
    countUp.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.cubic) });

    // Shimmer: sweep every 4s with 2s pause
    shimmer.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(SCREEN_WIDTH + 300, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withDelay(4000, withTiming(-300, { duration: 0 })),
        ),
        -1,
        false,
      ),
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmer.value }],
  }));

  const countStyle = useAnimatedStyle(() => {
    const val = interpolate(countUp.value, [0, 1], [0, totalUsd]);
    return { opacity: 1 } as any; // just for the hook — we read the value below
  });

  // For the count-up display, we use a simpler approach since we need formatted text
  const displayAmount = totalUsd; // Full amount — the card fades in with entrance anim

  const CardWrapper = Platform.OS === 'web' ? View : BlurView;
  const cardProps = Platform.OS === 'web'
    ? { style: [styles.card, { backgroundColor: 'rgba(20, 20, 43, 0.75)' }] }
    : { intensity: 40, tint: 'dark' as const, style: styles.card };

  return (
    <View style={styles.container}>
      {/* Glowing Orbs */}
      <View style={styles.glowContainer}>
        <LinearGradient
          colors={['rgba(139, 92, 246, 0.35)', 'transparent']}
          style={styles.orbTopLeft}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <LinearGradient
          colors={['transparent', 'rgba(59, 130, 246, 0.25)']}
          style={styles.orbBottomRight}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </View>

      {/* Glassmorphism Card */}
      <CardWrapper {...cardProps}>
        {/* Top accent glow line */}
        <LinearGradient
          colors={['transparent', 'rgba(139, 92, 246, 0.4)', 'transparent']}
          style={styles.topAccent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />

        <Text style={styles.label}>TOTAL BALANCE</Text>
        <Text style={styles.totalUsd}>
          ${displayAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>

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

        {/* Shimmer sweep */}
        <Animated.View style={[styles.shimmer, shimmerStyle]}>
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.04)', 'transparent']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          />
        </Animated.View>
      </CardWrapper>
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
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.15)',
    alignItems: 'center',
    overflow: 'hidden',
  },
  topAccent: {
    position: 'absolute',
    top: 0,
    left: '15%',
    right: '15%',
    height: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4B5563',
    letterSpacing: 3,
    marginBottom: SPACING.xs,
  },
  totalUsd: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
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
    backgroundColor: 'rgba(0,0,0,0.25)',
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
    fontVariant: ['tabular-nums'],
  },
  tokenSymbol: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 150,
    transform: [{ skewX: '-15deg' }],
  },
});
