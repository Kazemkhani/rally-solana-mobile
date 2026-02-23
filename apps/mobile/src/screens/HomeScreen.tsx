import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, Animated, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../utils/constants';
import { MOCK_TRANSACTIONS } from '../data/mockData';
import { useWalletStore } from '../stores/wallet';

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function HomeScreen() {
  const { balance, usdcBalance } = useWalletStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const balanceAnim = useRef(new Animated.Value(0)).current;
  const itemAnims = useRef(MOCK_TRANSACTIONS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Animate balance count-up
    Animated.timing(balanceAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Stagger list items
    const anims = itemAnims.map((anim, i) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: i * 50,
        useNativeDriver: true,
      })
    );
    Animated.stagger(50, anims).start();
  }, []);

  const totalUsd = (balance * 145) + usdcBalance;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const quickActions = [
    { label: 'Send', icon: '↑', color: COLORS.primary },
    { label: 'Split', icon: '✂', color: COLORS.success },
    { label: 'Stream', icon: '≋', color: COLORS.streamBlue },
  ];

  const typeBadge = (type: string) => {
    const map: Record<string, { label: string; color: string }> = {
      receive: { label: 'Received', color: COLORS.success },
      send: { label: 'Sent', color: COLORS.textSecondary },
      split: { label: 'Split', color: COLORS.primary },
      stream: { label: 'Stream', color: COLORS.streamBlue },
      pool: { label: 'Pool', color: COLORS.warning },
    };
    return map[type] || { label: type, color: COLORS.textSecondary };
  };

  return (
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
        <View style={styles.header}>
          <Text style={styles.greeting}>Hey, Alex 👋</Text>
          <View style={styles.bellContainer}>
            <Text style={styles.bellIcon}>🔔</Text>
            <View style={styles.bellDot} />
          </View>
        </View>

        {/* Balance Card */}
        <Animated.View style={[styles.balanceCard, { opacity: balanceAnim }]}>
          <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
          <Text style={styles.balanceAmount}>
            ${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <View style={styles.tokenRow}>
            <View style={styles.tokenPill}>
              <View style={[styles.tokenDot, { backgroundColor: '#9945FF' }]} />
              <Text style={styles.tokenPillText}>{balance.toFixed(2)} SOL</Text>
            </View>
            <View style={styles.tokenPill}>
              <View style={[styles.tokenDot, { backgroundColor: '#2775CA' }]} />
              <Text style={styles.tokenPillText}>{usdcBalance.toFixed(2)} USDC</Text>
            </View>
          </View>
          {/* Subtle glow at top */}
          <View style={styles.cardGlow} />
        </Animated.View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          {quickActions.map((action) => (
            <TouchableOpacity key={action.label} style={styles.actionItem} activeOpacity={0.7}>
              <View style={[styles.actionCircle, { backgroundColor: action.color + '18' }]}>
                <Text style={[styles.actionIcon, { color: action.color }]}>{action.icon}</Text>
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All →</Text>
          </TouchableOpacity>
        </View>

        {MOCK_TRANSACTIONS.map((tx, index) => {
          const badge = typeBadge(tx.type);
          const isReceive = tx.type === 'receive' || tx.type === 'stream';
          const name = isReceive ? tx.fromName : tx.toName;
          const initial = name.charAt(0).toUpperCase();
          const avatarColors = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#EF4444', '#14F195'];
          const avatarColor = avatarColors[index % avatarColors.length];

          return (
            <Animated.View
              key={tx.id}
              style={[
                styles.txRow,
                {
                  opacity: itemAnims[index],
                  transform: [{ translateY: itemAnims[index].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
                },
              ]}
            >
              {/* Avatar */}
              <View style={[styles.txAvatar, { backgroundColor: avatarColor + '20' }]}>
                <Text style={[styles.txAvatarText, { color: avatarColor }]}>{initial}</Text>
              </View>

              {/* Info */}
              <View style={styles.txInfo}>
                <Text style={styles.txName}>{name}</Text>
                <View style={styles.txMeta}>
                  <View style={[styles.txBadge, { backgroundColor: badge.color + '15' }]}>
                    <Text style={[styles.txBadgeText, { color: badge.color }]}>{badge.label}</Text>
                  </View>
                  {tx.memo && <Text style={styles.txMemo}>{tx.memo}</Text>}
                </View>
              </View>

              {/* Amount */}
              <View style={styles.txRight}>
                <Text style={[styles.txAmount, isReceive && styles.txAmountGreen]}>
                  {isReceive ? '+' : '-'}{tx.amount} {tx.currency}
                </Text>
                <Text style={styles.txTime}>{formatTimeAgo(tx.timestamp)}</Text>
              </View>
            </Animated.View>
          );
        })}
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
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  bellContainer: {
    position: 'relative',
  },
  bellIcon: {
    fontSize: 22,
  },
  bellDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
    borderWidth: 1.5,
    borderColor: COLORS.background,
  },
  // Balance Card
  balanceCard: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.md,
    padding: SPACING.xl,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
    position: 'relative',
  },
  cardGlow: {
    position: 'absolute',
    top: -40,
    left: '20%',
    right: '20%',
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryGlow,
    opacity: 0.5,
  },
  balanceLabel: {
    fontSize: FONT_SIZES.caption,
    fontWeight: '500',
    color: COLORS.textSecondary,
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  balanceAmount: {
    fontSize: FONT_SIZES.balance,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -1,
    marginBottom: SPACING.lg,
  },
  tokenRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  tokenPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  tokenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tokenPillText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  // Quick Actions
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xxxl,
    paddingVertical: SPACING.xxl,
  },
  actionItem: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  actionCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 20,
    fontWeight: '600',
  },
  actionLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.section,
    fontWeight: '700',
    color: COLORS.text,
  },
  seeAll: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  // Transaction Rows
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  txAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  txAvatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  txInfo: {
    flex: 1,
  },
  txName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 3,
  },
  txMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  txBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  txBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  txMemo: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  txRight: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  txAmountGreen: {
    color: COLORS.success,
  },
  txTime: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.textTertiary,
  },
});
