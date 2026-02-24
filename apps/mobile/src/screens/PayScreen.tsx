import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenWrapper from '../components/ScreenWrapper';
import AnimatedPressable from '../components/AnimatedPressable';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../utils/constants';
import { MOCK_CONTACTS, MOCK_RECEIPT_ITEMS } from '../data/mockData';

type Mode = 'send' | 'split';

const AVATAR_COLORS: Record<string, string> = {
  A: '#667eea', M: '#f093fb', J: '#ffd700', S: '#43e97b', R: '#fa709a', T: '#4facfe',
};

export default function PayScreen() {
  const [mode, setMode] = useState<Mode>('send');
  const [amount, setAmount] = useState('0');
  const [currency, setCurrency] = useState<'SOL' | 'USDC'>('USDC');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  // Numpad ripple anims
  const rippleAnims = useRef(
    Array.from({ length: 12 }, () => new Animated.Value(0))
  ).current;

  const handleDigit = (digit: string, index: number) => {
    if (digit === '.' && amount.includes('.')) return;
    if (amount === '0' && digit !== '.') setAmount(digit);
    else setAmount(amount + digit);

    // Ripple feedback
    Animated.sequence([
      Animated.timing(rippleAnims[index], {
        toValue: 1, duration: 120, useNativeDriver: true,
      }),
      Animated.timing(rippleAnims[index], {
        toValue: 0, duration: 180, useNativeDriver: true,
      }),
    ]).start();
  };

  const handleDelete = (index: number) => {
    if (amount.length <= 1) setAmount('0');
    else setAmount(amount.slice(0, -1));

    Animated.sequence([
      Animated.timing(rippleAnims[index], {
        toValue: 1, duration: 120, useNativeDriver: true,
      }),
      Animated.timing(rippleAnims[index], {
        toValue: 0, duration: 180, useNativeDriver: true,
      }),
    ]).start();
  };

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '←'];

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container} edges={['top']}>
        {mode === 'send' ? (
          <View style={styles.sendContainer}>
            {/* Contact Row */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.contactScroll}
              contentContainerStyle={styles.contactContent}
            >
              {MOCK_CONTACTS.map((c) => {
                const selected = selectedContact === c.id;
                const color = AVATAR_COLORS[c.displayName.charAt(0)] || c.color;
                return (
                  <AnimatedPressable
                    key={c.id}
                    scaleDepth={0.92}
                    style={styles.contactItem}
                    onPress={() => setSelectedContact(c.id)}
                  >
                    <View style={[
                      styles.contactAvatar,
                      { backgroundColor: color },
                      selected && styles.contactAvatarSelected,
                    ]}>
                      <Text style={styles.contactInitial}>
                        {c.displayName.charAt(0)}
                      </Text>
                    </View>
                    <Text style={[styles.contactName, selected && { color: COLORS.text }]}>
                      {c.displayName}
                    </Text>
                  </AnimatedPressable>
                );
              })}
              <View style={styles.contactItem}>
                <View style={styles.contactAvatarAdd}>
                  <Text style={styles.contactAddIcon}>+</Text>
                </View>
                <Text style={styles.contactName}>Add</Text>
              </View>
            </ScrollView>

            {/* Amount Display — Giant hero number */}
            <View style={styles.amountDisplay}>
              {currency === 'USDC' && (
                <Text style={styles.currencyPrefix}>$</Text>
              )}
              <Text style={[
                styles.amountText,
                amount === '0' && styles.amountPlaceholder,
                parseFloat(amount) > 999 && { fontSize: 52 },
              ]}>
                {amount}
              </Text>
              {currency === 'SOL' && (
                <Text style={styles.currencySuffix}> SOL</Text>
              )}
            </View>

            {/* Currency Toggle */}
            <View style={styles.currencyToggle}>
              {(['USDC', 'SOL'] as const).map((c) => (
                <AnimatedPressable
                  key={c}
                  scaleDepth={0.93}
                  style={[styles.currencyPill, currency === c && styles.currencyPillActive]}
                  onPress={() => setCurrency(c)}
                >
                  <Text style={[styles.currencyPillText, currency === c && styles.currencyPillTextActive]}>
                    {c}
                  </Text>
                </AnimatedPressable>
              ))}
            </View>

            {/* Number Pad with ripple */}
            <View style={styles.numPad}>
              {digits.map((d, i) => (
                <TouchableOpacity
                  key={d}
                  style={styles.numKey}
                  onPress={() => d === '←' ? handleDelete(i) : handleDigit(d, i)}
                  activeOpacity={1}
                >
                  <Animated.View style={[
                    styles.numKeyRipple,
                    {
                      opacity: rippleAnims[i].interpolate({
                        inputRange: [0, 0.5, 1], outputRange: [0, 0.08, 0],
                      }),
                      transform: [{
                        scale: rippleAnims[i].interpolate({
                          inputRange: [0, 1], outputRange: [0.5, 1],
                        }),
                      }],
                    },
                  ]} />
                  <Text style={styles.numKeyText}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Send Button */}
            <AnimatedPressable
              scaleDepth={0.93}
              style={[styles.sendButton, amount === '0' && styles.sendButtonDisabled]}
              disabled={amount === '0'}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </AnimatedPressable>

            {/* Split Link */}
            <TouchableOpacity onPress={() => setMode('split')} style={styles.splitLink}>
              <Text style={styles.splitLinkText}>or Split with Squad</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.splitContent}>
            <TouchableOpacity onPress={() => setMode('send')} style={styles.backBtn}>
              <Text style={styles.backBtnText}>← Back to Send</Text>
            </TouchableOpacity>

            <Text style={styles.splitAmount}>
              ${MOCK_RECEIPT_ITEMS.reduce((s, i) => s + i.price, 0).toFixed(2)}
            </Text>

            <AnimatedPressable scaleDepth={0.97} style={styles.scanCard}>
              <Text style={styles.scanIcon}>📸</Text>
              <View>
                <Text style={styles.scanTitle}>Scan Receipt</Text>
                <Text style={styles.scanSub}>Tap to scan receipt</Text>
              </View>
            </AnimatedPressable>

            {MOCK_RECEIPT_ITEMS.map((item) => (
              <View key={item.id} style={styles.splitItem}>
                <Text style={styles.splitItemName}>{item.name}</Text>
                <Text style={styles.splitItemPrice}>${item.price.toFixed(2)}</Text>
              </View>
            ))}

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.summaryScroll}>
              {MOCK_CONTACTS.slice(0, 3).map((c) => (
                <View key={c.id} style={styles.summaryPill}>
                  <Text style={styles.summaryPillText}>
                    {c.displayName}: ${(MOCK_RECEIPT_ITEMS.reduce((s, i) => s + i.price, 0) / 3).toFixed(2)}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <AnimatedPressable scaleDepth={0.93} style={styles.requestBtn}>
              <Text style={styles.requestBtnText}>Request Split</Text>
            </AnimatedPressable>
          </ScrollView>
        )}
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sendContainer: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
  },
  // Contacts
  contactScroll: { maxHeight: 80, marginTop: SPACING.lg },
  contactContent: { gap: SPACING.lg, paddingRight: SPACING.xl },
  contactItem: { alignItems: 'center', gap: 4 },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactAvatarSelected: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  contactInitial: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  contactAvatarAdd: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactAddIcon: { fontSize: 20, color: '#4B5563' },
  contactName: { fontSize: 11, color: '#6B7280', fontWeight: '500' },
  // Amount
  amountDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl,
  },
  currencyPrefix: { fontSize: 36, fontWeight: '300', color: '#4B5563' },
  amountText: {
    fontSize: FONT_SIZES.hero,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
  },
  amountPlaceholder: { color: '#4B5563' },
  currencySuffix: { fontSize: 22, fontWeight: '600', color: '#6B7280' },
  // Currency
  currencyToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xxl,
  },
  currencyPill: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  currencyPillActive: {
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.3)',
    backgroundColor: 'rgba(139,92,246,0.06)',
  },
  currencyPillText: { fontSize: FONT_SIZES.md, fontWeight: '600', color: '#6B7280' },
  currencyPillTextActive: { color: COLORS.primary },
  // NumPad
  numPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  numKey: {
    width: '30%',
    aspectRatio: 2.2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
    position: 'relative',
    overflow: 'hidden',
  },
  numKeyRipple: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
  },
  numKeyText: { fontSize: 24, fontWeight: '600', color: COLORS.text },
  // Send
  sendButton: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.xl,
    backgroundColor: COLORS.primary,
  },
  sendButtonDisabled: { opacity: 0.35 },
  sendButtonText: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  splitLink: { alignItems: 'center', paddingVertical: SPACING.md },
  splitLinkText: { fontSize: FONT_SIZES.md, color: COLORS.primary, fontWeight: '600' },
  // Split
  splitContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  backBtn: { marginBottom: SPACING.lg },
  backBtnText: { fontSize: FONT_SIZES.md, color: COLORS.primary, fontWeight: '600' },
  splitAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    fontVariant: ['tabular-nums'],
  },
  scanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.xl,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.3)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(139,92,246,0.04)',
    marginBottom: SPACING.xxl,
  },
  scanIcon: { fontSize: 28 },
  scanTitle: { fontSize: FONT_SIZES.xl, fontWeight: '600', color: COLORS.text },
  scanSub: { fontSize: 12, color: '#4B5563', marginTop: 2 },
  splitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  splitItemName: { fontSize: FONT_SIZES.lg, color: COLORS.text },
  splitItemPrice: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text, fontVariant: ['tabular-nums'] },
  summaryScroll: { marginTop: SPACING.xl, marginBottom: SPACING.xl },
  summaryPill: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginRight: SPACING.sm,
  },
  summaryPillText: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.text, fontVariant: ['tabular-nums'] },
  requestBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  requestBtnText: { fontSize: 17, fontWeight: '700', color: COLORS.text },
});
