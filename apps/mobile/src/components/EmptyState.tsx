import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants';

interface Props {
    icon: string | React.ReactNode;
    title: string;
    subtitle: string;
}

export default function EmptyState({ icon, title, subtitle }: Props) {
    return (
        <Animated.View
            entering={FadeInDown.delay(200).duration(500).springify()}
            style={styles.container}
        >
            {typeof icon === 'string' ? (
                <Text style={styles.icon}>{icon}</Text>
            ) : (
                <View style={styles.iconWrap}>{icon}</View>
            )}
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: SPACING.xxxl,
    },
    icon: { fontSize: 48, marginBottom: SPACING.lg },
    iconWrap: { marginBottom: SPACING.lg },
    title: {
        fontSize: FONT_SIZES.xxl, fontWeight: '700',
        color: COLORS.text, textAlign: 'center', marginBottom: SPACING.sm,
    },
    subtitle: {
        fontSize: FONT_SIZES.md, color: COLORS.textSecondary,
        textAlign: 'center', lineHeight: 20,
    },
});
