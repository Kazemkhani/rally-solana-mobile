import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Animated, Pressable } from 'react-native';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_SIZES } from '../../src/utils/constants';
import { useResponsive } from '../../src/hooks/useResponsive';
import { useWalletStore } from '../../src/stores/wallet';

// ─── Tab Config ───────────────────────────────────────────────
const TAB_ITEMS = [
    { name: 'home', icon: '⌂', iconFilled: '⌂', label: 'Home' },
    { name: 'squads', icon: '◇', iconFilled: '◆', label: 'Squads' },
    { name: 'pay', icon: '+', iconFilled: '+', label: 'Pay' },
    { name: 'streams', icon: '≋', iconFilled: '≋', label: 'Streams' },
    { name: 'profile', icon: '●', iconFilled: '●', label: 'Profile' },
];

// ─── Mobile Tab Icon ──────────────────────────────────────────
function TabIcon({ icon, iconFilled, label, focused }: { icon: string; iconFilled: string; label: string; focused: boolean }) {
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (focused) {
            Animated.sequence([
                Animated.timing(scale, { toValue: 0.8, duration: 50, useNativeDriver: true }),
                Animated.spring(scale, { toValue: 1, friction: 3, tension: 400, useNativeDriver: true }),
            ]).start();
        } else {
            Animated.timing(scale, { toValue: 1, duration: 150, useNativeDriver: true }).start();
        }
    }, [focused]);

    return (
        <Animated.View style={[styles.tabIconContainer, { transform: [{ scale }] }]}>
            <View style={styles.tabIconBg}>
                <Text style={[styles.tabIconText, focused && styles.tabIconTextActive]}>
                    {focused ? iconFilled : icon}
                </Text>
            </View>
            {focused && <Text style={styles.tabLabel}>{label}</Text>}
        </Animated.View>
    );
}

// ─── Desktop Sidebar ──────────────────────────────────────────
function DesktopSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { walletProvider, publicKey } = useWalletStore();

    const getActive = (name: string) => {
        if (name === 'home') return pathname === '/' || pathname === '/home' || pathname.includes('/home');
        return pathname.includes(`/${name}`);
    };

    return (
        <View style={sidebarStyles.container}>
            {/* Logo */}
            <View style={sidebarStyles.logoRow}>
                <LinearGradient
                    colors={['#b175ff', '#ff9c7a']}
                    style={sidebarStyles.logoIcon}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style={sidebarStyles.logoText}>R</Text>
                </LinearGradient>
                <Text style={sidebarStyles.logoName}>Rally</Text>
            </View>

            {/* Nav Items */}
            <View style={sidebarStyles.navList}>
                {TAB_ITEMS.map((item) => {
                    const active = getActive(item.name);
                    const isPay = item.name === 'pay';

                    return (
                        <Pressable
                            key={item.name}
                            style={[
                                sidebarStyles.navItem,
                                active && sidebarStyles.navItemActive,
                                isPay && sidebarStyles.navItemPay,
                            ]}
                            onPress={() => router.push(`/(tabs)/${item.name}` as any)}
                        >
                            {isPay ? (
                                <LinearGradient
                                    colors={['#b175ff', '#ff9c7a']}
                                    style={sidebarStyles.payIconWrap}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Text style={sidebarStyles.payIcon}>{item.icon}</Text>
                                </LinearGradient>
                            ) : (
                                <Text style={[sidebarStyles.navIcon, active && sidebarStyles.navIconActive]}>
                                    {active ? item.iconFilled : item.icon}
                                </Text>
                            )}
                            <Text style={[sidebarStyles.navLabel, active && sidebarStyles.navLabelActive]}>
                                {item.label}
                            </Text>
                            {active && <View style={sidebarStyles.activeIndicator} />}
                        </Pressable>
                    );
                })}
            </View>

            {/* Bottom: Connected Wallet */}
            <View style={sidebarStyles.bottomSection}>
                <View style={sidebarStyles.walletBadge}>
                    <View style={sidebarStyles.walletDot} />
                    <View style={sidebarStyles.walletInfo}>
                        <Text style={sidebarStyles.walletLabel}>
                            {walletProvider ? walletProvider.charAt(0).toUpperCase() + walletProvider.slice(1) : 'Not connected'}
                        </Text>
                        {publicKey && (
                            <Text style={sidebarStyles.walletPubkey}>
                                {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
                            </Text>
                        )}
                    </View>
                </View>
                <View style={sidebarStyles.networkBadge}>
                    <Text style={sidebarStyles.networkText}>Devnet</Text>
                </View>
            </View>
        </View>
    );
}

// ─── Main Layout ──────────────────────────────────────────────
export default function TabsLayout() {
    const { isDesktop } = useResponsive();

    // Desktop: custom sidebar + content area
    if (Platform.OS === 'web' && isDesktop) {
        return (
            <View style={desktopStyles.shell}>
                <DesktopSidebar />
                <View style={desktopStyles.content}>
                    <Tabs
                        screenOptions={{
                            headerShown: false,
                            tabBarStyle: { display: 'none' },
                            tabBarActiveTintColor: COLORS.primary,
                            tabBarInactiveTintColor: '#4B5563',
                            tabBarShowLabel: false,
                        }}
                    >
                        {TAB_ITEMS.map((item) => (
                            <Tabs.Screen key={item.name} name={item.name} options={{ tabBarIcon: () => null }} />
                        ))}
                    </Tabs>
                </View>
            </View>
        );
    }

    // Mobile: original floating pill tab bar
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

// ─── Desktop Shell Styles ─────────────────────────────────────
const desktopStyles = StyleSheet.create({
    shell: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
    },
});

// ─── Sidebar Styles ───────────────────────────────────────────
const SIDEBAR_WIDTH = 240;
const HAIRLINE = StyleSheet.hairlineWidth;

const sidebarStyles = StyleSheet.create({
    container: {
        width: SIDEBAR_WIDTH,
        backgroundColor: '#0a0a12',
        borderRightWidth: HAIRLINE,
        borderRightColor: 'rgba(255,255,255,0.06)',
        paddingTop: 32,
        paddingBottom: 24,
        paddingHorizontal: 16,
        justifyContent: 'flex-start',
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 8,
        paddingBottom: 32,
        borderBottomWidth: HAIRLINE,
        borderBottomColor: 'rgba(255,255,255,0.06)',
        marginBottom: 16,
    },
    logoIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 20,
        fontWeight: '900',
        color: '#FFFFFF',
    },
    logoName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    navList: {
        flex: 1,
        gap: 4,
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
        position: 'relative',
    },
    navItemActive: {
        backgroundColor: 'rgba(177, 117, 255, 0.08)',
    },
    navItemPay: {
        marginTop: 8,
        marginBottom: 8,
    },
    navIcon: {
        fontSize: 20,
        color: '#6e6e78',
        width: 28,
        textAlign: 'center',
    },
    navIconActive: {
        color: '#f0f0f5',
    },
    navLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: '#6e6e78',
    },
    navLabelActive: {
        color: '#f0f0f5',
        fontWeight: '600',
    },
    activeIndicator: {
        position: 'absolute',
        left: 0,
        top: '25%',
        bottom: '25%',
        width: 3,
        borderRadius: 2,
        backgroundColor: COLORS.primary,
    },
    payIconWrap: {
        width: 28,
        height: 28,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    payIcon: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    bottomSection: {
        paddingTop: 16,
        borderTopWidth: HAIRLINE,
        borderTopColor: 'rgba(255,255,255,0.06)',
        gap: 8,
    },
    walletBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 8,
    },
    walletDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#14F195',
    },
    walletInfo: {
        flex: 1,
    },
    walletLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#a1a1aa',
    },
    walletPubkey: {
        fontSize: 11,
        color: '#555',
        fontVariant: ['tabular-nums'],
        marginTop: 1,
    },
    networkBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: 'rgba(20, 241, 149, 0.08)',
        borderWidth: HAIRLINE,
        borderColor: 'rgba(20, 241, 149, 0.15)',
        marginLeft: 8,
    },
    networkText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#14F195',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
});

// ─── Mobile Tab Bar Styles ────────────────────────────────────
const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#111116',
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
        color: '#f0f0f5',
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
        marginTop: -32,
        backgroundColor: '#0a0a0f',
        borderRadius: 999,
        padding: 6,
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
