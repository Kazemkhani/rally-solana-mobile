import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS } from '../utils/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
    lines?: number;
    style?: any;
}

export default function LoadingSkeleton({ lines = 3, style }: Props) {
    const shimmer = useSharedValue(0);

    useEffect(() => {
        shimmer.value = withRepeat(
            withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
            -1,
            false,
        );
    }, []);

    const shimmerStyle = useAnimatedStyle(() => ({
        transform: [{
            translateX: interpolate(shimmer.value, [0, 1], [-SCREEN_WIDTH, SCREEN_WIDTH]),
        }],
    }));

    const lineWidths = [0.85, 0.6, 0.4, 0.7, 0.5];

    return (
        <View style={[styles.container, style]}>
            {Array.from({ length: lines }).map((_, i) => (
                <View
                    key={i}
                    style={[
                        styles.line,
                        { width: `${(lineWidths[i % lineWidths.length]) * 100}%` },
                    ]}
                >
                    <Animated.View style={[styles.shimmerOverlay, shimmerStyle]}>
                        <LinearGradient
                            colors={['transparent', 'rgba(139,92,246,0.06)', 'transparent']}
                            style={StyleSheet.absoluteFill}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                        />
                    </Animated.View>
                </View>
            ))}
        </View>
    );
}

// Card-shaped skeleton
export function SkeletonCard({ style }: { style?: any }) {
    const shimmer = useSharedValue(0);

    useEffect(() => {
        shimmer.value = withRepeat(
            withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
            -1,
            false,
        );
    }, []);

    const shimmerStyle = useAnimatedStyle(() => ({
        transform: [{
            translateX: interpolate(shimmer.value, [0, 1], [-SCREEN_WIDTH, SCREEN_WIDTH]),
        }],
    }));

    return (
        <View style={[styles.card, style]}>
            <View style={styles.cardRow}>
                <View style={styles.cardCircle} />
                <View style={{ flex: 1, gap: 8 }}>
                    <View style={[styles.line, { width: '50%', height: 14 }]} />
                    <View style={[styles.line, { width: '30%', height: 10 }]} />
                </View>
            </View>
            <View style={[styles.line, { width: '70%', height: 28, marginTop: 16 }]} />
            <View style={[styles.line, { width: '40%', height: 12, marginTop: 8 }]} />
            <Animated.View style={[styles.shimmerOverlay, shimmerStyle]}>
                <LinearGradient
                    colors={['transparent', 'rgba(139,92,246,0.04)', 'transparent']}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: SPACING.md, padding: SPACING.xl },
    line: {
        height: 12, borderRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.04)',
        overflow: 'hidden',
    },
    shimmerOverlay: {
        position: 'absolute', top: 0, bottom: 0, width: 120,
    },
    card: {
        padding: SPACING.xl, borderRadius: RADIUS.xl,
        backgroundColor: 'rgba(17, 17, 34, 0.6)',
        borderWidth: 1, borderColor: 'rgba(139, 92, 246, 0.08)',
        overflow: 'hidden', position: 'relative',
        marginBottom: 14,
    },
    cardRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
    cardCircle: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.04)',
    },
});
