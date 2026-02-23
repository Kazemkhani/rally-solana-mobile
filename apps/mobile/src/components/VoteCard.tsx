import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../utils/constants';
import type { Proposal } from '../types';

interface Props {
  proposal: Proposal;
  hasVoted?: boolean;
  onVoteYes?: () => void;
  onVoteNo?: () => void;
}

export default function VoteCard({ proposal, hasVoted, onVoteYes, onVoteNo }: Props) {
  const totalVotes = proposal.yesVotes + proposal.noVotes;
  const yesPercent = totalVotes > 0 ? (proposal.yesVotes / totalVotes) * 100 : 50;
  const deadline = new Date(proposal.deadline * 1000);
  const now = Date.now();
  const hoursLeft = Math.max(0, Math.ceil((proposal.deadline * 1000 - now) / 3600000));
  const isActive = now < proposal.deadline * 1000 && !proposal.isExecuted;

  return (
    <View style={styles.card}>
      {/* Status badge */}
      <View style={styles.header}>
        <View
          style={[
            styles.statusBadge,
            isActive ? styles.statusActive : styles.statusClosed,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              isActive ? styles.statusTextActive : styles.statusTextClosed,
            ]}
          >
            {isActive ? 'Active' : proposal.isExecuted ? 'Executed' : 'Closed'}
          </Text>
        </View>
        <Text style={styles.deadline}>
          {isActive ? `${hoursLeft}h left` : 'Ended'}
        </Text>
      </View>

      <Text style={styles.title}>{proposal.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {proposal.description}
      </Text>

      {/* Amount */}
      <Text style={styles.amount}>
        {(proposal.amount / 1_000_000_000).toFixed(2)} SOL
      </Text>

      {/* Vote progress bar */}
      <View style={styles.voteBar}>
        <View style={[styles.yesBar, { width: `${yesPercent}%` }]} />
        <View style={[styles.noBar, { width: `${100 - yesPercent}%` }]} />
      </View>
      <View style={styles.voteLabels}>
        <Text style={styles.yesLabel}>Yes: {proposal.yesVotes}</Text>
        <Text style={styles.noLabel}>No: {proposal.noVotes}</Text>
      </View>

      {/* Vote buttons */}
      {isActive && !hasVoted && (
        <View style={styles.voteButtons}>
          <TouchableOpacity
            style={[styles.voteBtn, styles.voteBtnYes]}
            onPress={onVoteYes}
          >
            <Text style={styles.voteBtnText}>Vote Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.voteBtn, styles.voteBtnNo]}
            onPress={onVoteNo}
          >
            <Text style={styles.voteBtnTextNo}>Vote No</Text>
          </TouchableOpacity>
        </View>
      )}

      {hasVoted && (
        <Text style={styles.votedText}>You already voted</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  statusActive: { backgroundColor: COLORS.success + '20' },
  statusClosed: { backgroundColor: COLORS.textMuted + '20' },
  statusText: { fontSize: 11, fontWeight: '700' },
  statusTextActive: { color: COLORS.success },
  statusTextClosed: { color: COLORS.textMuted },
  deadline: { fontSize: 12, color: COLORS.textMuted },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  description: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 12 },
  amount: { fontSize: 22, fontWeight: '700', color: COLORS.primary, marginBottom: 12 },
  voteBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  yesBar: { backgroundColor: COLORS.success, borderRadius: 4 },
  noBar: { backgroundColor: COLORS.error + '40', borderRadius: 4 },
  voteLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  yesLabel: { fontSize: 12, color: COLORS.success, fontWeight: '600' },
  noLabel: { fontSize: 12, color: COLORS.error, fontWeight: '600' },
  voteButtons: { flexDirection: 'row', gap: 12 },
  voteBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  voteBtnYes: { backgroundColor: COLORS.success },
  voteBtnNo: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.error + '60',
  },
  voteBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  voteBtnTextNo: { fontSize: 15, fontWeight: '700', color: COLORS.error },
  votedText: { textAlign: 'center', color: COLORS.textMuted, fontSize: 13, fontStyle: 'italic' },
});
