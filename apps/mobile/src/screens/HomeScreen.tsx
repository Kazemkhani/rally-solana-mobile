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
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../utils/constants';
import { MOCK_TRANSACTIONS } from '../data/mockData';
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

  const quickActions = [
    { label: 'Send', icon: '↑', color: COLORS.primary, route: '/pay' },
    { label: 'Split', icon: '✂', color: COLORS.success, route: '/pay' },
    { label: 'Stream', icon: '≋', color: COLORS.streamBlue, route: '/streams' },
  ];

  const badgeStyle = (type: string) => {
    const map: Record<string, { label: string; color: string }> = {
      receive: { label: 'RECEIVED', color: COLORS.success },
      send: { label: 'SENT', color: '#6B7280' },
      split: { label: 'SPLIT', color: COLORS.primary },
      stream: { label: 'STREAM', color: COLORS.streamBlue },
      pool: { label: 'POOL', color: COLORS.warning },
    };
    return map[type] || { label: type.toUpperCase(), color: '#6B7280' };
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
          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(0).duration(400)}
            style={styles.header}
          >
            <Text style={styles.greeting}>{getGreeting()}, Alex 👋</Text>
            <View style={styles.bellContainer}>
              <Text style={styles.bellIcon}>🔔</Text>
              <View style={styles.bellDot} />
            </View>
          </Animated.View>

          {/* Balance Card — Uses BalanceDisplay component */}
          <Animated.View entering={FadeInDown.delay(100).duration(500).springify()}>
            <BalanceDisplay solBalance={balance} usdcBalance={usdcBalance} />
          </Animated.View>

          {/* Quick Actions with haptic feedback */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(400).springify()}
            style={styles.actionsRow}
          >
            {quickActions.map((action) => (
              <Pressable
                key={action.label}
                onPressIn={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                onPress={() => router.push(action.route as any)}
                style={({ pressed }) => [
                  styles.actionItem,
                  pressed && { transform: [{ scale: 0.9 }], opacity: 0.8 },
                ]}
              >
                <LinearGradient
                  colors={[action.color + '18', action.color + '08']}
                  style={styles.actionCircle}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={[styles.actionIcon, { color: action.color }]}>
                    {action.icon}
                  </Text>
                </LinearGradient>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </Animated.View>

          {/* Section Header */}
          <Animated.View
            entering={FadeInDown.delay(250).duration(300)}
            style={styles.sectionHeader}
          >
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <AnimatedPressable>
              <Text style={styles.seeAll}>See All →</Text>
            </AnimatedPressable>
          </Animated.View>

          {/* Transaction Rows or Loading/Empty */}
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
                  entering={FadeInDown.delay(300 + index * 60).duration(400).springify()}
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
                      <View style={styles.txNameRow}>
                        <Text style={styles.txName}>{name}</Text>
                        <Text style={[styles.txBadge, { color: badge.color }]}>
                          {' '}{badge.label}
                        </Text>
                      </View>
                      {tx.memo && <Text style={styles.txMemo}>{tx.memo}</Text>}
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
  scrollContent: { paddingBottom: Platform.OS === 'ios' ? 100 : 80 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  greeting: { fontSize: 24, fontWeight: '800', color: COLORS.text },
  bellContainer: { position: 'relative' },
  bellIcon: { fontSize: 22 },
  bellDot: {
    position: 'absolute', top: 0, right: 0,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: COLORS.danger,
    borderWidth: 1.5, borderColor: '#06060E',
  },
  // Actions
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xxxl,
    paddingVertical: SPACING.xl,
  },
  actionItem: { alignItems: 'center', gap: 6 },
  actionCircle: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  actionIcon: { fontSize: 18, fontWeight: '600' },
  actionLabel: { fontSize: 11, fontWeight: '500', color: '#6B7280' },
  // Section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  sectionTitle: { fontSize: FONT_SIZES.section, fontWeight: '700', color: COLORS.text },
  seeAll: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.primary },
  // Transactions
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    height: 64,
  },
  txAvatar: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    marginRight: SPACING.md,
  },
  txAvatarText: {
    fontSize: 14, fontWeight: '700', color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  txInfo: { flex: 1 },
  txNameRow: { flexDirection: 'row', alignItems: 'baseline' },
  txName: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.text },
  txBadge: { fontSize: 9, fontWeight: '600', letterSpacing: 0.5 },
  txMemo: { fontSize: FONT_SIZES.sm, color: '#4B5563', marginTop: 1 },
  txRight: { alignItems: 'flex-end' },
  txAmount: {
    fontSize: 16, fontWeight: '700', color: COLORS.text,
    fontVariant: ['tabular-nums'], marginBottom: 1,
  },
  txAmountGreen: { color: COLORS.success },
  txTime: { fontSize: 12, color: '#4B5563' },
  txDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginLeft: 60 + SPACING.xl,
    marginRight: SPACING.xl,
  },
});
