import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../utils/constants';
import type { Squad } from '../types';

interface Props {
  squad: Squad;
  onPress?: () => void;
}

export default function SquadCard({ squad, onPress }: Props) {
  const balance = squad.totalDeposited / 1_000_000_000;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{squad.name}</Text>
        <View style={styles.memberBadge}>
          <Text style={styles.memberCount}>{squad.members.length} 👥</Text>
        </View>
      </View>

      {/* Member avatars */}
      <View style={styles.avatarRow}>
        {squad.members.slice(0, 4).map((member, i) => (
          <View
            key={member}
            style={[styles.avatar, { marginLeft: i > 0 ? -8 : 0, zIndex: 4 - i }]}
          >
            <Text style={styles.avatarEmoji}>
              {['🟣', '🔵', '🟢', '🟡'][i % 4]}
            </Text>
          </View>
        ))}
        {squad.members.length > 4 && (
          <View style={[styles.avatar, { marginLeft: -8 }]}>
            <Text style={styles.avatarMore}>+{squad.members.length - 4}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.balanceLabel}>Vault Balance</Text>
          <Text style={styles.balanceAmount}>{balance.toFixed(2)} SOL</Text>
        </View>
        <View style={styles.thresholdBadge}>
          <Text style={styles.thresholdText}>
            Free spend: {'<'}{(squad.spendThreshold / 1_000_000_000).toFixed(1)} SOL
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  memberBadge: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  memberCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  avatarRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  avatarEmoji: {
    fontSize: 14,
  },
  avatarMore: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  balanceLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.success,
    marginTop: 2,
  },
  thresholdBadge: {
    backgroundColor: COLORS.primary + '15',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  thresholdText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '500',
  },
});
