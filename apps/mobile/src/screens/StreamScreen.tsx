import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Streams</Text>
        <Text style={styles.subtitle}>Real-time continuous payments</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statPill}>
          <Text style={[styles.statValue, { color: COLORS.success }]}>{incoming.length}</Text>
          <Text style={styles.statLabel}>Incoming</Text>
        </View>
        <View style={styles.statPill}>
          <Text style={[styles.statValue, { color: COLORS.warning }]}>{outgoing.length}</Text>
          <Text style={styles.statLabel}>Outgoing</Text>
        </View>
        <View style={styles.statPill}>
          <Text style={[styles.statValue, { color: netRate >= 0 ? COLORS.success : COLORS.danger }]}>
            {netRate >= 0 ? '+' : ''}{netRatePerHour.toFixed(3)}
          </Text>
          <Text style={styles.statLabel}>SOL/hr</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Incoming */}
        {incoming.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: COLORS.success }]} />
              <Text style={styles.sectionTitle}>Incoming</Text>
            </View>
            {incoming.map((s) => (
              <StreamCardView key={s.id} stream={s} type="incoming" now={now} />
            ))}
          </>
        )}

        {/* Outgoing */}
        {outgoing.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: COLORS.warning }]} />
              <Text style={styles.sectionTitle}>Outgoing</Text>
            </View>
            {outgoing.map((s) => (
              <StreamCardView key={s.id} stream={s} type="outgoing" now={now} />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StreamCardView({ stream, type, now }: { stream: any; type: 'incoming' | 'outgoing'; now: number }) {
  const elapsed = Math.max(0, now - stream.startTime);
  const total = stream.endTime - stream.startTime;
  const progress = Math.min(1, elapsed / total);
  const streamed = stream.amountPerSecond * elapsed;
  const daysLeft = Math.max(0, Math.ceil((stream.endTime - now) / 86400));
  const percentStr = (progress * 100).toFixed(1);

  const name = type === 'incoming' ? stream.senderName : stream.recipientName;
  const initial = name.charAt(0);
  const dirLabel = type === 'incoming' ? '↓ Receiving from' : '↑ Sending to';
  const barColor = type === 'incoming' ? COLORS.success : COLORS.warning;
  const actionColor = type === 'incoming' ? COLORS.success : COLORS.danger;
  const actionLabel = type === 'incoming' ? 'Withdraw' : 'Cancel';

  // Pulsing dot
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.streamCard}>
      {/* Pulsing dot */}
      <Animated.View style={[styles.pulseDot, { backgroundColor: COLORS.success, opacity: pulseAnim }]} />

      {/* Top row */}
      <View style={styles.streamTop}>
        <View style={[styles.streamAvatar, { backgroundColor: (type === 'incoming' ? COLORS.success : COLORS.warning) + '20' }]}>
          <Text style={{ fontSize: 14, color: type === 'incoming' ? COLORS.success : COLORS.warning, fontWeight: '700' }}>{initial}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.streamName}>{name}</Text>
          <Text style={styles.streamDir}>{dirLabel}</Text>
        </View>
      </View>

      {/* Counter */}
      <View style={styles.counterRow}>
        <Text style={styles.counterValue}>{streamed.toFixed(6)}</Text>
        <Text style={styles.counterLabel}>SOL</Text>
      </View>

      {/* Rate */}
      <Text style={styles.rateText}>{stream.rateLabel}</Text>

      {/* Progress bar */}
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: barColor }]} />
      </View>

      {/* Progress info */}
      <View style={styles.progressInfo}>
        <Text style={styles.progressText}>{percentStr}%</Text>
        <Text style={styles.progressText}>{daysLeft}d left</Text>
      </View>

      {/* Bottom row */}
      <View style={styles.streamBottom}>
        <Text style={styles.streamTotal}>of {stream.totalDeposited.toFixed(2)} SOL</Text>
        <TouchableOpacity style={[styles.actionPill, { borderColor: actionColor }]} activeOpacity={0.7}>
          <Text style={[styles.actionPillText, { color: actionColor }]}>{actionLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statPill: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
  },
  // Stream Card
  streamCard: {
    padding: SPACING.xl,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
    position: 'relative',
  },
  pulseDot: {
    position: 'absolute',
    top: SPACING.xl,
    right: SPACING.xl,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  streamTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  streamAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streamName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  streamDir: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.sm,
    marginBottom: 4,
  },
  counterValue: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    fontVariant: ['tabular-nums'],
  },
  counterLabel: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  rateText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  progressBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  progressText: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.textTertiary,
  },
  streamBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streamTotal: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  actionPill: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  actionPillText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
});
