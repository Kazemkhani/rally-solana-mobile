import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, TRUNCATE_ADDRESS } from '../utils/constants';
import type { PaymentStream } from '../types';

const MOCK_STREAMS: PaymentStream[] = [
  {
    id: '1',
    sender: 'me',
    recipient: '3mRk...j2Lq',
    amountPerSecond: 115,
    startTime: Math.floor(Date.now() / 1000) - 86400,
    endTime: Math.floor(Date.now() / 1000) + 2505600,
    totalDeposited: 300_000_000,
    totalWithdrawn: 10_000_000,
    isCancelled: false,
  },
  {
    id: '2',
    sender: '9pQw...m8Rn',
    recipient: 'me',
    amountPerSecond: 57,
    startTime: Math.floor(Date.now() / 1000) - 172800,
    endTime: Math.floor(Date.now() / 1000) + 2332800,
    totalDeposited: 150_000_000,
    totalWithdrawn: 5_000_000,
    isCancelled: false,
  },
];

function StreamCard({ stream }: { stream: PaymentStream }) {
  const [elapsed, setElapsed] = useState(0);
  const isSending = stream.sender === 'me';
  const now = Math.floor(Date.now() / 1000);
  const totalDuration = stream.endTime - stream.startTime;

  useEffect(() => {
    const interval = setInterval(() => {
      const currentElapsed = Math.floor(Date.now() / 1000) - stream.startTime;
      setElapsed(Math.min(currentElapsed, totalDuration));
    }, 1000);
    return () => clearInterval(interval);
  }, [stream.startTime, totalDuration]);

  const streamed = (elapsed * stream.amountPerSecond) / 1_000_000_000;
  const total = stream.totalDeposited / 1_000_000_000;
  const progress = Math.min(elapsed / totalDuration, 1);
  const daysLeft = Math.ceil((stream.endTime - now) / 86400);

  return (
    <View style={styles.streamCard}>
      <View style={styles.streamHeader}>
        <Text style={styles.streamDirection}>
          {isSending ? '↑ Sending' : '↓ Receiving'}
        </Text>
        <Text style={[styles.streamRate, isSending ? styles.sending : styles.receiving]}>
          {(stream.amountPerSecond / 1_000_000_000).toFixed(9)} SOL/s
        </Text>
      </View>

      <Text style={styles.streamPeer}>
        {isSending ? `To: ${stream.recipient}` : `From: ${stream.sender}`}
      </Text>

      {/* Live counter */}
      <Text style={styles.streamAmount}>
        {streamed.toFixed(6)} / {total.toFixed(4)} SOL
      </Text>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress * 100}%` },
            isSending ? styles.progressSending : styles.progressReceiving,
          ]}
        />
      </View>

      <View style={styles.streamFooter}>
        <Text style={styles.streamMeta}>{daysLeft} days remaining</Text>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>
            {isSending ? 'Cancel' : 'Withdraw'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function StreamScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Payment Streams</Text>
          <Text style={styles.subtitle}>Real-time continuous payments</Text>
        </View>

        <View style={styles.streams}>
          {MOCK_STREAMS.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  streams: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100, gap: 12 },
  streamCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  streamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  streamDirection: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  streamRate: { fontSize: 12, fontWeight: '500' },
  sending: { color: COLORS.warning },
  receiving: { color: COLORS.success },
  streamPeer: { fontSize: 13, color: COLORS.textMuted, marginBottom: 12 },
  streamAmount: { fontSize: 22, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: { height: '100%', borderRadius: 3 },
  progressSending: { backgroundColor: COLORS.warning },
  progressReceiving: { backgroundColor: COLORS.success },
  streamFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  streamMeta: { fontSize: 12, color: COLORS.textMuted },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceLight,
  },
  actionBtnText: { fontSize: 13, fontWeight: '600', color: COLORS.primary },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: { fontSize: 28, color: COLORS.text, fontWeight: '300', marginTop: -2 },
});
