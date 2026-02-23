import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, TextInput, Platform, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../utils/constants';
import { useSquadStore } from '../stores/squads';
import { MOCK_MEMBERS } from '../data/mockData';

export default function SquadScreen() {
  const { squads, addSquad } = useSquadStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('🏠');

  const handleCreate = () => {
    if (!newName.trim()) return;
    addSquad({
      name: newName.trim(),
      emoji: newEmoji,
      members: [MOCK_MEMBERS[0]],
      vault: 'VaULt...' + Math.random().toString(36).slice(2, 6),
      spendThreshold: 1_000_000_000,
      totalDeposited: 0,
      usdcBalance: 0,
      createdAt: Date.now(),
      lastActivity: 'Just created',
    });
    setNewName('');
    setNewEmoji('🏠');
    setShowCreate(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Your Squads</Text>
          <Text style={styles.subtitle}>{squads.length} active</Text>
        </View>
        <TouchableOpacity
          style={styles.createPill}
          onPress={() => setShowCreate(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.createPillText}>Create +</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {squads.map((squad, idx) => {
          const solBalance = squad.totalDeposited / 1_000_000_000;
          const memberAvatars = squad.members.slice(0, 4);
          const extraCount = Math.max(0, squad.members.length - 4);

          return (
            <Link key={squad.id} href={`/squad/${squad.id}`} asChild>
              <TouchableOpacity style={styles.squadCard} activeOpacity={0.8}>
                {/* Header row */}
                <View style={styles.cardHeader}>
                  <Text style={styles.cardEmoji}>{squad.emoji}</Text>
                  <Text style={styles.cardName}>{squad.name}</Text>
                </View>

                {/* Members */}
                <View style={styles.membersSection}>
                  <Text style={styles.memberCount}>{squad.members.length} members</Text>
                  <View style={styles.avatarStack}>
                    {memberAvatars.map((m, i) => {
                      const initial = m.displayName.charAt(0);
                      return (
                        <View
                          key={m.pubkey + i}
                          style={[
                            styles.memberAvatar,
                            { backgroundColor: m.color + '25', marginLeft: i > 0 ? -8 : 0, zIndex: 10 - i },
                          ]}
                        >
                          <Text style={[styles.memberInitial, { color: m.color }]}>{initial}</Text>
                        </View>
                      );
                    })}
                    {extraCount > 0 && (
                      <View style={[styles.memberAvatar, styles.memberAvatarExtra, { marginLeft: -8 }]}>
                        <Text style={styles.memberExtraText}>+{extraCount}</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Vault balance */}
                <View style={styles.vaultSection}>
                  <Text style={styles.vaultBalance}>{solBalance.toFixed(2)} SOL</Text>
                  <Text style={styles.vaultUsd}>${squad.usdcBalance.toFixed(2)}</Text>
                </View>

                {/* Activity */}
                <View style={styles.activityRow}>
                  <View style={styles.activityDot} />
                  <Text style={styles.activityText}>{squad.lastActivity}</Text>
                </View>
              </TouchableOpacity>
            </Link>
          );
        })}
      </ScrollView>

      {/* Create Squad Modal */}
      <Modal visible={showCreate} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Squad</Text>

            <View style={styles.emojiRow}>
              {['🏠', '✈️', '🎉', '💼', '🎮', '🍕'].map((e) => (
                <TouchableOpacity
                  key={e}
                  style={[styles.emojiBtn, newEmoji === e && styles.emojiBtnActive]}
                  onPress={() => setNewEmoji(e)}
                >
                  <Text style={styles.emojiBtnText}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="Squad name"
              placeholderTextColor={COLORS.textTertiary}
              autoFocus
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleCreate}>
              <Text style={styles.submitBtnText}>Create Squad</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowCreate(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
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
  createPill: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primarySubtle,
  },
  createPillText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
    gap: 14,
  },
  // Squad Card
  squadCard: {
    padding: SPACING.xl,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardName: {
    fontSize: FONT_SIZES.section,
    fontWeight: '700',
    color: COLORS.text,
  },
  membersSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  memberCount: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  avatarStack: {
    flexDirection: 'row',
  },
  memberAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  memberInitial: {
    fontSize: 11,
    fontWeight: '700',
  },
  memberAvatarExtra: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  memberExtraText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  vaultSection: {
    marginBottom: SPACING.lg,
  },
  vaultBalance: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  vaultUsd: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
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
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surfaceElevated,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xxl,
    paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.xxl,
  },
  modalTitle: {
    fontSize: FONT_SIZES.section,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  emojiBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiBtnActive: {
    backgroundColor: COLORS.primarySubtle,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  emojiBtnText: {
    fontSize: 22,
  },
  input: {
    backgroundColor: COLORS.surfaceInput,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    fontSize: FONT_SIZES.xl,
    color: COLORS.text,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  submitBtnText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  cancelBtn: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
});
