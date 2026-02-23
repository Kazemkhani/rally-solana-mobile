import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../../src/utils/constants';

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
    return (
        <View style={styles.tabIconContainer}>
            <Text style={[styles.tabIconText, focused && styles.tabIconTextActive]}>
                {icon}
            </Text>
            {focused && (
                <Text style={styles.tabLabel}>{label}</Text>
            )}
        </View>
    );
}

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textMuted,
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="🏠" label="Home" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="squads"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="👥" label="Squads" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="pay"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.payButtonOuter}>
                            <View style={[styles.payButton, focused && styles.payButtonActive]}>
                                <Text style={styles.payIcon}>💸</Text>
                            </View>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="streams"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="〰️" label="Streams" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="👤" label="Profile" focused={focused} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: 'rgba(15, 15, 26, 0.95)',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        height: Platform.OS === 'ios' ? 88 : 68,
        paddingTop: SPACING.sm,
        paddingBottom: Platform.OS === 'ios' ? 28 : SPACING.sm,
        paddingHorizontal: SPACING.sm,
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
        fontSize: 22,
        opacity: 0.4,
    },
    tabIconTextActive: {
        opacity: 1,
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
        marginTop: -20,
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
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    payButtonActive: {
        backgroundColor: COLORS.primaryDark,
        shadowOpacity: 0.6,
    },
    payIcon: {
        fontSize: 24,
    },
});
