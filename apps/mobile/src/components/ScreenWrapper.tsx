import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
    children: React.ReactNode;
    accentStrength?: number;
}

export default function ScreenWrapper({ children, accentStrength = 0.04 }: Props) {
    return (
        <View style={styles.container}>
            {/* Warm ambient orb — top left (amber/rose like reference) */}
            <LinearGradient
                colors={[`rgba(245, 158, 11, ${accentStrength * 1.8})`, `rgba(244, 114, 182, ${accentStrength * 0.8})`, 'transparent']}
                style={styles.orbTopLeft}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            {/* Cool accent orb — bottom right (purple) */}
            <LinearGradient
                colors={[`rgba(139, 92, 246, ${accentStrength * 1.2})`, 'transparent']}
                style={styles.orbBottomRight}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            {/* Subtle center warmth — like the reference screenshots */}
            <LinearGradient
                colors={[`rgba(251, 191, 36, ${accentStrength * 0.4})`, 'transparent']}
                style={styles.orbCenter}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            />

            {/* Vignette */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.2)']}
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
