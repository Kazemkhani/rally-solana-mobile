import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const logoScale = useRef(new Animated.Value(0.85)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const titleTranslateY = useRef(new Animated.Value(8)).current;
    const subtitleOpacity = useRef(new Animated.Value(0)).current;
    const subtitleTranslateY = useRef(new Animated.Value(8)).current;
    const poweredOpacity = useRef(new Animated.Value(0)).current;
    const fadeOut = useRef(new Animated.Value(1)).current;
    const scaleOut = useRef(new Animated.Value(1)).current;
    const borderRotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // 500ms: Start rotating border
        const rotateTimer = setTimeout(() => {
            Animated.loop(
                Animated.timing(borderRotation, {
                    toValue: 1,
                    duration: 3000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        }, 500);

        // Animation sequence matching exact timings
        const springEasing = Easing.bezier(0.34, 1.56, 0.64, 1);

        Animated.sequence([
            // 200ms: R fades in + scales with spring overshoot
            Animated.delay(200),
            Animated.parallel([
                Animated.timing(logoScale, {
                    toValue: 1,
                    duration: 400,
                    easing: springEasing,
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
            // 800ms: "RALLY" text slides up + fades in
            Animated.delay(100),
            Animated.parallel([
                Animated.timing(titleOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(titleTranslateY, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
            ]),
            // 1200ms: Subtitle slides up
            Animated.delay(100),
            Animated.parallel([
                Animated.timing(subtitleOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(subtitleTranslateY, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
            ]),
            // 2000ms: "Built on Solana" fades in
            Animated.delay(500),
            Animated.timing(poweredOpacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            // 2800ms: Everything fades out + slight scale up
            Animated.delay(400),
            Animated.parallel([
                Animated.timing(fadeOut, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleOut, {
                    toValue: 1.03,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
        ]).start(() => {
            onFinish();
        });

        return () => clearTimeout(rotateTimer);
    }, []);

    const spin = borderRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.View
            style={[
                styles.container,
                { opacity: fadeOut, transform: [{ scale: scaleOut }] },
            ]}
        >
            {/* Center Content */}
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
                    {/* Rotating gradient border */}
                    <Animated.View
                        style={[styles.gradientRing, { transform: [{ rotate: spin }] }]}
                    >
                        <View style={styles.ringSegment1} />
                        <View style={styles.ringSegment2} />
                        <View style={styles.ringSegment3} />
                        <View style={styles.ringSegment4} />
                    </Animated.View>

                    {/* Inner R */}
                    <View style={styles.logoInner}>
                        <Text style={styles.logoText}>R</Text>
                    </View>
                </Animated.View>

                {/* RALLY */}
                <Animated.View
                    style={{
                        opacity: titleOpacity,
                        transform: [{ translateY: titleTranslateY }],
                    }}
                >
                    <Text style={styles.rallyText}>RALLY</Text>
                </Animated.View>

                {/* Subtitle */}
                <Animated.View
                    style={{
                        opacity: subtitleOpacity,
                        transform: [{ translateY: subtitleTranslateY }],
                    }}
                >
                    <Text style={styles.subtitleText}>Onchain Squad Finance</Text>
                </Animated.View>
            </View>

            {/* Built on Solana */}
            <Animated.View style={[styles.poweredContainer, { opacity: poweredOpacity }]}>
                <View style={styles.poweredRow}>
                    <View style={styles.solanaDot} />
                    <Text style={styles.poweredText}>Built on Solana</Text>
                </View>
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
        marginBottom: 16,
    },
    gradientRing: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 24,
        overflow: 'hidden',
    },
    ringSegment1: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: '50%',
        bottom: '50%',
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderTopColor: '#8B5CF6',
        borderLeftColor: '#8B5CF6',
        borderColor: 'transparent',
        borderTopLeftRadius: 24,
    },
    ringSegment2: {
        position: 'absolute',
        top: 0,
        left: '50%',
        right: 0,
        bottom: '50%',
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderTopColor: '#3B82F6',
        borderRightColor: '#3B82F6',
        borderColor: 'transparent',
        borderTopRightRadius: 24,
    },
    ringSegment3: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        right: 0,
        bottom: 0,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderBottomColor: '#14B8A6',
        borderRightColor: '#14B8A6',
        borderColor: 'transparent',
        borderBottomRightRadius: 24,
    },
    ringSegment4: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: '50%',
        bottom: 0,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderBottomColor: '#6366F1',
        borderLeftColor: '#8B5CF6',
        borderColor: 'transparent',
        borderBottomLeftRadius: 24,
    },
    logoInner: {
        width: 90,
        height: 90,
        borderRadius: 22,
        backgroundColor: 'rgba(139, 92, 246, 0.06)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 72,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -2,
    },
    rallyText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 6,
        marginBottom: 8,
    },
    subtitleText: {
        fontSize: 11,
        fontWeight: '400',
        color: '#6B7280',
        letterSpacing: 3,
    },
    poweredContainer: {
        position: 'absolute',
        bottom: 48,
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
});
