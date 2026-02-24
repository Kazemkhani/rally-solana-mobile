import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import ScreenWrapper from '../components/ScreenWrapper';
import AnimatedPressable from '../components/AnimatedPressable';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../utils/constants';
import { useStreamStore } from '../stores/streams';

export default function StreamScreen() {
  const { streams } = useStreamStore();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 100);
    return () => clearInterval(id);
  }, []);

  const now = Math.floor(Date.now() / 1000);
  const incoming = streams.filter((s) => s.recipient === 'me' && s.isActive);
  const outgoing = streams.filter((s) => s.sender === 'me' && s.isActive);

  const netRate = incoming.reduce((a, s) => a + s.amountPerSecond, 0)
    - outgoing.reduce((a, s) => a + s.amountPerSecond, 0);
  const netRatePerHour = netRate * 3600;

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container} edges={['top']}>
        <Animated.View entering={FadeInDown.delay(0).duration(400)} style={styles.header}>
          <Text style={styles.title}>Streams</Text>
          <Text style={styles.subtitle}>Real-time continuous payments</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(100).duration(400).springify()}
          style={styles.statsRow}
        >
          <View style={styles.statPill}>
            <Text style={[styles.statValue, { color: COLORS.success }]}>{incoming.length}</Text>
            <Text style={styles.statLabel}>Incoming</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={[styles.statValue, { color: COLORS.warning }]}>{outgoing.length}</Text>
            <Text style={styles.statLabel}>Outgoing</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={[styles.statValue, {
              color: netRate >= 0 ? COLORS.success : COLORS.danger,
            }]}>
              {netRate >= 0 ? '+' : ''}{netRatePerHour.toFixed(3)}
            </Text>
            <Text style={styles.statLabel}>SOL/hr</Text>
          </View>
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {incoming.length > 0 && (
            <>
              <Animated.View entering={FadeInDown.delay(200).duration(300)} style={styles.sectionHeader}>
                <View style={[styles.sectionDot, { backgroundColor: COLORS.success }]} />
                <Text style={styles.sectionTitle}>Incoming</Text>
              </Animated.View>
              {incoming.map((s, i) => (
                <StreamCard key={s.id} stream={s} type="incoming" now={now} index={i} />
              ))}
            </>
          )}
          {outgoing.length > 0 && (
            <>
              <Animated.View entering={FadeInDown.delay(300).duration(300)} style={styles.sectionHeader}>
                <View style={[styles.sectionDot, { backgroundColor: COLORS.warning }]} />
                <Text style={styles.sectionTitle}>Outgoing</Text>
              </Animated.View>
              {outgoing.map((s, i) => (
                <StreamCard key={s.id} stream={s} type="outgoing" now={now} index={incoming.length + i} />
              ))}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

function StreamCard({ stream, type, now, index }: { stream: any; type: 'incoming' | 'outgoing'; now: number; index: number }) {
  const elapsed = Math.max(0, now - stream.startTime);
  const total = stream.endTime - stream.startTime;
  const progress = Math.min(1, elapsed / total);
  const streamed = stream.amountPerSecond * elapsed;
  const daysLeft = Math.max(0, Math.ceil((stream.endTime - now) / 86400));

  const name = type === 'incoming' ? stream.senderName : stream.recipientName;
  const initial = name.charAt(0);
  const isIn = type === 'incoming';
  const accentColor = isIn ? COLORS.success : COLORS.warning;
  const actionLabel = isIn ? 'Withdraw' : 'Cancel';
  const actionColor = isIn ? COLORS.success : COLORS.danger;

  // Pulsing dot with reanimated
  const pulse = useSharedValue(0.4);
  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
    transform: [{ scale: 0.8 + pulse.value * 0.4 }],
  }));

  // Split counter — last 3 digits get glow
  const counterStr = streamed.toFixed(6);
  const mainPart = counterStr.slice(0, -3);
  const glowPart = counterStr.slice(-3);
  const glowColor = isIn ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.4)';

  return (
    <Animated.View entering={FadeInDown.delay(250 + index * 80).duration(400).springify()}>
      <AnimatedPressable style={[styles.streamCard, { borderColor: isIn ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)' }]}>
        {/* Glass background */}
        <LinearGradient
          colors={['rgba(25, 25, 50, 0.9)', 'rgba(15, 15, 35, 0.95)']}
          style={StyleSheet.absoluteFill}
        />
        {/* Top accent glow */}
        <LinearGradient
          colors={['transparent', isIn ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.4)', 'transparent']}
          style={styles.topGlowLine}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        {/* Pulsing dot */}
        <Animated.View style={[styles.pulseDot, { backgroundColor: accentColor }, dotStyle]} />

        {/* Top row */}
        <View style={styles.streamTop}>
          <LinearGradient
            colors={isIn ? [COLORS.success, '#38f9d7'] : [COLORS.warning, '#ff8c00']}
            style={styles.streamAvatar}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.streamAvatarText}>{initial}</Text>
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.streamName}>{name}</Text>
            <Text style={styles.streamDir}>{isIn ? '↓ Receiving from' : '↑ Sending to'}</Text>
          </View>
        </View>

        {/* Counter with glow on last digits */}
        <View style={styles.counterRow}>
          <Text style={styles.counterMain}>{mainPart}</Text>
          <Text style={[styles.counterGlow, {
            textShadowColor: glowColor,
            textShadowRadius: 8,
          }]}>{glowPart}</Text>
          <Text style={styles.counterLabel}> SOL</Text>
        </View>

        <Text style={styles.rateText}>{stream.rateLabel}</Text>

        {/* Progress bar with glow */}
        <View style={styles.progressBg}>
          <LinearGradient
            colors={isIn ? ['#10B981', '#14F195'] : ['#F59E0B', '#ff8c00']}
            style={[styles.progressFill, {
              width: `${progress * 100}%`,
              shadowColor: accentColor,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 6,
            }]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          />
        </View>

        <View style={styles.progressMeta}>
          <Text style={styles.progressText}>{(progress * 100).toFixed(1)}%</Text>
          <Text style={styles.progressText}>{daysLeft}d left</Text>
        </View>

        <View style={styles.streamBottom}>
          <Text style={styles.streamTotal}>of {stream.totalDeposited.toFixed(2)} SOL</Text>
          <AnimatedPressable
            scaleDepth={0.93}
            style={[styles.actionPill, { borderColor: actionColor + '50' }]}
          >
            <Text style={[styles.actionPillText, { color: actionColor }]}>{actionLabel}</Text>
          </AnimatedPressable>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  title: { fontSize: FONT_SIZES.title, fontWeight: '800', color: COLORS.text, letterSpacing: -0.5 },
  subtitle: { fontSize: FONT_SIZES.md, color: '#4B5563', marginTop: 2 },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statPill: {
    flex: 1, paddingVertical: SPACING.md, borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.02)', alignItems: 'center',
  },
  statValue: { fontSize: FONT_SIZES.xl, fontWeight: '800', fontVariant: ['tabular-nums'] },
  statLabel: { fontSize: 10, color: '#4B5563', marginTop: 2, fontWeight: '500', letterSpacing: 0.5 },
  scrollContent: { paddingHorizontal: SPACING.xl, paddingBottom: Platform.OS === 'ios' ? 120 : 100 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.lg, marginBottom: SPACING.md },
  sectionDot: { width: 6, height: 6, borderRadius: 3 },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.text },
  // Stream Card
  streamCard: {
    padding: SPACING.xl, borderRadius: RADIUS.xl,
    backgroundColor: 'transparent',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 14, position: 'relative', overflow: 'hidden',
  },
  topGlowLine: {
    position: 'absolute', top: 0, left: '15%', right: '15%', height: 1.5,
  },
  pulseDot: {
    position: 'absolute', top: SPACING.xl, right: SPACING.xl,
    width: 8, height: 8, borderRadius: 4,
  },
  streamTop: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.lg },
  streamAvatar: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
  },
  streamAvatarText: {
    fontSize: 13, fontWeight: '700', color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  streamName: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.text },
  streamDir: { fontSize: 11, color: '#4B5563' },
  counterRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 },
  counterMain: { fontSize: 34, fontWeight: '800', color: COLORS.text, fontVariant: ['tabular-nums'] },
  counterGlow: {
    fontSize: 34, fontWeight: '800', color: COLORS.text, fontVariant: ['tabular-nums'],
    textShadowOffset: { width: 0, height: 0 },
  },
  counterLabel: { fontSize: FONT_SIZES.lg, fontWeight: '500', color: '#6B7280', marginLeft: 4 },
  rateText: { fontSize: 12, color: '#4B5563', marginBottom: SPACING.lg },
  progressBg: {
    height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginBottom: SPACING.sm, overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2 },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.lg },
  progressText: { fontSize: 11, color: '#4B5563', fontVariant: ['tabular-nums'] },
  streamBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  streamTotal: { fontSize: FONT_SIZES.sm, color: '#6B7280', fontVariant: ['tabular-nums'] },
  actionPill: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: RADIUS.full, borderWidth: 1 },
  actionPillText: { fontSize: 12, fontWeight: '600' },
});
