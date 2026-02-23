import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StreamCard from '../components/StreamCard';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../utils/constants';
import { MOCK_STREAMS } from '../data/mockData';

export default function StreamScreen() {
  const [tick, setTick] = useState(0);

  // Live tick every second for animated counters
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const now = Math.floor(Date.now() / 1000);
  const incoming = MOCK_STREAMS.filter((s) => s.recipient === 'me');
  const outgoing = MOCK_STREAMS.filter((s) => s.sender === 'me');

  // Total incoming rate
  const totalIncomingPerHour = incoming.reduce((sum, s) => sum + s.amountPerSecond * 3600, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Payment Streams</Text>
          <Text style={styles.subtitle}>Real-time continuous payments</Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Incoming</Text>
            <Text style={[styles.summaryValue, { color: COLORS.success }]}>{incoming.length}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Outgoing</Text>
            <Text style={[styles.summaryValue, { color: COLORS.warning }]}>{outgoing.length}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Rate/hr</Text>
            <Text style={[styles.summaryValue, { color: COLORS.primary }]}>
              +{totalIncomingPerHour.toFixed(3)}
            </Text>
          </View>
        </View>

        {/* Incoming Section */}
        {incoming.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: COLORS.success }]} />
              <Text style={styles.sectionTitle}>Incoming</Text>
            </View>
            <View style={styles.streamList}>
              {incoming.map((stream) => {
                const elapsed = Math.min(
                  now - stream.startTime,
                  stream.endTime - stream.startTime
                );
                return (
                  <StreamCard key={stream.id} stream={stream} elapsed={elapsed} />
                );
              })}
            </View>
          </View>
        )}

        {/* Outgoing Section */}
        {outgoing.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: COLORS.warning }]} />
              <Text style={styles.sectionTitle}>Outgoing</Text>
            </View>
            <View style={styles.streamList}>
              {outgoing.map((stream) => {
                const elapsed = Math.min(
                  now - stream.startTime,
                  stream.endTime - stream.startTime
                );
                return (
                  <StreamCard key={stream.id} stream={stream} elapsed={elapsed} />
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Create Stream FAB */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  summaryValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  section: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
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
  streamList: {
    gap: SPACING.md,
  },
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 108 : 88,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.streamBlue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.streamBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: {
    fontSize: 28,
    color: COLORS.text,
    fontWeight: '300',
    marginTop: -2,
  },
});
