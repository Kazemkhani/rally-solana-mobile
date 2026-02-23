import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const logoScale = useRef(new Animated.Value(0.8)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const subtitleOpacity = useRef(new Animated.Value(0)).current;
    const poweredOpacity = useRef(new Animated.Value(0)).current;
    const poweredTranslateY = useRef(new Animated.Value(20)).current;
    const fadeOut = useRef(new Animated.Value(1)).current;
    const borderRotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Start the rotating border
        Animated.loop(
            Animated.timing(borderRotation, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        ).start();

        // Sequence: logo → title → powered → fade out
        Animated.sequence([
            // 0-1s: Logo fades in + scales
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    friction: 8,
                    tension: 80,
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]),
            // 1-2s: Title + subtitle
            Animated.parallel([
                Animated.timing(titleOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(subtitleOpacity, {
                    toValue: 1,
                    duration: 500,
                    delay: 200,
                    useNativeDriver: true,
                }),
            ]),
            // 2-2.5s: Powered by
            Animated.parallel([
                Animated.timing(poweredOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.spring(poweredTranslateY, {
                    toValue: 0,
                    friction: 8,
                    tension: 80,
                    useNativeDriver: true,
                }),
            ]),
            // 2.5-3s: Fade out
            Animated.delay(300),
            Animated.timing(fadeOut, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onFinish();
        });
    }, []);

    const spin = borderRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.View style={[styles.container, { opacity: fadeOut }]}>
            {/* Logo */}
            <View style={styles.centerContent}>
                <Animated.View
                    style={[
                        styles.logoContainer,
                        {
                            opacity: logoOpacity,
                            transform: [{ scale: logoScale }],
                        },
                    ]}
                >
                    {/* Rotating gradient border ring */}
                    <Animated.View
                        style={[
                            styles.gradientRing,
                            { transform: [{ rotate: spin }] },
                        ]}
                    >
                        <View style={styles.ringSegment1} />
                        <View style={styles.ringSegment2} />
                        <View style={styles.ringSegment3} />
                        <View style={styles.ringSegment4} />
                    </Animated.View>

                    {/* Inner logo */}
                    <View style={styles.logoInner}>
                        <Text style={styles.logoText}>R</Text>
                    </View>
                </Animated.View>

                {/* RALLY text */}
                <Animated.Text style={[styles.rallyText, { opacity: titleOpacity }]}>
                    RALLY
                </Animated.Text>

                {/* Subtitle */}
                <Animated.Text style={[styles.subtitleText, { opacity: subtitleOpacity }]}>
                    ONCHAIN SQUAD FINANCE
                </Animated.Text>
            </View>

            {/* Powered by Solana */}
            <Animated.View
                style={[
                    styles.poweredContainer,
                    {
                        opacity: poweredOpacity,
                        transform: [{ translateY: poweredTranslateY }],
                    },
                ]}
            >
                <Text style={styles.poweredText}>
                    Powered by{' '}
                    <Text style={styles.solanaText}>Solana</Text>
                </Text>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    centerContent: {
        alignItems: 'center',
    },
    logoContainer: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    gradientRing: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 24,
        borderWidth: 2.5,
        borderColor: 'transparent',
        overflow: 'hidden',
    },
    ringSegment1: {
        position: 'absolute',
        top: -2,
        left: -2,
        right: '50%',
        bottom: '50%',
        backgroundColor: 'transparent',
        borderTopWidth: 2.5,
        borderLeftWidth: 2.5,
        borderTopColor: '#8B5CF6',
        borderLeftColor: '#8B5CF6',
        borderTopLeftRadius: 24,
    },
    ringSegment2: {
        position: 'absolute',
        top: -2,
        left: '50%',
        right: -2,
        bottom: '50%',
        backgroundColor: 'transparent',
        borderTopWidth: 2.5,
        borderRightWidth: 2.5,
        borderTopColor: '#7C3AED',
        borderRightColor: '#3B82F6',
        borderTopRightRadius: 24,
    },
    ringSegment3: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        right: -2,
        bottom: -2,
        backgroundColor: 'transparent',
        borderBottomWidth: 2.5,
        borderRightWidth: 2.5,
        borderBottomColor: '#3B82F6',
        borderRightColor: '#6366F1',
        borderBottomRightRadius: 24,
    },
    ringSegment4: {
        position: 'absolute',
        top: '50%',
        left: -2,
        right: '50%',
        bottom: -2,
        backgroundColor: 'transparent',
        borderBottomWidth: 2.5,
        borderLeftWidth: 2.5,
        borderBottomColor: '#6366F1',
        borderLeftColor: '#8B5CF6',
        borderBottomLeftRadius: 24,
    },
    logoInner: {
        width: 88,
        height: 88,
        borderRadius: 20,
        backgroundColor: '#0A0A14',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 44,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -1,
    },
    rallyText: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 8,
        marginBottom: 8,
    },
    subtitleText: {
        fontSize: 13,
        fontWeight: '400',
        color: '#9CA3AF',
        letterSpacing: 3,
    },
    poweredContainer: {
        position: 'absolute',
        bottom: 60,
    },
    poweredText: {
        fontSize: 13,
        fontWeight: '400',
        color: '#6B7280',
    },
    solanaText: {
        color: '#14F195',
        fontWeight: '600',
    },
});
