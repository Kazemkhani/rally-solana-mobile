import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../utils/constants';

type Currency = 'SOL' | 'USDC';

export default function PayScreen() {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [memo, setMemo] = useState('');
  const [currency, setCurrency] = useState<Currency>('SOL');
  const [sending, setSending] = useState(false);

  const handlePay = async () => {
    if (!amount || !recipient) return;
    setSending(true);
    // TODO: Integrate with useSolana().sendSOL()
    setTimeout(() => setSending(false), 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <Text style={styles.title}>Send Payment</Text>

        {/* Amount Input */}
        <View style={styles.amountContainer}>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="decimal-pad"
            maxLength={10}
          />
          {/* Currency Toggle */}
          <View style={styles.currencyToggle}>
            <TouchableOpacity
              style={[
                styles.currencyBtn,
                currency === 'SOL' && styles.currencyBtnActive,
              ]}
              onPress={() => setCurrency('SOL')}
            >
              <Text
                style={[
                  styles.currencyText,
                  currency === 'SOL' && styles.currencyTextActive,
                ]}
              >
                SOL
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.currencyBtn,
                currency === 'USDC' && styles.currencyBtnActive,
              ]}
              onPress={() => setCurrency('USDC')}
            >
              <Text
                style={[
                  styles.currencyText,
                  currency === 'USDC' && styles.currencyTextActive,
                ]}
              >
                USDC
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recipient */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>To</Text>
          <TextInput
            style={styles.input}
            value={recipient}
            onChangeText={setRecipient}
            placeholder="Wallet address or squad member"
            placeholderTextColor={COLORS.textMuted}
            autoCapitalize="none"
          />
        </View>

        {/* Memo */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Memo (optional)</Text>
          <TextInput
            style={styles.input}
            value={memo}
            onChangeText={setMemo}
            placeholder="What's this for?"
            placeholderTextColor={COLORS.textMuted}
          />
        </View>

        {/* Pay Button */}
        <TouchableOpacity
          style={[
            styles.payButton,
            (!amount || !recipient) && styles.payButtonDisabled,
          ]}
          onPress={handlePay}
          disabled={!amount || !recipient || sending}
          activeOpacity={0.8}
        >
          <Text style={styles.payButtonText}>
            {sending ? 'Sending...' : `Pay ${amount || '0'} ${currency}`}
          </Text>
        </TouchableOpacity>

        {/* Fee Info */}
        <Text style={styles.feeText}>
          Network fee: {'<'}$0.01 · Instant confirmation
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 32,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  amountInput: {
    fontSize: 56,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    minWidth: 200,
  },
  currencyToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 4,
    marginTop: 12,
  },
  currencyBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },
  currencyBtnActive: {
    backgroundColor: COLORS.primary,
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  currencyTextActive: {
    color: COLORS.text,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  payButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  payButtonDisabled: {
    opacity: 0.4,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  feeText: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 12,
  },
});
