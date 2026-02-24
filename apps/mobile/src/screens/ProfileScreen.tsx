import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch,
  Platform, Alert, Animated, Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenWrapper from '../components/ScreenWrapper';
import AnimatedPressable from '../components/AnimatedPressable';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../utils/constants';
import { MOCK_USER } from '../data/mockData';
import { useWalletStore } from '../stores/wallet';

export default function ProfileScreen() {
  const { balance, usdcBalance, skrBalance, disconnect } = useWalletStore();
  const [biometrics, setBiometrics] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [copied, setCopied] = useState(false);

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
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDisconnect = () => {
    Alert.alert('Disconnect', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Disconnect', style: 'destructive', onPress: disconnect },
    ]);
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
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
          {tokenData.map((token, i) => (
            <AnimatedPressable
              key={token.symbol}
              scaleDepth={0.99}
              opacityDepth={0.9}
              style={[styles.tokenRow, i < tokenData.length - 1 && styles.tokenRowBorder]}
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

          {/* Settings */}
          <Text style={[styles.sectionTitle, { marginTop: SPACING.xxxl }]}>Settings</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingIcon}>🔐</Text>
            <Text style={styles.settingLabel}>Biometric Lock</Text>
            <Switch
              value={biometrics}
              onValueChange={setBiometrics}
              trackColor={{ false: '#1A1A35', true: 'rgba(139,92,246,0.4)' }}
              thumbColor={biometrics ? COLORS.primary : '#4B5563'}
            />
          </View>
          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <Text style={styles.settingIcon}>🔔</Text>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#1A1A35', true: 'rgba(139,92,246,0.4)' }}
              thumbColor={notifications ? COLORS.primary : '#4B5563'}
            />
          </View>
          <View style={styles.settingDivider} />

          <AnimatedPressable scaleDepth={0.99} opacityDepth={0.9} style={styles.settingRow}>
            <Text style={styles.settingIcon}>⚙️</Text>
            <Text style={styles.settingLabel}>Network</Text>
            <Text style={styles.settingValue}>Devnet</Text>
          </AnimatedPressable>

          {/* Disconnect */}
          <AnimatedPressable scaleDepth={0.93} style={styles.disconnectBtn} onPress={handleDisconnect}>
            <Text style={styles.disconnectText}>Disconnect Wallet</Text>
          </AnimatedPressable>

          <Text style={styles.versionText}>Rally v0.1.0 · Powered by Solana</Text>
        </ScrollView>
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
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  avatarRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 44,
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
    borderTopLeftRadius: 44,
    borderTopRightRadius: 44,
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
    borderBottomLeftRadius: 44,
    borderBottomRightRadius: 44,
  },
  avatarInner: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#111122',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 36 },
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
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  tokenRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  tokenIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  tokenIconText: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  tokenInfo: { flex: 1 },
  tokenName: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.text },
  tokenSymbol: { fontSize: 12, color: '#4B5563', marginTop: 1 },
  tokenValues: { alignItems: 'flex-end' },
  tokenBalance: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    fontVariant: ['tabular-nums'],
  },
  tokenUsd: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 1,
    fontVariant: ['tabular-nums'],
  },
  // Settings
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  settingIcon: { fontSize: 18, marginRight: SPACING.md },
  settingLabel: { flex: 1, fontSize: FONT_SIZES.lg, color: COLORS.text },
  settingValue: { fontSize: FONT_SIZES.md, color: '#6B7280' },
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
  versionText: {
    fontSize: 11,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
});
