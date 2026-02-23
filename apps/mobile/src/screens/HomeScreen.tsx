import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BalanceDisplay from '../components/BalanceDisplay';
import QuickActions from '../components/QuickActions';
import TransactionItem from '../components/TransactionItem';
import { COLORS } from '../utils/constants';
import { useWalletStore } from '../stores/wallet';
import type { Transaction } from '../types';

// Mock data for demo
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'receive',
    amount: 2.5,
    currency: 'SOL',
    from: '7nYB...x4Kp',
    to: 'me',
    timestamp: Date.now() - 3600000,
    status: 'confirmed',
    memo: 'Dinner split',
  },
  {
    id: '2',
    type: 'send',
    amount: 1.0,
    currency: 'SOL',
    from: 'me',
    to: '3mRk...j2Lq',
    timestamp: Date.now() - 7200000,
    status: 'confirmed',
    memo: 'Movie tickets',
  },
  {
    id: '3',
    type: 'pool',
    amount: 5.0,
    currency: 'SOL',
    from: 'me',
    to: 'Bali Trip Fund',
    timestamp: Date.now() - 86400000,
    status: 'confirmed',
    memo: 'Trip contribution',
  },
  {
    id: '4',
    type: 'stream',
    amount: 0.03,
    currency: 'SOL',
    from: '9pQw...m8Rn',
    to: 'me',
    timestamp: Date.now() - 172800000,
    status: 'confirmed',
    memo: 'Netflix share',
  },
  {
    id: '5',
    type: 'split',
    amount: 3.2,
    currency: 'SOL',
    from: 'Weekend Crew',
    to: 'me',
    timestamp: Date.now() - 259200000,
    status: 'pending',
    memo: 'Groceries',
  },
];

export default function HomeScreen() {
  const { connected, balance } = useWalletStore();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hey, Builder 👋</Text>
          <Text style={styles.subtitle}>Your squad finances at a glance</Text>
        </View>

        {/* Balance */}
        <BalanceDisplay balance={balance} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {MOCK_TRANSACTIONS.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
});
