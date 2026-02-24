import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AnimReanimated, { FadeInDown } from 'react-native-reanimated';
import ScreenWrapper from '../components/ScreenWrapper';
import AnimatedPressable from '../components/AnimatedPressable';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../utils/constants';
import { MOCK_CONTACTS, MOCK_RECEIPT_ITEMS } from '../data/mockData';

type Mode = 'send' | 'split';

const AVATAR_GRADIENTS: [string, string][] = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#ffd700', '#ff8c00'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#4facfe', '#00f2fe'],
  ['#a18cd1', '#fbc2eb'],
];

export default function PayScreen() {
  const [mode, setMode] = useState<Mode>('send');
  const [amount, setAmount] = useState('0');
  const [currency, setCurrency] = useState<'SOL' | 'USDC'>('USDC');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  const rippleAnims = useRef(
    Array.from({ length: 12 }, () => new Animated.Value(0))
  ).current;

  const handleDigit = (digit: string, index: number) => {
    if (digit === '.' && amount.includes('.')) return;
    if (amount === '0' && digit !== '.') setAmount(digit);
    else setAmount(amount + digit);

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
            {/* Contact Row — with proper spacing */}
            <AnimReanimated.View entering={FadeInDown.delay(0).duration(400)}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.contactScroll}
                contentContainerStyle={styles.contactContent}
              >
                {MOCK_CONTACTS.map((c, idx) => {
                  const selected = selectedContact === c.id;
                  const gradient = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length];
                  return (
                    <AnimatedPressable
                      key={c.id}
                      scaleDepth={0.92}
                      style={styles.contactItem}
                      onPress={() => setSelectedContact(c.id)}
                    >
                      <LinearGradient
                        colors={gradient}
                        style={[
                          styles.contactAvatar,
                          selected && styles.contactAvatarSelected,
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Text style={styles.contactInitial}>
                          {c.displayName.charAt(0)}
                        </Text>
                      </LinearGradient>
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
            </AnimReanimated.View>

            {/* Amount Display */}
            <AnimReanimated.View
              entering={FadeInDown.delay(100).duration(500).springify()}
              style={styles.amountDisplay}
            >
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
            </AnimReanimated.View>

            {/* Currency Toggle */}
            <AnimReanimated.View
              entering={FadeInDown.delay(150).duration(400)}
              style={styles.currencyToggle}
            >
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
            </AnimReanimated.View>

            {/* Number Pad */}
            <AnimReanimated.View
              entering={FadeInDown.delay(200).duration(400).springify()}
              style={styles.numPad}
            >
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
                        inputRange: [0, 0.5, 1], outputRange: [0, 0.1, 0],
                      }),
                      transform: [{
                        scale: rippleAnims[i].interpolate({
                          inputRange: [0, 1], outputRange: [0.5, 1.2],
                        }),
                      }],
                    },
                  ]} />
                  <Text style={styles.numKeyText}>{d}</Text>
                </TouchableOpacity>
              ))}
            </AnimReanimated.View>

            {/* Send Button */}
            <AnimReanimated.View entering={FadeInDown.delay(300).duration(400)}>
              <AnimatedPressable
                scaleDepth={0.93}
                style={[styles.sendButton, amount === '0' && styles.sendButtonDisabled]}
                disabled={amount === '0'}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.sendButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.sendButtonText}>
                    {selectedContact ? `Send to ${MOCK_CONTACTS.find(c => c.id === selectedContact)?.displayName || 'Contact'}` : 'Send'}
                  </Text>
                </LinearGradient>
              </AnimatedPressable>
            </AnimReanimated.View>

            {/* Split Link */}
            <TouchableOpacity onPress={() => setMode('split')} style={styles.splitLink}>
              <Text style={styles.splitLinkText}>or Split with Squad →</Text>
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
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.sendButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.sendButtonText}>Request Split</Text>
              </LinearGradient>
            </AnimatedPressable>
          </ScrollView>
        )}
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sendContainer: { flex: 1, paddingHorizontal: SPACING.xl },
  // Contacts — fixed clipping
  contactScroll: { maxHeight: 90, marginTop: SPACING.xl, marginBottom: SPACING.sm },
  contactContent: { gap: SPACING.lg, paddingRight: SPACING.xl, paddingTop: 4 },
  contactItem: { alignItems: 'center', gap: 4 },
  contactAvatar: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  contactAvatarSelected: {
    borderWidth: 2.5, borderColor: COLORS.primary,
  },
  contactInitial: {
    fontSize: 17, fontWeight: '700', color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  contactAvatarAdd: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
  },
  contactAddIcon: { fontSize: 20, color: '#4B5563' },
  contactName: { fontSize: 11, color: '#6B7280', fontWeight: '500' },
  // Amount
  amountDisplay: {
    flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center',
    paddingVertical: SPACING.xxxl,
  },
  currencyPrefix: { fontSize: 36, fontWeight: '300', color: '#4B5563' },
  amountText: {
    fontSize: FONT_SIZES.hero, fontWeight: '800', color: COLORS.text,
    letterSpacing: -2, fontVariant: ['tabular-nums'],
  },
  amountPlaceholder: { color: '#3B3B5C' },
  currencySuffix: { fontSize: 22, fontWeight: '600', color: '#6B7280' },
  // Currency
  currencyToggle: {
    flexDirection: 'row', justifyContent: 'center', gap: SPACING.sm,
    marginBottom: SPACING.xxl,
  },
  currencyPill: {
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.03)',
  },
  currencyPillActive: {
    borderWidth: 1, borderColor: 'rgba(139,92,246,0.3)',
    backgroundColor: 'rgba(139,92,246,0.06)',
  },
  currencyPillText: { fontSize: FONT_SIZES.md, fontWeight: '600', color: '#6B7280' },
  currencyPillTextActive: { color: COLORS.primary },
  // NumPad
  numPad: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',
    gap: SPACING.xs,
  },
  numKey: {
    width: '30%', aspectRatio: 2.2,
    alignItems: 'center', justifyContent: 'center',
    borderRadius: RADIUS.md, position: 'relative', overflow: 'hidden',
  },
  numKeyRipple: {
    position: 'absolute', width: 52, height: 52, borderRadius: 26,
    backgroundColor: COLORS.primary,
  },
  numKeyText: { fontSize: 26, fontWeight: '500', color: COLORS.text },
  // Send
  sendButton: {
    borderRadius: RADIUS.xl, marginTop: SPACING.xl, overflow: 'hidden',
  },
  sendButtonDisabled: { opacity: 0.35 },
  sendButtonGradient: {
    padding: SPACING.lg, alignItems: 'center', borderRadius: RADIUS.xl,
  },
  sendButtonText: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  splitLink: { alignItems: 'center', paddingVertical: SPACING.md },
  splitLinkText: { fontSize: FONT_SIZES.md, color: COLORS.primary, fontWeight: '600' },
  // Split
  splitContent: {
    paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  backBtn: { marginBottom: SPACING.lg },
  backBtnText: { fontSize: FONT_SIZES.md, color: COLORS.primary, fontWeight: '600' },
  splitAmount: {
    fontSize: 32, fontWeight: '800', color: COLORS.text,
    textAlign: 'center', marginBottom: SPACING.xxl, fontVariant: ['tabular-nums'],
  },
  scanCard: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    padding: SPACING.xl, borderRadius: RADIUS.xl,
    borderWidth: 1, borderColor: 'rgba(139,92,246,0.3)',
    borderStyle: 'dashed', backgroundColor: 'rgba(139,92,246,0.04)',
    marginBottom: SPACING.xxl,
  },
  scanIcon: { fontSize: 28 },
  scanTitle: { fontSize: FONT_SIZES.xl, fontWeight: '600', color: COLORS.text },
  scanSub: { fontSize: 12, color: '#4B5563', marginTop: 2 },
  splitItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  splitItemName: { fontSize: FONT_SIZES.lg, color: COLORS.text },
  splitItemPrice: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text, fontVariant: ['tabular-nums'] },
  summaryScroll: { marginTop: SPACING.xl, marginBottom: SPACING.xl },
  summaryPill: {
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.04)',
    marginRight: SPACING.sm,
  },
  summaryPillText: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.text, fontVariant: ['tabular-nums'] },
  requestBtn: { borderRadius: RADIUS.xl, overflow: 'hidden' },
});
