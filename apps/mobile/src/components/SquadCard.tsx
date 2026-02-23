import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../utils/constants';
import type { Squad } from '../types';

interface Props {
  squad: Squad;
  onPress?: () => void;
}

export default function SquadCard({ squad, onPress }: Props) {
  const solBalance = squad.totalDeposited / 1_000_000_000;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.nameRow}>
          <Text style={styles.emoji}>{squad.emoji}</Text>
          <Text style={styles.name}>{squad.name}</Text>
        </View>
      </View>

      {/* Avatar Stack */}
      <View style={styles.avatarRow}>
        {squad.members.slice(0, 5).map((member, i) => (
          <View
            key={member.pubkey}
            style={[
              styles.avatar,
              { marginLeft: i > 0 ? -10 : 0, zIndex: 5 - i, backgroundColor: member.color + '25' },
            ]}
          >
            <Text style={styles.avatarEmoji}>{member.avatar}</Text>
          </View>
        ))}
        {squad.members.length > 5 && (
          <View style={[styles.avatar, styles.avatarMore, { marginLeft: -10 }]}>
            <Text style={styles.avatarMoreText}>+{squad.members.length - 5}</Text>
          </View>
        )}
      </View>

      {/* Balance + Activity */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.balanceLabel}>Vault Balance</Text>
          <Text style={styles.balanceAmount}>{solBalance.toFixed(2)} SOL</Text>
          <Text style={styles.usdcAmount}>${squad.usdcBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
        </View>
        <View style={styles.memberCountBadge}>
          <Text style={styles.memberCountText}>{squad.members.length} members</Text>
        </View>
      </View>

      {/* Last Activity */}
      <View style={styles.activityRow}>
        <View style={styles.activityDot} />
        <Text style={styles.activityText} numberOfLines={1}>{squad.lastActivity}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  emoji: {
    fontSize: 20,
  },
  name: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  avatarRow: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  avatarEmoji: {
    fontSize: 16,
  },
  avatarMore: {
    backgroundColor: COLORS.surfaceLight,
  },
  avatarMoreText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: SPACING.md,
  },
  balanceLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  balanceAmount: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  usdcAmount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  memberCountBadge: {
    backgroundColor: COLORS.primary + '15',
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  memberCountText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.primary,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  activityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  activityText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },
});
