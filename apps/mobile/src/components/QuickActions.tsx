import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../utils/constants';

const ACTIONS = [
  { id: 'send', icon: '↑', label: 'Send', color: COLORS.primary },
  { id: 'split', icon: '✂', label: 'Split', color: COLORS.success },
  { id: 'pool', icon: '🏦', label: 'Pool', color: COLORS.secondary },
  { id: 'vote', icon: '🗳', label: 'Vote', color: COLORS.warning },
];

export default function QuickActions() {
  return (
    <View style={styles.container}>
      {ACTIONS.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={styles.actionItem}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: action.color + '20' }]}>
            <Text style={[styles.icon, { color: action.color }]}>
              {action.icon}
            </Text>
          </View>
          <Text style={styles.label}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  actionItem: {
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});
