import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Animated } from 'react-native';
import { Tabs } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_SIZES } from '../../src/utils/constants';

function TabIcon({ icon, iconFilled, label, focused }: { icon: string; iconFilled: string; label: string; focused: boolean }) {
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (focused) {
            Animated.sequence([
                Animated.timing(scale, {
                    toValue: 0.8, duration: 50, useNativeDriver: true,
                }),
                Animated.spring(scale, {
                    toValue: 1, friction: 3, tension: 400, useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.timing(scale, {
                toValue: 1, duration: 150, useNativeDriver: true,
            }).start();
        }
    }, [focused]);

    return (
        <Animated.View style={[styles.tabIconContainer, { transform: [{ scale }] }]}>
            {/* Active indicator dot */}
            <View style={styles.tabIconBg}>
                <Text style={[styles.tabIconText, focused && styles.tabIconTextActive]}>
                    {focused ? iconFilled : icon}
                </Text>
            </View>
            {focused && <Text style={styles.tabLabel}>{label}</Text>}
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
                tabBarInactiveTintColor: '#4B5563',
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
                            <LinearGradient
                                colors={['#b175ff', '#ff9c7a']}
                                style={[styles.payButton, focused && styles.payButtonActive]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.payIcon}>+</Text>
                            </LinearGradient>
                            {/* Gradient ring glow */}
                            <View style={styles.payGlow} />
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
        backgroundColor: '#111116', // solid dark charcoal
        borderTopWidth: 0,
        height: 64,
        paddingTop: 6,
        paddingBottom: 6,
        paddingHorizontal: 12,
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 28 : 16,
        left: 20,
        right: 20,
        borderRadius: 999,
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.6,
        shadowRadius: 24,
    },
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
    },
    tabIconBg: {
        width: 36, height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIconText: {
        fontSize: 20,
        color: '#6e6e78',
    },
    tabIconTextActive: {
        color: '#f0f0f5', // off-white for highlighted state
    },
    tabLabel: {
        fontSize: 9,
        color: COLORS.primary,
        fontWeight: '600',
        marginTop: 1,
        letterSpacing: 0.3,
    },
    payButtonOuter: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -32, // More overlap!
        backgroundColor: '#0a0a0f', // Match background behind pill
        borderRadius: 999,
        padding: 6, // border gap
    },
    payButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#ff9c7a',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 16,
        elevation: 10,
    },
    payButtonActive: {
        shadowOpacity: 0.6,
    },
    payGlow: {
        position: 'absolute',
        width: 68, height: 68,
        borderRadius: 34,
        borderWidth: 1,
        borderColor: 'rgba(255, 156, 122, 0.15)',
    },
    payIcon: {
        fontSize: 26,
        color: '#FFFFFF',
        fontWeight: '700',
    },
});
