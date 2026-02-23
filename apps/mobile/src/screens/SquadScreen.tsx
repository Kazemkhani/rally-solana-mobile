import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SquadCard from '../components/SquadCard';
import { COLORS } from '../utils/constants';
import type { Squad } from '../types';

const MOCK_SQUADS: Squad[] = [
  {
    id: '1',
    name: 'Weekend Crew',
    members: ['7nYB...x4Kp', '3mRk...j2Lq', '9pQw...m8Rn', 'me'],
    vault: 'VaULt...1234',
    spendThreshold: 1_000_000_000,
    totalDeposited: 15_500_000_000,
    createdAt: Date.now() - 2592000000,
  },
  {
    id: '2',
    name: 'Bali Trip Fund',
    members: ['7nYB...x4Kp', '3mRk...j2Lq', 'me'],
    vault: 'VaULt...5678',
    spendThreshold: 2_000_000_000,
    totalDeposited: 8_200_000_000,
    createdAt: Date.now() - 604800000,
  },
  {
    id: '3',
    name: 'Roommates',
    members: ['3mRk...j2Lq', 'me'],
    vault: 'VaULt...9012',
    spendThreshold: 500_000_000,
    totalDeposited: 3_100_000_000,
    createdAt: Date.now() - 7776000000,
  },
];

export default function SquadScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Squads</Text>
          <Text style={styles.subtitle}>
            {MOCK_SQUADS.length} active squads
          </Text>
        </View>

        <View style={styles.squads}>
          {MOCK_SQUADS.map((squad) => (
            <SquadCard key={squad.id} squad={squad} />
          ))}
        </View>
      </ScrollView>

      {/* FAB - Create Squad */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  squads: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
    gap: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 28,
    color: COLORS.text,
    fontWeight: '300',
    marginTop: -2,
  },
});
