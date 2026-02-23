import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../utils/constants';
import type { PaymentStream } from '../types';

interface Props {
    stream: PaymentStream;
    elapsed: number;
}

export default function StreamCard({ stream, elapsed }: Props) {
    const isSending = stream.sender === 'me';
    const totalDuration = stream.endTime - stream.startTime;
    const streamed = elapsed * stream.amountPerSecond;
    const total = stream.totalDeposited;
    const progress = Math.min(elapsed / totalDuration, 1);
    const now = Math.floor(Date.now() / 1000);
    const daysLeft = Math.max(0, Math.ceil((stream.endTime - now) / 86400));
    const avatar = isSending ? stream.recipientAvatar : stream.senderAvatar;
    const name = isSending ? stream.recipientName : stream.senderName;
    const avatarColor = isSending ? COLORS.error : COLORS.success;

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                {/* Avatar + Name */}
                <View style={styles.headerLeft}>
                    <View style={[styles.avatar, { backgroundColor: avatarColor + '18' }]}>
                        <Text style={styles.avatarEmoji}>{avatar}</Text>
                    </View>
                    <View>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.direction}>
                            {isSending ? '↑ Sending to' : '↓ Receiving from'}
                        </Text>
                    </View>
                </View>

                {/* Active Dot */}
                {stream.isActive && (
                    <View style={styles.activeDot} />
                )}
            </View>

            {/* Live Counter */}
            <Text style={styles.liveAmount}>
                {streamed.toFixed(6)} <Text style={styles.liveAmountCurrency}>{stream.currency}</Text>
            </Text>

            {/* Rate */}
            <Text style={styles.rate}>{stream.rateLabel}</Text>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${progress * 100}%`,
                                backgroundColor: isSending ? COLORS.warning : COLORS.success,
                            },
                        ]}
                    />
                </View>
                <View style={styles.progressLabels}>
                    <Text style={styles.progressText}>{(progress * 100).toFixed(1)}%</Text>
                    <Text style={styles.progressText}>{daysLeft}d left</Text>
                </View>
            </View>

            {/* Total */}
            <View style={styles.footer}>
                <Text style={styles.totalLabel}>
                    of {total.toFixed(2)} {stream.currency}
                </Text>
                <TouchableOpacity
                    style={[styles.actionBtn, isSending && styles.actionBtnDanger]}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.actionBtnText, isSending && styles.actionBtnTextDanger]}>
                        {isSending ? 'Cancel' : 'Withdraw'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarEmoji: {
        fontSize: 18,
    },
    name: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.text,
    },
    direction: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textMuted,
    },
    activeDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.success,
        shadowColor: COLORS.success,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 4,
    },
    liveAmount: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: SPACING.xs,
        letterSpacing: -0.5,
    },
    liveAmountCurrency: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '500',
        color: COLORS.textMuted,
    },
    rate: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.md,
    },
    progressContainer: {
        marginBottom: SPACING.md,
    },
    progressBar: {
        height: 6,
        backgroundColor: COLORS.surfaceLight,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING.xs,
    },
    progressText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textMuted,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textMuted,
    },
    actionBtn: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.sm,
        backgroundColor: COLORS.primary + '15',
    },
    actionBtnDanger: {
        backgroundColor: COLORS.error + '15',
    },
    actionBtnText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.primary,
    },
    actionBtnTextDanger: {
        color: COLORS.error,
    },
});
