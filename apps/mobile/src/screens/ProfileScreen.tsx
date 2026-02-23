import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, FONT_SIZES, TRUNCATE_ADDRESS, APP_VERSION } from '../utils/constants';
import { useWalletStore } from '../stores/wallet';
import { MOCK_TOKEN_BALANCES, MOCK_USER } from '../data/mockData';

export default function ProfileScreen() {
  const { publicKey, balance, usdcBalance, connected, disconnect } = useWalletStore();
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Avatar & Wallet */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>🚀</Text>
            </View>
            <View style={styles.statusDot} />
          </View>
          <Text style={styles.displayName}>{MOCK_USER.displayName}</Text>
          <TouchableOpacity style={styles.addressContainer} activeOpacity={0.6}>
            {connected ? (
              <>
                <View style={styles.connectedBadge}>
                  <View style={styles.connectedDot} />
                  <Text style={styles.connectedText}>Connected</Text>
                </View>
                <Text style={styles.address}>
                  {publicKey ? TRUNCATE_ADDRESS(publicKey, 6) : ''}
                </Text>
              </>
            ) : (
              <View style={styles.connectBtn}>
                <Text style={styles.connectBtnText}>Connect Wallet</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{MOCK_USER.squads.length}</Text>
            <Text style={styles.statLabel}>Squads</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>27</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>🔥 {MOCK_USER.streakDays}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        {/* Token Balances */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Token Balances</Text>
          {MOCK_TOKEN_BALANCES.map((token) => (
            <View key={token.symbol} style={styles.tokenCard}>
              <View style={[styles.tokenIcon, { backgroundColor: token.color + '18' }]}>
                <Text style={[styles.tokenIconText, { color: token.color }]}>{token.icon}</Text>
              </View>
              <View style={styles.tokenInfo}>
                <Text style={styles.tokenName}>{token.name}</Text>
                <Text style={styles.tokenSymbol}>{token.symbol}</Text>
              </View>
              <View style={styles.tokenBalance}>
                <Text style={styles.tokenAmount}>{token.balance.toLocaleString()}</Text>
                <Text style={styles.tokenUsd}>
                  ${token.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔔</Text>
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: COLORS.surfaceLight, true: COLORS.primary + '50' }}
              thumbColor={notifications ? COLORS.primary : COLORS.textMuted}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔒</Text>
              <Text style={styles.settingLabel}>Biometric Auth</Text>
            </View>
            <Switch
              value={biometrics}
              onValueChange={setBiometrics}
              trackColor={{ false: COLORS.surfaceLight, true: COLORS.primary + '50' }}
              thumbColor={biometrics ? COLORS.primary : COLORS.textMuted}
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>💰</Text>
              <Text style={styles.settingLabel}>Default Currency</Text>
            </View>
            <Text style={styles.settingValue}>SOL</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🌙</Text>
              <Text style={styles.settingLabel}>Theme</Text>
            </View>
            <Text style={styles.settingValue}>Dark</Text>
          </TouchableOpacity>
        </View>

        {/* Disconnect Wallet */}
        {connected && (
          <TouchableOpacity style={styles.disconnectButton} activeOpacity={0.7} onPress={disconnect}>
            <Text style={styles.disconnectText}>Disconnect Wallet</Text>
          </TouchableOpacity>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Rally v{APP_VERSION}</Text>
          <Text style={styles.footerText}>Built on Solana ◎</Text>
        </View>
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
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  // ─── Profile Card ───
  profileCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '18',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarText: {
    fontSize: 36,
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.success,
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  displayName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  addressContainer: {
    alignItems: 'center',
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
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
  address: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  connectBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
  },
  connectBtnText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  // ─── Stats ───
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  statItem: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  // ─── Tokens ───
  section: {
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  tokenCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tokenIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  tokenIconText: {
    fontSize: 20,
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
    color: COLORS.textMuted,
    marginTop: 1,
  },
  tokenBalance: {
    alignItems: 'flex-end',
  },
  tokenAmount: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  tokenUsd: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  // ─── Settings ───
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  settingIcon: {
    fontSize: 18,
  },
  settingLabel: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
  },
  settingValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  // ─── Disconnect ───
  disconnectButton: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.xxl,
    backgroundColor: COLORS.error + '12',
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.error + '30',
  },
  disconnectText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.error,
  },
  // ─── Footer ───
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    gap: SPACING.xs,
  },
  footerText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
});
