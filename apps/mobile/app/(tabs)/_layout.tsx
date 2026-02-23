import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Animated } from 'react-native';
import { Tabs } from 'expo-router';
import { COLORS, FONT_SIZES } from '../../src/utils/constants';

function TabIcon({ icon, iconFilled, label, focused }: { icon: string; iconFilled: string; label: string; focused: boolean }) {
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(scale, {
            toValue: focused ? 1.1 : 1,
            friction: 6,
            tension: 300,
            useNativeDriver: true,
        }).start();
    }, [focused]);

    return (
        <Animated.View style={[styles.tabIconContainer, { transform: [{ scale }] }]}>
            <Text style={[styles.tabIconText, focused && styles.tabIconTextActive]}>
                {focused ? iconFilled : icon}
            </Text>
            {focused && (
                <Text style={styles.tabLabel}>{label}</Text>
            )}
        </Animated.View>
    );
}

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textTertiary,
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="⌂" iconFilled="⌂" label="Home" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="squads"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="◇" iconFilled="◆" label="Squads" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="pay"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.payButtonOuter}>
                            <View style={[styles.payButton, focused && styles.payButtonActive]}>
                                <Text style={styles.payIcon}>↑</Text>
                            </View>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="streams"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="≋" iconFilled="≋" label="Streams" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="●" iconFilled="●" label="Profile" focused={focused} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: 'rgba(6, 6, 14, 0.92)',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        height: Platform.OS === 'ios' ? 88 : 72,
        paddingTop: 8,
        paddingBottom: Platform.OS === 'ios' ? 28 : 8,
        paddingHorizontal: 4,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 0,
    },
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
    },
    tabIconText: {
        fontSize: 20,
        color: COLORS.textTertiary,
    },
    tabIconTextActive: {
        color: COLORS.primary,
    },
    tabLabel: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.primary,
        fontWeight: '600',
        marginTop: 1,
    },
    payButtonOuter: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -15,
    },
    payButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
    },
    payButtonActive: {
        backgroundColor: COLORS.primaryDark,
        shadowOpacity: 0.5,
    },
    payIcon: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: '700',
    },
});
