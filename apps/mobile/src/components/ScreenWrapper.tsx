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
            {/* Ambient gradient orbs — using LinearGradient for web compatibility */}
            <LinearGradient
                colors={[`rgba(139, 92, 246, ${accentStrength * 1.5})`, 'transparent']}
                style={styles.orbTopLeft}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            <LinearGradient
                colors={[`rgba(59, 130, 246, ${accentStrength})`, 'transparent']}
                style={styles.orbBottomRight}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Vignette */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.15)']}
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
        top: -150,
        left: -150,
        width: 450,
        height: 450,
        borderRadius: 225,
    },
    orbBottomRight: {
        position: 'absolute',
        bottom: -120,
        right: -120,
        width: 380,
        height: 380,
        borderRadius: 190,
    },
    vignetteBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 200,
    },
});
