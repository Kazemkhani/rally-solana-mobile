import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, TRUNCATE_ADDRESS } from '../utils/constants';
import { useWalletStore } from '../stores/wallet';

export default function ProfileScreen() {
  const { publicKey, balance, connected } = useWalletStore();

  const settings = [
    { label: 'Notifications', value: 'On', icon: '🔔' },
    { label: 'Default Currency', value: 'SOL', icon: '💰' },
    { label: 'Theme', value: 'Dark', icon: '🌙' },
    { label: 'Language', value: 'English', icon: '🌍' },
    { label: 'SKR Rewards', value: '142 SKR', icon: '⭐' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Avatar & Wallet */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🚀</Text>
          </View>
          <Text style={styles.displayName}>Builder</Text>
          <TouchableOpacity style={styles.addressContainer}>
            <Text style={styles.address}>
              {publicKey ? TRUNCATE_ADDRESS(publicKey, 6) : 'Not connected'}
            </Text>
            <Text style={styles.copyHint}>Tap to copy</Text>
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>{balance.toFixed(4)} SOL</Text>
          <Text style={styles.balanceUsd}>
            ≈ ${(balance * 145).toFixed(2)} USD
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Squads</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>27</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {settings.map((item) => (
            <TouchableOpacity key={item.label} style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>{item.icon}</Text>
                <Text style={styles.settingLabel}>{item.label}</Text>
              </View>
              <Text style={styles.settingValue}>{item.value}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Disconnect */}
        <TouchableOpacity style={styles.disconnectButton} activeOpacity={0.7}>
          <Text style={styles.disconnectText}>Disconnect Wallet</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '700', color: COLORS.text },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: 12,
  },
  avatarText: { fontSize: 36 },
  displayName: { fontSize: 22, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  addressContainer: { alignItems: 'center' },
  address: { fontSize: 14, color: COLORS.textSecondary, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  copyHint: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  balanceCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  balanceLabel: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 4 },
  balanceAmount: { fontSize: 32, fontWeight: '700', color: COLORS.text },
  balanceUsd: { fontSize: 16, color: COLORS.textMuted, marginTop: 4 },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: { fontSize: 24, fontWeight: '700', color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  settingsSection: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: COLORS.text, marginBottom: 12 },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingIcon: { fontSize: 18 },
  settingLabel: { fontSize: 16, color: COLORS.text },
  settingValue: { fontSize: 14, color: COLORS.textSecondary },
  disconnectButton: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  disconnectText: { fontSize: 16, fontWeight: '600', color: COLORS.error },
});

import { Platform } from 'react-native';
