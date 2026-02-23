import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ContactAvatar from '../components/ContactAvatar';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../utils/constants';
import { MOCK_CONTACTS, MOCK_RECEIPT_ITEMS } from '../data/mockData';

type Mode = 'send' | 'split';
type Currency = 'SOL' | 'USDC';

export default function PayScreen() {
  const [mode, setMode] = useState<Mode>('send');
  const [amount, setAmount] = useState('0');
  const [currency, setCurrency] = useState<Currency>('USDC');
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
    if (amount.length <= 1) {
      setAmount('0');
    } else {
      setAmount(amount.slice(0, -1));
    }
  };

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '←'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Mode Toggle */}
      <View style={styles.modeToggle}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'send' && styles.modeBtnActive]}
          onPress={() => setMode('send')}
        >
          <Text style={[styles.modeBtnText, mode === 'send' && styles.modeBtnTextActive]}>
            Send
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'split' && styles.modeBtnActive]}
          onPress={() => setMode('split')}
        >
          <Text style={[styles.modeBtnText, mode === 'split' && styles.modeBtnTextActive]}>
            Split
          </Text>
        </TouchableOpacity>
      </View>

      {mode === 'send' ? (
        /* ─── SEND MODE ─── */
        <View style={styles.sendContainer}>
          {/* Amount Display */}
          <View style={styles.amountDisplay}>
            <Text style={styles.currencyPrefix}>
              {currency === 'USDC' ? '$' : ''}
            </Text>
            <Text style={styles.amountText}>{amount}</Text>
            {currency === 'SOL' && <Text style={styles.currencySuffix}> SOL</Text>}
          </View>

          {/* Currency Toggle */}
          <View style={styles.currencyToggle}>
            <TouchableOpacity
              style={[styles.currencyBtn, currency === 'USDC' && styles.currencyBtnActive]}
              onPress={() => setCurrency('USDC')}
            >
              <Text style={[styles.currencyText, currency === 'USDC' && styles.currencyTextActive]}>USDC</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.currencyBtn, currency === 'SOL' && styles.currencyBtnActive]}
              onPress={() => setCurrency('SOL')}
            >
              <Text style={[styles.currencyText, currency === 'SOL' && styles.currencyTextActive]}>SOL</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Contacts */}
          <Text style={styles.contactsLabel}>Recent</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.contactsScroll}
            contentContainerStyle={styles.contactsContent}
          >
            {MOCK_CONTACTS.map((contact) => (
              <ContactAvatar
                key={contact.id}
                name={contact.displayName}
                avatar={contact.avatar}
                color={selectedContact === contact.id ? COLORS.primary : contact.color}
                size={52}
                onPress={() => setSelectedContact(contact.id)}
              />
            ))}
          </ScrollView>

          {/* Number Pad */}
          <View style={styles.numPad}>
            {digits.map((digit) => (
              <TouchableOpacity
                key={digit}
                style={styles.numKey}
                onPress={() => digit === '←' ? handleDelete() : handleDigit(digit)}
                activeOpacity={0.6}
              >
                <Text style={styles.numKeyText}>{digit}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Send Button */}
          <TouchableOpacity
            style={[styles.sendButton, amount === '0' && styles.sendButtonDisabled]}
            activeOpacity={0.8}
          >
            <Text style={styles.sendButtonText}>
              Send {currency === 'USDC' ? '$' : ''}{amount} {currency === 'SOL' ? 'SOL' : ''}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* ─── SPLIT MODE ─── */
        <ScrollView style={styles.splitContainer} contentContainerStyle={styles.splitContent}>
          {/* Scan Receipt Button */}
          <TouchableOpacity style={styles.scanButton} activeOpacity={0.7}>
            <Text style={styles.scanIcon}>📸</Text>
            <View>
              <Text style={styles.scanTitle}>Scan Receipt</Text>
              <Text style={styles.scanSubtitle}>Take a photo to auto-split</Text>
            </View>
          </TouchableOpacity>

          {/* Receipt Items */}
          <Text style={styles.splitSectionTitle}>Receipt Items</Text>
          {MOCK_RECEIPT_ITEMS.map((item) => (
            <View key={item.id} style={styles.receiptItem}>
              <View style={styles.receiptItemInfo}>
                <Text style={styles.receiptItemName}>{item.name}</Text>
                <Text style={styles.receiptItemPrice}>${item.price.toFixed(2)}</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.assignRow}>
                  {MOCK_CONTACTS.slice(0, 3).map((contact) => {
                    const isAssigned = item.assignedTo.includes(contact.id);
                    return (
                      <View
                        key={contact.id}
                        style={[
                          styles.assignAvatar,
                          { backgroundColor: isAssigned ? contact.color + '30' : COLORS.surfaceLight },
                          isAssigned && { borderColor: contact.color, borderWidth: 2 },
                        ]}
                      >
                        <Text style={{ fontSize: 14 }}>{contact.avatar}</Text>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          ))}

          {/* Split Summary */}
          <View style={styles.splitSummary}>
            <View style={styles.splitSummaryRow}>
              <Text style={styles.splitSummaryLabel}>Total</Text>
              <Text style={styles.splitSummaryValue}>
                ${MOCK_RECEIPT_ITEMS.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
              </Text>
            </View>
            <View style={styles.splitSummaryRow}>
              <Text style={styles.splitSummaryLabel}>Your share</Text>
              <Text style={[styles.splitSummaryValue, { color: COLORS.primary }]}>
                ${(MOCK_RECEIPT_ITEMS.reduce((sum, item) => sum + item.price, 0) / 3).toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Send Split Request */}
          <TouchableOpacity style={styles.splitButton} activeOpacity={0.8}>
            <Text style={styles.splitButtonText}>Send Split Request</Text>
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
  // ─── Mode Toggle ───
  modeToggle: {
    flexDirection: 'row',
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xs,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  modeBtnActive: {
    backgroundColor: COLORS.primary,
  },
  modeBtnText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  modeBtnTextActive: {
    color: COLORS.text,
  },
  // ─── Send Mode ───
  sendContainer: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
  },
  amountDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.lg,
  },
  currencyPrefix: {
    fontSize: 36,
    fontWeight: '300',
    color: COLORS.textMuted,
  },
  amountText: {
    fontSize: FONT_SIZES.hero,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -2,
  },
  currencySuffix: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  currencyToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  currencyBtn: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
  },
  currencyBtnActive: {
    backgroundColor: COLORS.primary + '20',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  currencyText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  currencyTextActive: {
    color: COLORS.primary,
  },
  contactsLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  contactsScroll: {
    maxHeight: 80,
    marginBottom: SPACING.lg,
  },
  contactsContent: {
    gap: SPACING.md,
  },
  // ─── Number Pad ───
  numPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  numKey: {
    width: '30%',
    aspectRatio: 2.2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
  },
  numKeyText: {
    fontSize: 26,
    fontWeight: '500',
    color: COLORS.text,
  },
  // ─── Send Button ───
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  // ─── Split Mode ───
  splitContainer: {
    flex: 1,
  },
  splitContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.splitGreen + '12',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.splitGreen + '30',
    marginBottom: SPACING.xl,
  },
  scanIcon: {
    fontSize: 32,
  },
  scanTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  scanSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  splitSectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  receiptItem: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  receiptItemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  receiptItemName: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    fontWeight: '500',
  },
  receiptItemPrice: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    fontWeight: '700',
  },
  assignRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  assignAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splitSummary: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  splitSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  splitSummaryLabel: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
  },
  splitSummaryValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  splitButton: {
    backgroundColor: COLORS.splitGreen,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  splitButtonText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
});
