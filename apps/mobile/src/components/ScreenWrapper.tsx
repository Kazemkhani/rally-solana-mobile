import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    Easing,
} from 'react-native-reanimated';

interface Props {
    children: React.ReactNode;
    accentStrength?: number;
}

export default function ScreenWrapper({ children, accentStrength = 0.04 }: Props) {
    // Top Right Orb (Purple/Magenta) - Breathing Scale & Rotate
    const orb1Scale = useSharedValue(1);
    const orb1Rotate = useSharedValue(0);

    // Bottom Left Orb (Amber/Gold) - Floating X/Y
    const orb2Tx = useSharedValue(0);
    const orb2Ty = useSharedValue(0);

    // Center Orb (Soft Warmth) - Pulsing Opacity
    const orb3Opacity = useSharedValue(0.6);

    useEffect(() => {
        // Orb 1: Breathe scale in and out slowly
        orb1Scale.value = withRepeat(
            withSequence(
                withTiming(1.15, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.ease) })
            ),
            -1, // infinite
            true // reverse
        );
        orb1Rotate.value = withRepeat(
            withTiming(360, { duration: 25000, easing: Easing.linear }),
            -1, // infinite
            false
        );

        // Orb 2: Smooth infinite floating figure-eight like motion
        orb2Tx.value = withRepeat(
            withSequence(
                withTiming(40, { duration: 10000, easing: Easing.inOut(Easing.quad) }),
                withTiming(-20, { duration: 12000, easing: Easing.inOut(Easing.quad) })
            ),
            -1, true
        );
        orb2Ty.value = withRepeat(
            withSequence(
                withTiming(-30, { duration: 11000, easing: Easing.inOut(Easing.quad) }),
                withTiming(20, { duration: 9000, easing: Easing.inOut(Easing.quad) })
            ),
            -1, true
        );

        // Orb 3: Slow pulse
        orb3Opacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.4, { duration: 6000, easing: Easing.inOut(Easing.ease) })
            ),
            -1, true
        );
    }, []);

    const animatedStyle1 = useAnimatedStyle(() => ({
        transform: [{ scale: orb1Scale.value }, { rotate: `${orb1Rotate.value}deg` }],
    }));

    const animatedStyle2 = useAnimatedStyle(() => ({
        transform: [{ translateX: orb2Tx.value }, { translateY: orb2Ty.value }],
    }));

    const animatedStyle3 = useAnimatedStyle(() => ({
        opacity: orb3Opacity.value,
    }));

    return (
        <View style={styles.container}>
            {/* Deep rich purple/magenta orb — top right */}
            <Animated.View pointerEvents="none" style={[styles.orbTopLeft, animatedStyle1]}>
                <LinearGradient
                    colors={[`rgba(110, 40, 150, ${accentStrength * 3.5})`, `rgba(180, 80, 200, ${accentStrength * 1.5})`, 'transparent']}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                />
            </Animated.View>

            {/* Warm amber/gold glow — bottom left */}
            <Animated.View pointerEvents="none" style={[styles.orbBottomRight, animatedStyle2]}>
                <LinearGradient
                    colors={[`rgba(200, 100, 30, ${accentStrength * 2.8})`, 'transparent']}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                />
            </Animated.View>

            {/* Soft, wide central warmth */}
            <Animated.View pointerEvents="none" style={[styles.orbCenter, animatedStyle3]}>
                <LinearGradient
                    colors={[`rgba(255, 120, 80, ${accentStrength * 1.2})`, 'transparent']}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0.5, y: 0.3 }}
                    end={{ x: 0.5, y: 1 }}
                />
            </Animated.View>

            {/* Heavy Vignette for dramatic contrast */}
            <LinearGradient
                pointerEvents="none"
                colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
                style={styles.vignetteBottom}
            />

            {/* Content */}
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#06060E',
    },
    orbTopLeft: {
        position: 'absolute',
        top: -180,
        left: -120,
        width: 500,
        height: 500,
        borderRadius: 250,
    },
    orbBottomRight: {
        position: 'absolute',
        bottom: -120,
        right: -120,
        width: 380,
        height: 380,
        borderRadius: 190,
    },
    orbCenter: {
        position: 'absolute',
        top: 80,
        left: '20%',
        width: 300,
        height: 200,
        borderRadius: 150,
    },
    vignetteBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 200,
    },
});
