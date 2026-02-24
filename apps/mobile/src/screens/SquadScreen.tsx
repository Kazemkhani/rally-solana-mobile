import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, TextInput, Platform, RefreshControl, KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../components/ScreenWrapper';
import AnimatedPressable from '../components/AnimatedPressable';
import EmptyState from '../components/EmptyState';
import { SkeletonCard } from '../components/LoadingSkeleton';
import { showToast } from '../components/Toast';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../utils/constants';
import { useSquadStore } from '../stores/squads';
import { MOCK_MEMBERS } from '../data/mockData';

// Per-card accent tints via LinearGradient
const CARD_ACCENT_COLORS: { gradient: [string, string]; border: string; glow: string }[] = [
  { gradient: ['rgba(245,158,11,0.12)', 'transparent'], border: 'rgba(245,158,11,0.08)', glow: 'rgba(245,158,11,0.5)' },
  { gradient: ['rgba(59,130,246,0.12)', 'transparent'], border: 'rgba(59,130,246,0.08)', glow: 'rgba(59,130,246,0.5)' },
  { gradient: ['rgba(244,114,182,0.12)', 'transparent'], border: 'rgba(244,114,182,0.08)', glow: 'rgba(244,114,182,0.5)' },
  { gradient: ['rgba(16,185,129,0.12)', 'transparent'], border: 'rgba(16,185,129,0.08)', glow: 'rgba(16,185,129,0.5)' },
];

const ACCENT_BORDER_COLORS = [
  'rgba(245,158,11,0.35)',
  'rgba(59,130,246,0.35)',
  'rgba(244,114,182,0.35)',
  'rgba(16,185,129,0.35)',
];

// Avatar gradients matching HomeScreen
const AVATAR_GRADIENTS: [string, string][] = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#ffd700', '#ff8c00'],
  ['#43e97b', '#38f9d7'],
];

export default function SquadScreen() {
  const router = useRouter();
  const { squads, addSquad } = useSquadStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('🏠');

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showToast('Squads refreshed', 'success');
    }, 1000);
  };

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
    showToast(`${newName.trim()} created!`, 'success');
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)} style={styles.header}>
          <View>
            <Text style={styles.title}>Your Squads</Text>
            <Text style={styles.subtitle}>{squads.length} active</Text>
          </View>
          <AnimatedPressable
            scaleDepth={0.93}
            onPress={() => setShowCreate(true)}
            style={styles.createGhost}
          >
            <Text style={styles.createGhostText}>Create +</Text>
          </AnimatedPressable>
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
        >
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : squads.length === 0 ? (
            <EmptyState
              icon="👥"
              title="No squads yet"
              subtitle="Create a squad to start splitting expenses and managing group wallets"
            />
          ) : squads.map((squad, idx) => {
            const solBalance = squad.totalDeposited / 1_000_000_000;
            const memberAvatars = squad.members.slice(0, 4);
            const extraCount = Math.max(0, squad.members.length - 4);
            const accent = CARD_ACCENT_COLORS[idx % CARD_ACCENT_COLORS.length];

            return (
              <Animated.View
                key={squad.id}
                entering={FadeInDown.delay(80 + idx * 80).duration(400).springify()}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => router.push(`/squad/${squad.id}`)}
                  style={[styles.squadCard, { borderColor: accent.border, borderLeftColor: ACCENT_BORDER_COLORS[idx % 4] }]}
                >
                  {/* Glass background */}
                  <LinearGradient
                    colors={['rgba(25, 25, 50, 0.9)', 'rgba(15, 15, 35, 0.95)']}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  />
                  {/* Accent tint overlay */}
                  <LinearGradient
                    colors={accent.gradient}
                    style={styles.accentOverlay}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0.8, y: 0.8 }}
                  />
                  {/* Top accent glow line */}
                  <LinearGradient
                    colors={['transparent', accent.glow, 'transparent']}
                    style={styles.topAccentLine}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />

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
                        const gradient = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];
                        return (
                          <LinearGradient
                            key={m.pubkey + i}
                            colors={gradient}
                            style={[
                              styles.memberAvatar,
                              { marginLeft: i > 0 ? -6 : 0, zIndex: 10 - i },
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                          >
                            <Text style={styles.memberInitial}>
                              {m.displayName.charAt(0)}
                            </Text>
                          </LinearGradient>
                        );
                      })}
                      {extraCount > 0 && (
                        <View style={[styles.memberAvatar, styles.extraAvatar, { marginLeft: -6 }]}>
                          <Text style={styles.extraText}>+{extraCount}</Text>
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
              </Animated.View>
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
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg, paddingBottom: SPACING.md,
  },
  title: { fontSize: FONT_SIZES.title, fontWeight: '800', color: COLORS.text, letterSpacing: -0.5 },
  subtitle: { fontSize: FONT_SIZES.md, color: '#4B5563', marginTop: 2 },
  createGhost: {
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full, borderWidth: 1, borderColor: 'rgba(139,92,246,0.3)',
  },
  createGhostText: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.primary },
  scrollContent: {
    paddingHorizontal: SPACING.xl, paddingTop: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100, gap: 14,
  },
  // Squad Card
  squadCard: {
    padding: SPACING.xl, borderRadius: RADIUS.xl, overflow: 'hidden',
    position: 'relative', backgroundColor: 'rgba(17, 17, 34, 0.6)',
    borderWidth: 1, borderLeftWidth: 2.5, borderColor: 'rgba(139, 92, 246, 0.08)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 6,
    ...Platform.select({
      web: { backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' },
      default: {},
    }),
  },
  topAccentLine: {
    position: 'absolute', top: 0, left: '15%', right: '15%', height: 1.5,
  },
  accentOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RADIUS.xl,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.lg },
  cardEmoji: { fontSize: 24 },
  cardName: { fontSize: FONT_SIZES.section, fontWeight: '700', color: COLORS.text },
  membersSection: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  memberCount: { fontSize: FONT_SIZES.md, color: '#6B7280' },
  avatarStack: { flexDirection: 'row' },
  memberAvatar: {
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#111122',
  },
  memberInitial: {
    fontSize: 10, fontWeight: '700', color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  extraAvatar: { backgroundColor: 'rgba(255,255,255,0.08)' },
  extraText: { fontSize: 9, fontWeight: '600', color: '#6B7280' },
  vaultSection: { marginBottom: SPACING.lg },
  vaultBalance: { fontSize: 24, fontWeight: '800', color: COLORS.text, fontVariant: ['tabular-nums'] },
  vaultUsd: { fontSize: FONT_SIZES.md, color: '#6B7280', marginTop: 2, fontVariant: ['tabular-nums'] },
  activityRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.03)',
  },
  activityDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: COLORS.success },
  activityText: { fontSize: FONT_SIZES.sm, color: '#4B5563' },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#1A1A35', borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xxl, paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.xxl,
  },
  modalTitle: { fontSize: FONT_SIZES.section, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xl, textAlign: 'center' },
  emojiRow: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.md, marginBottom: SPACING.xl },
  emojiBtn: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)', alignItems: 'center', justifyContent: 'center',
  },
  emojiBtnActive: { backgroundColor: 'rgba(139,92,246,0.08)', borderWidth: 1, borderColor: COLORS.primary },
  emojiBtnText: { fontSize: 22 },
  input: {
    backgroundColor: '#0D0D1A', borderRadius: RADIUS.md, padding: SPACING.lg,
    fontSize: FONT_SIZES.xl, color: COLORS.text, marginBottom: SPACING.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)',
  },
  submitBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, padding: SPACING.lg, alignItems: 'center', marginBottom: SPACING.md },
  submitBtnText: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.text },
  cancelBtn: { padding: SPACING.md, alignItems: 'center' },
  cancelBtnText: { fontSize: FONT_SIZES.md, color: '#6B7280' },
});
