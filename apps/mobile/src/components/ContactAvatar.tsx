import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, FONT_SIZES, SPACING } from '../utils/constants';

interface Props {
    name: string;
    avatar: string;
    color: string;
    size?: number;
    showName?: boolean;
    onPress?: () => void;
}

export default function ContactAvatar({
    name,
    avatar,
    color,
    size = 48,
    showName = true,
    onPress,
}: Props) {
    const content = (
        <View style={styles.container}>
            <View
                style={[
                    styles.circle,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        backgroundColor: color + '20',
                    },
                ]}
            >
                <Text style={[styles.emoji, { fontSize: size * 0.45 }]}>{avatar}</Text>
            </View>
            {showName && (
                <Text style={styles.name} numberOfLines={1}>
                    {name}
                </Text>
            )}
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                {content}
            </TouchableOpacity>
        );
    }
    return content;
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: 64,
    },
    circle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    emoji: {
        textAlign: 'center',
    },
    name: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
        textAlign: 'center',
    },
});
