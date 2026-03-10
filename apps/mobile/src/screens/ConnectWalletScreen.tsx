import React, { useEffect, useRef, useState } from 'react';
import {
    View, Text, StyleSheet, Platform,
    Animated, Easing, ActivityIndicator, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AnimatedPressable from '../components/AnimatedPressable';
import { showToast } from '../components/Toast';
import { COLORS } from '../utils/constants';
import { useWallet } from '../hooks/useWallet';
import type { WalletProvider } from '../stores/wallet';

// ─── Wallet Options ───────────────────────────────────────────
const WALLET_OPTIONS: {
    id: WalletProvider;
    name: string;
    icon: string;
    color: string;
    gradient: [string, string];
    description: string;
}[] = [
        {
            id: 'phantom',
            name: 'Phantom',
            icon: '👻',
            color: '#AB9FF2',
            gradient: ['#AB9FF2', '#6C63FF'],
            description: 'Most popular Solana wallet',
        },
        {
            id: 'solflare',
            name: 'Solflare',
            icon: '🔥',
            color: '#FC8C28',
            gradient: ['#FC8C28', '#EF6C00'],
            description: 'Secure & feature-rich wallet',
        },
        {
            id: 'backpack',
            name: 'Backpack',
            icon: '🎒',
            color: '#E33E3F',
            gradient: ['#E33E3F', '#B71C1C'],
            description: 'xNFT-powered wallet',
        },
        {
            id: 'glow',
            name: 'Glow',
            icon: '✨',
            color: '#7C4DFF',
            gradient: ['#7C4DFF', '#536DFE'],
            description: 'Fast & lightweight wallet',
        },
        {
            id: 'tiplink',
            name: 'Tip Link',
            icon: '🔗',
            color: '#26A69A',
            gradient: ['#26A69A', '#00897B'],
            description: 'No-install link-based wallet',
        },
    ];

export default function ConnectWalletScreen() {
    const { connect, connecting } = useWallet();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [selectedWallet, setSelectedWallet] = useState<WalletProvider | null>(null);

    // Animations
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const logoScale = useRef(new Animated.Value(0.85)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const contentY = useRef(new Animated.Value(20)).current;
    const listOpacity = useRef(new Animated.Value(0)).current;
    const listY = useRef(new Animated.Value(20)).current;
    const ringRotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Rotating ring
        Animated.loop(
            Animated.timing(ringRotation, {
                toValue: 1,
                duration: 8000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Entrance sequence
        Animated.sequence([
            Animated.delay(100),
            Animated.parallel([
                Animated.timing(logoScale, {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
            Animated.delay(200),
            Animated.parallel([
                Animated.timing(contentOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(contentY, {
                    toValue: 0,
                    duration: 400,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
            ]),
            Animated.delay(100),
            Animated.parallel([
                Animated.timing(listOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(listY, {
                    toValue: 0,
                    duration: 400,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    const handleConnect = async (provider: WalletProvider) => {
        setError(null);
        setSelectedWallet(provider);
        try {
            await connect(provider);
            showToast('Wallet connected!', 'success');
            router.replace('/(tabs)/home');
        } catch (err: any) {
            const message = err?.message || 'Connection failed';
            if (message.includes('No wallet') || message.includes('not found')) {
                setError(`${WALLET_OPTIONS.find(w => w.id === provider)?.name || 'Wallet'} not found. Please install it and try again.`);
            } else if (message.includes('cancelled') || message.includes('rejected')) {
                setError('Connection was cancelled. Try again when ready.');
            } else {
                setError('Could not connect. Make sure the wallet app is installed and try again.');
            }
            setSelectedWallet(null);
        }
    };

    const handleDemoMode = async () => {
        setError(null);
        setSelectedWallet('demo');
        await connect('demo');
        showToast('Demo mode activated ✨', 'success');
        router.replace('/(tabs)/home');
    };

    const spin = ringRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            {/* Ambient background glows */}
            <View style={styles.ambientGlow} />
            <View style={styles.ambientGlow2} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Rally Logo */}
                <Animated.View
                    style={[
                        styles.logoContainer,
                        { opacity: logoOpacity, transform: [{ scale: logoScale }] },
                    ]}
                >
                    <Animated.View style={[styles.ringOuter, { transform: [{ rotate: spin }] }]}>
                        <LinearGradient
                            colors={['#b175ff', '#ff9c7a', '#3B82F6', '#b175ff']}
                            style={styles.ringGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        />
                    </Animated.View>
                    <View style={styles.logoInner}>
                        <Text style={styles.logoText}>R</Text>
                    </View>
                </Animated.View>

                {/* Title */}
                <Animated.View
                    style={[
                        styles.textContent,
                        { opacity: contentOpacity, transform: [{ translateY: contentY }] },
                    ]}
                >
                    <Text style={styles.title}>Connect Your Wallet</Text>
                    <Text style={styles.subtitle}>
                        Choose a wallet to start using Rally for squad finance on Solana.
                    </Text>
                </Animated.View>

                {/* Wallet Options List */}
                <Animated.View
                    style={[
                        styles.walletList,
                        { opacity: listOpacity, transform: [{ translateY: listY }] },
                    ]}
                >
                    {WALLET_OPTIONS.map((wallet, index) => {
                        const isConnecting = connecting && selectedWallet === wallet.id;
                        return (
                            <AnimatedPressable
                                key={wallet.id}
                                scaleDepth={0.97}
                                onPress={() => handleConnect(wallet.id)}
                                disabled={connecting}
                                style={[
                                    styles.walletOption,
                                    isConnecting && styles.walletOptionActive,
                                ]}
                            >
                                {/* Left: Icon + Info */}
                                <View style={styles.walletLeft}>
                                    <LinearGradient
                                        colors={wallet.gradient}
                                        style={styles.walletIconWrap}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    >
                                        <Text style={styles.walletIcon}>{wallet.icon}</Text>
                                    </LinearGradient>
                                    <View style={styles.walletInfo}>
                                        <Text style={styles.walletName}>{wallet.name}</Text>
                                        <Text style={styles.walletDesc}>{wallet.description}</Text>
                                    </View>
                                </View>

                                {/* Right: Arrow or Spinner */}
                                <View style={styles.walletRight}>
                                    {isConnecting ? (
                                        <ActivityIndicator color={wallet.color} size="small" />
                                    ) : (
                                        <Text style={[styles.walletArrow, { color: wallet.color }]}>→</Text>
                                    )}
                                </View>
                            </AnimatedPressable>
                        );
                    })}

                    {/* Divider */}
                    <View style={styles.dividerRow}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Demo Mode Button */}
                    <AnimatedPressable
                        scaleDepth={0.97}
                        onPress={handleDemoMode}
                        disabled={connecting}
                        style={styles.demoButton}
                    >
                        <Text style={styles.demoIcon}>🚀</Text>
                        <View style={styles.demoInfo}>
                            <Text style={styles.demoTitle}>Try Demo Mode</Text>
                            <Text style={styles.demoDesc}>Explore Rally with sample data — no wallet needed</Text>
                        </View>
                    </AnimatedPressable>
                </Animated.View>

                {/* Error message */}
                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}
            </ScrollView>

            {/* Bottom info */}
            <View style={styles.bottomInfo}>
                <View style={styles.poweredRow}>
                    <View style={styles.solanaDot} />
                    <Text style={styles.poweredText}>Powered by Solana</Text>
                </View>
                <Text style={styles.networkText}>Devnet</Text>
            </View>
        </View>
    );
}

const HAIRLINE = StyleSheet.hairlineWidth;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#04040a',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 80 : 60,
        paddingBottom: 100,
        alignItems: 'center',
    },
    ambientGlow: {
        position: 'absolute',
        top: '10%',
        left: '50%',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(177, 117, 255, 0.05)',
        transform: [{ translateX: -150 }],
    },
    ambientGlow2: {
        position: 'absolute',
        bottom: '25%',
        right: '-10%',
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: 'rgba(255, 156, 122, 0.03)',
    },

    // Logo
    logoContainer: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 28,
    },
    ringOuter: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 25,
        padding: 2,
        overflow: 'hidden',
    },
    ringGradient: {
        flex: 1,
        borderRadius: 23,
        opacity: 0.5,
    },
    logoInner: {
        position: 'absolute',
        width: 92,
        height: 92,
        borderRadius: 23,
        backgroundColor: 'rgba(177, 117, 255, 0.06)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: HAIRLINE,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    logoText: {
        fontSize: 52,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -2,
    },

    // Text
    textContent: {
        alignItems: 'center',
        marginBottom: 28,
        paddingHorizontal: 8,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: -0.8,
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#888888',
        lineHeight: 20,
        textAlign: 'center',
        letterSpacing: -0.2,
    },

    // Wallet list
    walletList: {
        width: '100%',
        gap: 10,
    },
    walletOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: HAIRLINE,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    walletOptionActive: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderColor: 'rgba(255,255,255,0.12)',
    },
    walletLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        flex: 1,
    },
    walletIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    walletIcon: {
        fontSize: 22,
    },
    walletInfo: {
        flex: 1,
        gap: 2,
    },
    walletName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: -0.3,
    },
    walletDesc: {
        fontSize: 12,
        color: '#666666',
        letterSpacing: -0.2,
    },
    walletRight: {
        marginLeft: 8,
    },
    walletArrow: {
        fontSize: 20,
        fontWeight: '600',
    },

    // Divider
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginVertical: 6,
        paddingHorizontal: 8,
    },
    dividerLine: {
        flex: 1,
        height: HAIRLINE,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    dividerText: {
        fontSize: 12,
        color: '#555',
        fontWeight: '500',
    },

    // Demo button
    demoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(177, 117, 255, 0.06)',
        borderWidth: 1,
        borderColor: 'rgba(177, 117, 255, 0.15)',
        borderStyle: 'dashed',
    },
    demoIcon: {
        fontSize: 28,
    },
    demoInfo: {
        flex: 1,
        gap: 2,
    },
    demoTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.primary,
        letterSpacing: -0.3,
    },
    demoDesc: {
        fontSize: 12,
        color: '#666666',
        letterSpacing: -0.2,
    },

    // Error
    errorContainer: {
        marginTop: 16,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        borderWidth: HAIRLINE,
        borderColor: 'rgba(239, 68, 68, 0.2)',
        width: '100%',
    },
    errorText: {
        fontSize: 13,
        color: '#EF4444',
        textAlign: 'center',
        lineHeight: 18,
    },

    // Bottom
    bottomInfo: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 48 : 32,
        alignSelf: 'center',
        alignItems: 'center',
        gap: 6,
    },
    poweredRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    solanaDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#14F195',
    },
    poweredText: {
        fontSize: 12,
        fontWeight: '400',
        color: '#4B5563',
    },
    networkText: {
        fontSize: 11,
        fontWeight: '500',
        color: '#333',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
});
