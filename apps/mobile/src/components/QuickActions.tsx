import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants';

const ACTIONS = [
  { id: 'send', icon: '↑', label: 'Send', color: COLORS.primary },
  { id: 'split', icon: '✂', label: 'Split', color: COLORS.splitGreen },
  { id: 'stream', icon: '≋', label: 'Stream', color: COLORS.streamBlue },
];

interface Props {
  onAction?: (id: string) => void;
}

export default function QuickActions({ onAction }: Props) {
  return (
    <View style={styles.container}>
      {ACTIONS.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={styles.actionItem}
          activeOpacity={0.7}
          onPress={() => onAction?.(action.id)}
        >
          <View style={[styles.iconCircle, { backgroundColor: action.color + '18' }]}>
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
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    gap: 40,
  },
  actionItem: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 26,
    fontWeight: '700',
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});
