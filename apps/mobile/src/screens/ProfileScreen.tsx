import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch,
  Platform, Modal, Animated, Easing, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenWrapper from '../components/ScreenWrapper';
import AnimatedPressable from '../components/AnimatedPressable';
import { LinearGradient } from 'expo-linear-gradient';
import { showToast } from '../components/Toast';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../utils/constants';
import { MOCK_USER } from '../data/mockData';
import { useWalletStore } from '../stores/wallet';

export default function ProfileScreen() {
  const { balance, usdcBalance, skrBalance, disconnect } = useWalletStore();
  const [biometrics, setBiometrics] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Rotating gradient ring
  const ringRotation = useRef(new Animated.Value(0)).current;
  const entranceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slow spin — 20s per revolution
    Animated.loop(
      Animated.timing(ringRotation, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.timing(entranceAnim, {
      toValue: 1, duration: 400, useNativeDriver: true,
    }).start();
  }, []);

  const spin = ringRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const tokenData = [
    { symbol: 'SOL', name: 'Solana', balance, usdValue: balance * 145, gradient: ['#9945FF', '#6366F1'] as [string, string], icon: '◎' },
    { symbol: 'USDC', name: 'USD Coin', balance: usdcBalance, usdValue: usdcBalance, gradient: ['#2775CA', '#1a5fb4'] as [string, string], icon: '$' },
    { symbol: 'SKR', name: 'Seeker', balance: skrBalance, usdValue: skrBalance * 0.20, gradient: ['#F59E0B', '#D97706'] as [string, string], icon: '✦' },
  ];

  const handleCopy = () => {
    setCopied(true);
    showToast('Address copied!', 'success');
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDisconnect = () => {
    setShowDisconnect(true);
  };

  const confirmDisconnect = () => {
    setShowDisconnect(false);
    disconnect();
    showToast('Wallet disconnected', 'info');
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showToast('Profile refreshed', 'success');
    }, 1000);
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
        >
          {/* Profile Header */}
          <Animated.View style={[styles.profileHeader, {
            opacity: entranceAnim,
            transform: [{ translateY: entranceAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
          }]}>
            {/* Rotating gradient ring */}
            <View style={styles.avatarOuter}>
              <Animated.View style={[styles.avatarRing, { transform: [{ rotate: spin }] }]}>
                <View style={styles.ringGradient1} />
                <View style={styles.ringGradient2} />
              </Animated.View>
              <View style={styles.avatarInner}>
                <Text style={styles.avatarEmoji}>{MOCK_USER.avatar}</Text>
              </View>
              <View style={styles.statusDot} />
            </View>

            <Text style={styles.displayName}>{MOCK_USER.displayName}</Text>

            <View style={styles.connectedRow}>
              <View style={styles.connectedDot} />
              <Text style={styles.connectedText}>Connected</Text>
            </View>

            {/* Copyable address pill */}
            <AnimatedPressable
              scaleDepth={0.95}
              onPress={handleCopy}
              style={[styles.addressPill, copied && styles.addressPillCopied]}
            >
              <Text style={[styles.addressText, copied && { color: COLORS.success }]}>
                {copied ? 'Copied!' : `${MOCK_USER.pubkey.slice(0, 6)}...${MOCK_USER.pubkey.slice(-6)}`}
              </Text>
              {!copied && <Text style={styles.copyIcon}>📋</Text>}
            </AnimatedPressable>
          </Animated.View>

          {/* Stats — Clean, no boxes */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: COLORS.primary }]}>{MOCK_USER.squads.length}</Text>
              <Text style={styles.statLabel}>Squads</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: COLORS.streamBlue }]}>24</Text>
              <Text style={styles.statLabel}>Txns</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: COLORS.warning }]}>{MOCK_USER.streakDays}</Text>
              <Text style={styles.statLabel}>Streak 🔥</Text>
            </View>
          </View>

          {/* Assets */}
          <Text style={styles.sectionTitle}>Assets</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.assetsScroll}>
            {tokenData.map((token, i) => (
              <AnimatedPressable
                key={token.symbol}
                scaleDepth={0.95}
                style={styles.tokenCard}
              >
                <LinearGradient
                  colors={token.gradient}
                  style={styles.tokenIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.tokenIconText}>{token.icon}</Text>
                </LinearGradient>
                <View style={styles.tokenInfo}>
                  <Text style={styles.tokenName}>{token.name}</Text>
                  <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                </View>
                <View style={styles.tokenValues}>
                  <Text style={styles.tokenBalance}>
                    {token.balance.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </Text>
                  <Text style={styles.tokenUsd}>
                    ${token.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                </View>
              </AnimatedPressable>
            ))}
          </ScrollView>

          {/* Settings — Grouped Card */}
          <Text style={[styles.sectionTitle, { marginTop: SPACING.xxxl }]}>Settings</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View style={[styles.settingIconWrap, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
                <Text style={styles.settingIcon}>🔐</Text>
              </View>
              <Text style={styles.settingLabel}>Biometric Lock</Text>
              <Switch
                value={biometrics}
                onValueChange={(v) => { setBiometrics(v); showToast(v ? 'Biometric lock enabled' : 'Biometric lock disabled', 'info'); }}
                trackColor={{ false: '#1A1A35', true: 'rgba(139,92,246,0.4)' }}
                thumbColor={biometrics ? COLORS.primary : '#4B5563'}
              />
            </View>
            <View style={styles.settingDivider} />
            <View style={styles.settingRow}>
              <View style={[styles.settingIconWrap, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                <Text style={styles.settingIcon}>🔔</Text>
              </View>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Switch
                value={notifications}
                onValueChange={(v) => { setNotifications(v); showToast(v ? 'Notifications enabled' : 'Notifications disabled', 'info'); }}
                trackColor={{ false: '#1A1A35', true: 'rgba(139,92,246,0.4)' }}
                thumbColor={notifications ? COLORS.primary : '#4B5563'}
              />
            </View>
            <View style={styles.settingDivider} />
            <AnimatedPressable scaleDepth={0.99} opacityDepth={0.9} style={styles.settingRow}>
              <View style={[styles.settingIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <Text style={styles.settingIcon}>⚙️</Text>
              </View>
              <Text style={styles.settingLabel}>Network</Text>
              <View style={styles.devnetBadge}>
                <Text style={styles.devnetText}>Devnet</Text>
              </View>
            </AnimatedPressable>
            <View style={styles.settingDivider} />
            <AnimatedPressable scaleDepth={0.99} opacityDepth={0.9} style={styles.settingRow} onPress={handleDisconnect}>
              <View style={[styles.settingIconWrap, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                <Text style={styles.settingIcon}>🚪</Text>
              </View>
              <Text style={[styles.settingLabel, { color: COLORS.danger }]}>Disconnect Wallet</Text>
            </AnimatedPressable>
          </View>

          <Text style={styles.versionText}>Rally v0.1.0 · Powered by Solana</Text>
        </ScrollView>

        {/* Custom Disconnect Modal */}
        <Modal visible={showDisconnect} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalEmoji}>⚠️</Text>
              <Text style={styles.modalTitle}>Disconnect Wallet?</Text>
              <Text style={styles.modalSub}>You will need to reconnect to access your funds</Text>
              <TouchableOpacity style={styles.modalDanger} onPress={confirmDisconnect}>
                <Text style={styles.modalDangerText}>Disconnect</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowDisconnect(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
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
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  // Profile Header
  profileHeader: {
    alignItems: 'center',
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xl,
  },
  avatarOuter: {
    width: 108,
    height: 108,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  avatarRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 54,
    overflow: 'hidden',
  },
  ringGradient1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '50%',
    borderTopWidth: 2.5,
    borderLeftWidth: 2.5,
    borderRightWidth: 2.5,
    borderTopColor: '#8B5CF6',
    borderLeftColor: '#6366F1',
    borderRightColor: '#3B82F6',
    borderColor: 'transparent',
    borderTopLeftRadius: 54,
    borderTopRightRadius: 54,
  },
  ringGradient2: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    bottom: 0,
    borderBottomWidth: 2.5,
    borderLeftWidth: 2.5,
    borderRightWidth: 2.5,
    borderBottomColor: '#3B82F6',
    borderLeftColor: '#8B5CF6',
    borderRightColor: '#6366F1',
    borderColor: 'transparent',
    borderBottomLeftRadius: 54,
    borderBottomRightRadius: 54,
  },
  avatarInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#111122',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 44 },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.success,
    borderWidth: 2.5,
    borderColor: '#06060E',
  },
  displayName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  connectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.md,
  },
  connectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  connectedText: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '500',
  },
  addressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  addressPillCopied: {
    backgroundColor: 'rgba(16,185,129,0.08)',
  },
  addressText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  copyIcon: { fontSize: 12 },
  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
    marginHorizontal: SPACING.xxxl,
    marginBottom: SPACING.xl,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', fontVariant: ['tabular-nums'] },
  statLabel: { fontSize: 11, color: '#4B5563', marginTop: 2, fontWeight: '500' },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  // Assets
  sectionTitle: {
    fontSize: FONT_SIZES.section,
    fontWeight: '700',
    color: COLORS.text,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  assetsScroll: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
  },
  tokenCard: {
    width: 140,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    backgroundColor: 'rgba(17, 17, 34, 0.6)',
    borderWidth: 1,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.08)',
    alignItems: 'flex-start',
  },
  tokenIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  tokenIconText: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  tokenInfo: { marginBottom: SPACING.sm },
  tokenName: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text, marginBottom: 2 },
  tokenSymbol: { fontSize: 13, color: '#6B7280' },
  tokenValues: { width: '100%' },
  tokenBalance: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.text,
    fontVariant: ['tabular-nums'],
    marginBottom: 2,
  },
  tokenUsd: {
    fontSize: 13,
    color: '#9CA3AF',
    fontVariant: ['tabular-nums'],
  },
  // Settings
  settingsCard: {
    marginHorizontal: SPACING.xl,
    borderRadius: RADIUS.xl,
    backgroundColor: 'rgba(17, 17, 34, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.08)',
    overflow: 'hidden',
    ...Platform.select({
      web: { backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' } as any,
      default: {},
    }),
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  settingIconWrap: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingIcon: { fontSize: 16 },
  settingLabel: { flex: 1, fontSize: FONT_SIZES.lg, color: COLORS.text },
  settingValue: { fontSize: FONT_SIZES.md, color: '#6B7280' },
  devnetBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
  },
  devnetText: { fontSize: 11, fontWeight: '600', color: COLORS.warning },
  settingDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginHorizontal: SPACING.xl,
  },
  disconnectBtn: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginTop: SPACING.xxxl,
  },
  disconnectText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.danger,
  },
  // Custom Disconnect Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxxl,
  },
  modalContent: {
    backgroundColor: '#111122',
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.12)',
  },
  modalEmoji: { fontSize: 36, marginBottom: SPACING.lg },
  modalTitle: {
    fontSize: FONT_SIZES.xxl, fontWeight: '700',
    color: COLORS.text, marginBottom: SPACING.sm, textAlign: 'center',
  },
  modalSub: {
    fontSize: FONT_SIZES.md, color: COLORS.textSecondary,
    textAlign: 'center', marginBottom: SPACING.xxl, lineHeight: 20,
  },
  modalDanger: {
    width: '100%', paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg, backgroundColor: 'rgba(239,68,68,0.12)',
    alignItems: 'center', marginBottom: SPACING.md,
  },
  modalDangerText: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.danger },
  modalCancel: {
    width: '100%', paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  modalCancelText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
  versionText: {
    fontSize: 11,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
});
