import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../utils/constants';
import { MOCK_TOKEN_BALANCES, MOCK_USER } from '../data/mockData';
import { useWalletStore } from '../stores/wallet';

export default function ProfileScreen() {
  const { balance, usdcBalance, skrBalance, disconnect, connected } = useWalletStore();
  const [biometrics, setBiometrics] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const tokenData = [
    { symbol: 'SOL', name: 'Solana', balance: balance, usdValue: balance * 145, color: '#9945FF', icon: '◎' },
    { symbol: 'USDC', name: 'USD Coin', balance: usdcBalance, usdValue: usdcBalance, color: '#2775CA', icon: '$' },
    { symbol: 'SKR', name: 'Seeker', balance: skrBalance, usdValue: skrBalance * 0.20, color: '#F59E0B', icon: '✦' },
  ];

  const handleDisconnect = () => {
    Alert.alert('Disconnect', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Disconnect', style: 'destructive', onPress: disconnect },
    ]);
  };

  const copyAddress = () => {
    Alert.alert('Copied', 'Wallet address copied to clipboard');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarRing}>
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

          <TouchableOpacity onPress={copyAddress} style={styles.addressRow}>
            <Text style={styles.addressText}>
              {MOCK_USER.pubkey.slice(0, 6)}...{MOCK_USER.pubkey.slice(-6)}
            </Text>
            <Text style={styles.copyIcon}>📋</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
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
          <View key={token.symbol} style={[styles.tokenRow, i < tokenData.length - 1 && styles.tokenRowBorder]}>
            <View style={[styles.tokenIcon, { backgroundColor: token.color + '18' }]}>
              <Text style={[styles.tokenIconText, { color: token.color }]}>{token.icon}</Text>
            </View>
            <View style={styles.tokenInfo}>
              <Text style={styles.tokenName}>{token.name}</Text>
              <Text style={styles.tokenSymbol}>{token.symbol}</Text>
            </View>
            <View style={styles.tokenValues}>
              <Text style={styles.tokenBalance}>{token.balance.toLocaleString('en-US', { maximumFractionDigits: 2 })}</Text>
              <Text style={styles.tokenUsd}>${token.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
            </View>
          </View>
        ))}

        {/* Settings */}
        <Text style={[styles.sectionTitle, { marginTop: SPACING.xxxl }]}>Settings</Text>

        <View style={styles.settingRow}>
          <Text style={styles.settingIcon}>🔐</Text>
          <Text style={styles.settingLabel}>Biometric Lock</Text>
          <Switch
            value={biometrics}
            onValueChange={setBiometrics}
            trackColor={{ false: '#333', true: COLORS.primary + '60' }}
            thumbColor={biometrics ? COLORS.primary : '#666'}
          />
        </View>
        <View style={styles.settingDivider} />

        <View style={styles.settingRow}>
          <Text style={styles.settingIcon}>🔔</Text>
          <Text style={styles.settingLabel}>Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#333', true: COLORS.primary + '60' }}
            thumbColor={notifications ? COLORS.primary : '#666'}
          />
        </View>
        <View style={styles.settingDivider} />

        <TouchableOpacity style={styles.settingRow}>
          <Text style={styles.settingIcon}>⚙️</Text>
          <Text style={styles.settingLabel}>Network</Text>
          <Text style={styles.settingValue}>Devnet</Text>
        </TouchableOpacity>

        {/* Disconnect */}
        <TouchableOpacity style={styles.disconnectBtn} onPress={handleDisconnect}>
          <Text style={styles.disconnectText}>Disconnect Wallet</Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.versionText}>Rally v0.1.0 · Powered by Solana</Text>
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
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  // Profile Header
  profileHeader: {
    alignItems: 'center',
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xl,
  },
  avatarRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  avatarInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 36,
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.background,
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
    marginBottom: SPACING.sm,
  },
  connectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  connectedText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.success,
    fontWeight: '500',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  addressText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  copyIcon: {
    fontSize: 12,
  },
  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.xl,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.divider,
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
    borderBottomColor: COLORS.divider,
  },
  tokenIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  tokenIconText: {
    fontSize: 18,
    fontWeight: '700',
  },
  tokenInfo: {
    flex: 1,
  },
  tokenName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  tokenSymbol: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  tokenValues: {
    alignItems: 'flex-end',
  },
  tokenBalance: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  tokenUsd: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  // Settings
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  settingIcon: {
    fontSize: 18,
    marginRight: SPACING.md,
  },
  settingLabel: {
    flex: 1,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
  },
  settingValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  settingDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginHorizontal: SPACING.xl,
  },
  // Disconnect
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
  // Footer
  versionText: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
});
