import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SquadCard from '../components/SquadCard';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../utils/constants';
import { MOCK_SQUADS } from '../data/mockData';

export default function SquadScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Your Squads</Text>
            <Text style={styles.subtitle}>{MOCK_SQUADS.length} active squads</Text>
          </View>
          <TouchableOpacity style={styles.createBtn} activeOpacity={0.7}>
            <Text style={styles.createBtnText}>Create Squad +</Text>
          </TouchableOpacity>
        </View>

        {/* Squad Summary Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{MOCK_SQUADS.length}</Text>
            <Text style={styles.statLabel}>Squads</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {MOCK_SQUADS.reduce((acc, s) => acc + s.members.length, 0)}
            </Text>
            <Text style={styles.statLabel}>Members</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              ${(MOCK_SQUADS.reduce((acc, s) => acc + s.usdcBalance, 0) + MOCK_SQUADS.reduce((acc, s) => acc + s.totalDeposited / 1e9 * 145, 0)).toFixed(0)}
            </Text>
            <Text style={styles.statLabel}>Total Value</Text>
          </View>
        </View>

        {/* Squad Cards */}
        <View style={styles.squads}>
          {MOCK_SQUADS.map((squad) => (
            <SquadCard key={squad.id} squad={squad} />
          ))}
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  createBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  createBtnText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  squads: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    gap: SPACING.md,
  },
});
