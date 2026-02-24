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
            <View style={[
                styles.tabIconBg,
                focused && styles.tabIconBgActive,
            ]}>
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
                                colors={['#A78BFA', '#7C3AED', '#6D28D9']}
                                style={[styles.payButton, focused && styles.payButtonActive]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.payIcon}>↑</Text>
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
        backgroundColor: 'rgba(12, 10, 22, 0.88)',
        borderTopWidth: 0,
        height: 64,
        paddingTop: 6,
        paddingBottom: 6,
        paddingHorizontal: 8,
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 28 : 16,
        left: 20,
        right: 20,
        borderRadius: 999,
        elevation: 12,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 24,
        ...Platform.select({
            web: {
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
            } as any,
            default: {},
        }),
    },
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
    },
    tabIconBg: {
        width: 36, height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIconBgActive: {
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
    },
    tabIconText: {
        fontSize: 20,
        color: '#4B5563',
    },
    tabIconTextActive: {
        color: COLORS.primary,
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
        marginTop: -20,
    },
    payButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
        elevation: 10,
    },
    payButtonActive: {
        shadowOpacity: 0.5,
    },
    payGlow: {
        position: 'absolute',
        width: 58, height: 58,
        borderRadius: 29,
        borderWidth: 1.5,
        borderColor: 'rgba(167, 139, 250, 0.25)',
    },
    payIcon: {
        fontSize: 22,
        color: '#FFFFFF',
        fontWeight: '700',
    },
});
