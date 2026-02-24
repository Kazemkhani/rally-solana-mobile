import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  RefreshControl, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../components/ScreenWrapper';
import BalanceDisplay from '../components/BalanceDisplay';
import AnimatedPressable from '../components/AnimatedPressable';
import EmptyState from '../components/EmptyState';
import { SkeletonCard } from '../components/LoadingSkeleton';
import { showToast } from '../components/Toast';
import { COLORS, SPACING, RADIUS, FONT_SIZES, TRUNCATE_ADDRESS } from '../utils/constants';
import { MOCK_TRANSACTIONS, MOCK_USER } from '../data/mockData';
import { useWalletStore } from '../stores/wallet';

// Gradient pairs per avatar initial
const AVATAR_GRADIENTS: Record<string, [string, string]> = {
  A: ['#667eea', '#764ba2'],
  M: ['#f093fb', '#f5576c'],
  Y: ['#4facfe', '#00f2fe'],
  J: ['#ffd700', '#ff8c00'],
  S: ['#43e97b', '#38f9d7'],
  T: ['#fa709a', '#fee140'],
  R: ['#a18cd1', '#fbc2eb'],
  D: ['#ffecd2', '#fcb69f'],
};

const GRADIENT_LIST: [string, string][] = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#ffd700', '#ff8c00'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#a18cd1', '#fbc2eb'],
  ['#ffecd2', '#fcb69f'],
];

function getGradient(name: string, index: number): [string, string] {
  const initial = name.charAt(0).toUpperCase();
  return AVATAR_GRADIENTS[initial] || GRADIENT_LIST[index % GRADIENT_LIST.length];
}

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const { balance, usdcBalance } = useWalletStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showToast('Portfolio updated', 'success');
    }, 1200);
  };

  const badgeStyle = (type: string) => {
    switch (type) {
      case 'receive': return { label: 'RECEIVED', color: COLORS.success };
      case 'send': return { label: 'SENT', color: COLORS.danger };
      case 'split': return { label: 'SPLIT', color: COLORS.warning };
      case 'stream': return { label: 'STREAM', color: COLORS.streamBlue };
      case 'pool': return { label: 'POOL', color: COLORS.primary };
      default: return { label: type.toUpperCase(), color: COLORS.textSecondary };
    }
  };

  return (
    <ScreenWrapper accentStrength={0.06}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header — Avatar, Address Pill, Bell */}
          <Animated.View
            entering={FadeInDown.delay(0).duration(400)}
            style={styles.header}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.headerAvatar}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.headerAvatarText}>A</Text>
            </LinearGradient>
            <View style={styles.addressPill}>
              <Text style={styles.addressText}>
                {TRUNCATE_ADDRESS(MOCK_USER.pubkey)}
              </Text>
            </View>
            <View style={styles.bellContainer}>
              <Text style={styles.bellIcon}>🔔</Text>
              <View style={styles.bellDot} />
            </View>
          </Animated.View>

          {/* Greeting */}
          <Animated.View entering={FadeInDown.delay(50).duration(400)}>
            <Text style={styles.greeting}>{getGreeting()}, Alex</Text>
          </Animated.View>

          {/* Balance Card */}
          <Animated.View entering={FadeInDown.delay(100).duration(500).springify()}>
            <BalanceDisplay solBalance={balance} usdcBalance={usdcBalance} />
          </Animated.View>

          {/* Action Pill Bar — Receive | + | Send (wallet-style) */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(400).springify()}
            style={styles.actionPillBar}
          >
            <AnimatedPressable
              scaleDepth={0.95}
              style={styles.actionPillLeft}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
            >
              <Text style={styles.actionPillIcon}>↓</Text>
              <Text style={styles.actionPillLabel}>Receive</Text>
            </AnimatedPressable>
            <AnimatedPressable
              scaleDepth={0.9}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/pay'); }}
            >
              <LinearGradient
                colors={['#A78BFA', '#7C3AED']}
                style={styles.actionPillCenter}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.actionPillCenterIcon}>+</Text>
              </LinearGradient>
            </AnimatedPressable>
            <AnimatedPressable
              scaleDepth={0.95}
              style={styles.actionPillRight}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/pay'); }}
            >
              <Text style={styles.actionPillLabel}>Send</Text>
              <Text style={styles.actionPillIcon}>↗</Text>
            </AnimatedPressable>
          </Animated.View>

          {/* Quick Access Row */}
          <Animated.View
            entering={FadeInDown.delay(250).duration(400).springify()}
            style={styles.quickRow}
          >
            {[
              { label: 'Split', icon: '✂', route: '/pay' },
              { label: 'Stream', icon: '≋', route: '/streams' },
              { label: 'Squads', icon: '◆', route: '/squads' },
            ].map((item) => (
              <AnimatedPressable
                key={item.label}
                scaleDepth={0.93}
                style={styles.quickChip}
                onPress={() => router.push(item.route as any)}
              >
                <Text style={styles.quickChipIcon}>{item.icon}</Text>
                <Text style={styles.quickChipLabel}>{item.label}</Text>
              </AnimatedPressable>
            ))}
          </Animated.View>

          {/* Section Header */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(300)}
            style={styles.sectionHeader}
          >
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <AnimatedPressable style={styles.seeAllPill}>
              <Text style={styles.seeAll}>See All</Text>
            </AnimatedPressable>
          </Animated.View>

          {/* Transaction Rows — Chat-style (larger avatars, preview text) */}
          {loading ? (
            <View style={{ paddingHorizontal: SPACING.xl }}>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </View>
          ) : MOCK_TRANSACTIONS.length === 0 ? (
            <EmptyState
              icon="📭"
              title="No transactions yet"
              subtitle="Send, split, or stream SOL to see your activity here"
            />
          ) : (
            MOCK_TRANSACTIONS.map((tx, index) => {
              const badge = badgeStyle(tx.type);
              const isReceive = tx.type === 'receive' || tx.type === 'stream';
              const name = isReceive ? tx.fromName : tx.toName;
              const initial = name.charAt(0).toUpperCase();
              const gradient = getGradient(name, index);

              return (
                <Animated.View
                  key={tx.id}
                  entering={FadeInDown.delay(350 + index * 50).duration(400).springify()}
                >
                  <AnimatedPressable scaleDepth={0.99} style={styles.txRow}>
                    <LinearGradient
                      colors={gradient}
                      style={styles.txAvatar}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.txAvatarText}>{initial}</Text>
                    </LinearGradient>
                    <View style={styles.txInfo}>
                      <Text style={styles.txName}>{name}</Text>
                      <Text style={styles.txMemo} numberOfLines={1}>
                        {tx.memo || `${badge.label.toLowerCase()} • ${tx.amount} ${tx.currency}`}
                      </Text>
                    </View>
                    <View style={styles.txRight}>
                      <Text style={[styles.txAmount, isReceive && styles.txAmountGreen]}>
                        {isReceive ? '+' : '-'}{tx.amount} {tx.currency}
                      </Text>
                      <Text style={styles.txTime}>{formatTimeAgo(tx.timestamp)}</Text>
                    </View>
                  </AnimatedPressable>
                  {index < MOCK_TRANSACTIONS.length - 1 && (
                    <View style={styles.txDivider} />
                  )}
                </Animated.View>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: Platform.OS === 'ios' ? 120 : 100 },
  // Header — Avatar + Address + Bell
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  headerAvatar: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
  },
  headerAvatarText: {
    fontSize: 16, fontWeight: '700', color: '#FFF',
  },
  addressPill: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  addressText: {
    fontSize: 13, fontWeight: '500', color: COLORS.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  bellContainer: { position: 'relative' },
  bellIcon: { fontSize: 22 },
  bellDot: {
    position: 'absolute', top: 0, right: 0,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: COLORS.danger,
    borderWidth: 1.5, borderColor: '#06060E',
  },
  // Greeting
  greeting: {
    fontSize: 22, fontWeight: '700', color: COLORS.text,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  // Action Pill Bar — wallet-style Receive | + | Send
  actionPillBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    backgroundColor: 'rgba(17, 17, 34, 0.7)',
    borderRadius: 999,
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.08)',
    ...Platform.select({
      web: { backdropFilter: 'blur(12px)' } as any,
      default: {},
    }),
  },
  actionPillLeft: {
    flex: 1, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    gap: 6, height: '100%',
  },
  actionPillRight: {
    flex: 1, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    gap: 6, height: '100%',
  },
  actionPillCenter: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 8,
  },
  actionPillCenterIcon: {
    fontSize: 22, fontWeight: '600', color: '#FFF',
  },
  actionPillIcon: {
    fontSize: 14, fontWeight: '600', color: COLORS.textSecondary,
  },
  actionPillLabel: {
    fontSize: 14, fontWeight: '600', color: COLORS.text,
  },
  // Quick Access Chips
  quickRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  quickChipIcon: {
    fontSize: 13, color: COLORS.primary,
  },
  quickChipLabel: {
    fontSize: 13, fontWeight: '500', color: COLORS.textSecondary,
  },
  // Section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
  },
  sectionTitle: { fontSize: FONT_SIZES.section, fontWeight: '700', color: COLORS.text },
  seeAllPill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
  },
  seeAll: { fontSize: 12, fontWeight: '600', color: COLORS.primary },
  // Transaction rows — Chat-style (larger avatars)
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    height: 72,
  },
  txAvatar: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    marginRight: SPACING.md,
  },
  txAvatarText: {
    fontSize: 16, fontWeight: '700', color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  txInfo: { flex: 1 },
  txName: {
    fontSize: 15, fontWeight: '600', color: COLORS.text,
    marginBottom: 2,
  },
  txMemo: {
    fontSize: 13, color: '#4B5563',
  },
  txRight: { alignItems: 'flex-end' },
  txAmount: {
    fontSize: 15, fontWeight: '700', color: COLORS.text,
    fontVariant: ['tabular-nums'], marginBottom: 2,
  },
  txAmountGreen: { color: COLORS.success },
  txTime: { fontSize: 12, color: '#4B5563' },
  txDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginLeft: 64 + SPACING.xl,
    marginRight: SPACING.xl,
  },
});
