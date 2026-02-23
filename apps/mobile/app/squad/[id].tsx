import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../../src/utils/constants';
import { useSquadStore } from '../../src/stores/squads';

export default function SquadDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { squads, depositToVault, withdrawFromVault } = useSquadStore();
    const squad = squads.find((s) => s.id === id);

    const [modalType, setModalType] = useState<'deposit' | 'withdraw' | null>(null);
    const [amountInput, setAmountInput] = useState('');

    if (!squad) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Squad not found</Text>
            </SafeAreaView>
        );
    }

    const solBalance = squad.totalDeposited / 1_000_000_000;

    const handleSubmit = () => {
        const amount = parseFloat(amountInput);
        if (isNaN(amount) || amount <= 0) return;

        if (modalType === 'deposit') {
            depositToVault(squad.id, amount * 145, amount);
        } else {
            withdrawFromVault(squad.id, amount * 145, amount);
        }
        setAmountInput('');
        setModalType(null);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Squad Info */}
                <View style={styles.infoSection}>
                    <Text style={styles.emoji}>{squad.emoji}</Text>
                    <Text style={styles.name}>{squad.name}</Text>
                    <Text style={styles.memberCount}>{squad.members.length} members</Text>
                </View>

                {/* Vault Card */}
                <View style={styles.vaultCard}>
                    <Text style={styles.vaultLabel}>VAULT BALANCE</Text>
                    <Text style={styles.vaultAmount}>{solBalance.toFixed(2)} SOL</Text>
                    <Text style={styles.vaultUsd}>${squad.usdcBalance.toFixed(2)}</Text>

                    <View style={styles.vaultActions}>
                        <TouchableOpacity
                            style={[styles.vaultBtn, { backgroundColor: COLORS.success + '18' }]}
                            onPress={() => setModalType('deposit')}
                        >
                            <Text style={[styles.vaultBtnText, { color: COLORS.success }]}>Deposit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.vaultBtn, { backgroundColor: COLORS.danger + '18' }]}
                            onPress={() => setModalType('withdraw')}
                        >
                            <Text style={[styles.vaultBtnText, { color: COLORS.danger }]}>Withdraw</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Members */}
                <Text style={styles.sectionTitle}>Members</Text>
                {squad.members.map((m, i) => {
                    const initial = m.displayName.charAt(0);
                    return (
                        <View key={m.pubkey + i} style={[styles.memberRow, i < squad.members.length - 1 && styles.memberBorder]}>
                            <View style={[styles.memberAvatar, { backgroundColor: m.color + '20' }]}>
                                <Text style={[styles.memberInitial, { color: m.color }]}>{initial}</Text>
                            </View>
                            <View style={styles.memberInfo}>
                                <Text style={styles.memberName}>{m.displayName}</Text>
                                <Text style={styles.memberRole}>{m.role}</Text>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>

            {/* Deposit/Withdraw Modal */}
            <Modal visible={modalType !== null} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {modalType === 'deposit' ? 'Deposit to Vault' : 'Withdraw from Vault'}
                        </Text>
                        <TextInput
                            value={amountInput}
                            onChangeText={setAmountInput}
                            placeholder="Amount in SOL"
                            placeholderTextColor={COLORS.textTertiary}
                            keyboardType="numeric"
                            style={styles.input}
                            autoFocus
                        />
                        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                            <Text style={styles.submitBtnText}>
                                {modalType === 'deposit' ? 'Deposit' : 'Withdraw'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalType(null)} style={styles.cancelBtn}>
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
    },
    backBtn: {
        paddingVertical: SPACING.sm,
    },
    backText: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '600',
        color: COLORS.primary,
    },
    scrollContent: {
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    errorText: {
        fontSize: FONT_SIZES.xl,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: 60,
    },
    // Info
    infoSection: {
        alignItems: 'center',
        paddingVertical: SPACING.xl,
    },
    emoji: {
        fontSize: 48,
        marginBottom: SPACING.md,
    },
    name: {
        fontSize: FONT_SIZES.title,
        fontWeight: '800',
        color: COLORS.text,
        letterSpacing: -0.5,
    },
    memberCount: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    // Vault
    vaultCard: {
        marginHorizontal: SPACING.xl,
        padding: SPACING.xl,
        borderRadius: RADIUS.xl,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.xxl,
    },
    vaultLabel: {
        fontSize: FONT_SIZES.caption,
        fontWeight: '500',
        color: COLORS.textSecondary,
        letterSpacing: 2,
        marginBottom: SPACING.sm,
    },
    vaultAmount: {
        fontSize: FONT_SIZES.balance,
        fontWeight: '800',
        color: COLORS.text,
        letterSpacing: -1,
    },
    vaultUsd: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        marginTop: 4,
        marginBottom: SPACING.xl,
    },
    vaultActions: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    vaultBtn: {
        flex: 1,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
    },
    vaultBtnText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
    },
    // Members
    sectionTitle: {
        fontSize: FONT_SIZES.section,
        fontWeight: '700',
        color: COLORS.text,
        paddingHorizontal: SPACING.xl,
        marginBottom: SPACING.lg,
    },
    memberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.lg,
    },
    memberBorder: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider,
    },
    memberAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    memberInitial: {
        fontSize: 16,
        fontWeight: '700',
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.text,
    },
    memberRole: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginTop: 1,
        textTransform: 'capitalize',
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.surfaceElevated,
        borderTopLeftRadius: RADIUS.xl,
        borderTopRightRadius: RADIUS.xl,
        padding: SPACING.xxl,
        paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.xxl,
    },
    modalTitle: {
        fontSize: FONT_SIZES.section,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.xl,
        textAlign: 'center',
    },
    input: {
        backgroundColor: COLORS.surfaceInput,
        borderRadius: RADIUS.md,
        padding: SPACING.lg,
        fontSize: FONT_SIZES.xl,
        color: COLORS.text,
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    submitBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    submitBtnText: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.text,
    },
    cancelBtn: {
        padding: SPACING.md,
        alignItems: 'center',
    },
    cancelBtnText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
    },
});
