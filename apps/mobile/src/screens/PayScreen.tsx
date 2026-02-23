import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../utils/constants';
import { MOCK_CONTACTS, MOCK_RECEIPT_ITEMS } from '../data/mockData';

type Mode = 'send' | 'split';

export default function PayScreen() {
  const [mode, setMode] = useState<Mode>('send');
  const [amount, setAmount] = useState('0');
  const [currency, setCurrency] = useState<'SOL' | 'USDC'>('USDC');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  const handleDigit = (digit: string) => {
    if (digit === '.' && amount.includes('.')) return;
    if (amount === '0' && digit !== '.') {
      setAmount(digit);
    } else {
      setAmount(amount + digit);
    }
  };

  const handleDelete = () => {
    if (amount.length <= 1) setAmount('0');
    else setAmount(amount.slice(0, -1));
  };

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '←'];

  return (
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
              return (
                <TouchableOpacity
                  key={c.id}
                  style={styles.contactItem}
                  onPress={() => setSelectedContact(c.id)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.contactAvatar,
                    { backgroundColor: c.color + '20' },
                    selected && { borderColor: COLORS.primary, borderWidth: 2 },
                  ]}>
                    <Text style={[styles.contactInitial, { color: c.color }]}>
                      {c.displayName.charAt(0)}
                    </Text>
                  </View>
                  <Text style={[styles.contactName, selected && { color: COLORS.text }]}>
                    {c.displayName}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity style={styles.contactItem}>
              <View style={styles.contactAvatarAdd}>
                <Text style={styles.contactAddIcon}>+</Text>
              </View>
              <Text style={styles.contactName}>Add</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Amount Display */}
          <View style={styles.amountDisplay}>
            {currency === 'USDC' && (
              <Text style={styles.currencyPrefix}>$</Text>
            )}
            <Text style={[
              styles.amountText,
              amount === '0' && styles.amountPlaceholder,
              parseFloat(amount) > 100 && { fontSize: 64 },
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
              <TouchableOpacity
                key={c}
                style={[styles.currencyPill, currency === c && styles.currencyPillActive]}
                onPress={() => setCurrency(c)}
              >
                <Text style={[styles.currencyPillText, currency === c && styles.currencyPillTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Number Pad */}
          <View style={styles.numPad}>
            {digits.map((d) => (
              <TouchableOpacity
                key={d}
                style={styles.numKey}
                onPress={() => d === '←' ? handleDelete() : handleDigit(d)}
                activeOpacity={0.6}
              >
                <Text style={styles.numKeyText}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Send Button */}
          <TouchableOpacity
            style={[styles.sendButton, amount === '0' && styles.sendButtonDisabled]}
            activeOpacity={0.8}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>

          {/* Split Link */}
          <TouchableOpacity onPress={() => setMode('split')} style={styles.splitLink}>
            <Text style={styles.splitLinkText}>or Split with Squad</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* ─── SPLIT MODE ─── */
        <ScrollView contentContainerStyle={styles.splitContent}>
          <TouchableOpacity onPress={() => setMode('send')} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back to Send</Text>
          </TouchableOpacity>

          {/* Amount */}
          <Text style={styles.splitAmount}>
            ${MOCK_RECEIPT_ITEMS.reduce((s, i) => s + i.price, 0).toFixed(2)}
          </Text>

          {/* Scan Receipt */}
          <TouchableOpacity style={styles.scanCard} activeOpacity={0.7}>
            <Text style={styles.scanIcon}>📸</Text>
            <View>
              <Text style={styles.scanTitle}>Scan Receipt</Text>
              <Text style={styles.scanSub}>Tap to scan receipt</Text>
            </View>
          </TouchableOpacity>

          {/* Items */}
          {MOCK_RECEIPT_ITEMS.map((item) => (
            <View key={item.id} style={styles.splitItem}>
              <Text style={styles.splitItemName}>{item.name}</Text>
              <Text style={styles.splitItemPrice}>${item.price.toFixed(2)}</Text>
            </View>
          ))}

          {/* Summary Bar */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.summaryScroll}>
            {MOCK_CONTACTS.slice(0, 3).map((c) => (
              <View key={c.id} style={styles.summaryPill}>
                <Text style={styles.summaryPillText}>
                  {c.displayName}: ${(MOCK_RECEIPT_ITEMS.reduce((s, i) => s + i.price, 0) / 3).toFixed(2)}
                </Text>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.requestBtn} activeOpacity={0.8}>
            <Text style={styles.requestBtnText}>Request Split</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  sendContainer: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
  },
  // Contacts
  contactScroll: {
    maxHeight: 80,
    marginTop: SPACING.lg,
  },
  contactContent: {
    gap: SPACING.lg,
    paddingRight: SPACING.xl,
  },
  contactItem: {
    alignItems: 'center',
    gap: 4,
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInitial: {
    fontSize: 16,
    fontWeight: '700',
  },
  contactAvatarAdd: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
  },
  contactAddIcon: {
    fontSize: 20,
    color: COLORS.textTertiary,
  },
  contactName: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  // Amount
  amountDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl,
  },
  currencyPrefix: {
    fontSize: 40,
    fontWeight: '300',
    color: COLORS.textSecondary,
  },
  amountText: {
    fontSize: FONT_SIZES.hero,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -2,
  },
  amountPlaceholder: {
    color: COLORS.textTertiary,
  },
  currencySuffix: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  // Currency toggle
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
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  currencyPillActive: {
    backgroundColor: COLORS.primarySubtle,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  currencyPillText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  currencyPillTextActive: {
    color: COLORS.primary,
  },
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
  },
  numKeyText: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
  },
  // Send
  sendButton: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.xl,
    backgroundColor: COLORS.primary,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  splitLink: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  splitLinkText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  // Split Mode
  splitContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  backBtn: {
    marginBottom: SPACING.lg,
  },
  backBtnText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  splitAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  scanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.xl,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    backgroundColor: COLORS.primarySubtle,
    marginBottom: SPACING.xxl,
  },
  scanIcon: {
    fontSize: 28,
  },
  scanTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
  },
  scanSub: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  splitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  splitItemName: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
  },
  splitItemPrice: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  summaryScroll: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  summaryPill: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.sm,
  },
  summaryPillText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  requestBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  requestBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
});
