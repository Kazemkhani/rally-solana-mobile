import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch,
  Platform, Modal, Animated, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Copy, Lock, Bell, Settings, LogOut, Check, Activity, Users, Flame, ChevronRight } from 'lucide-react-native';

import ScreenWrapper from '../components/ScreenWrapper';
import AnimatedPressable from '../components/AnimatedPressable';
import { showToast } from '../components/Toast';
import { MOCK_USER } from '../data/mockData';
import { useWalletStore } from '../stores/wallet';

const HAIRLINE = StyleSheet.hairlineWidth;

export default function ProfileScreen() {
  const { balance, usdcBalance, skrBalance, disconnect } = useWalletStore();
  const [biometrics, setBiometrics] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const entranceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entranceAnim, {
      toValue: 1, duration: 400, useNativeDriver: true,
    }).start();
  }, []);

  const tokenData = [
    { symbol: 'SOL', name: 'Solana', balance, usdValue: balance * 145, color: '#9945FF' },
    { symbol: 'USDC', name: 'USD Coin', balance: usdcBalance, usdValue: usdcBalance, color: '#2775CA' },
    { symbol: 'SKR', name: 'Seeker', balance: skrBalance, usdValue: skrBalance * 0.20, color: '#F59E0B' },
  ];

  const handleCopy = () => {
    setCopied(true);
    showToast('Address copied', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDisconnect = () => {
    setShowDisconnect(true);
  };

  const confirmDisconnect = () => {
    setShowDisconnect(false);
    disconnect();
    showToast('Wallet disconnected', 'info');
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showToast('Profile refreshed', 'success');
    }, 800);
  };

  return (
    <ScreenWrapper accentStrength={0}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ffffff" />
          }
        >
          {/* SOTA Profile Header */}
          <Animated.View style={[styles.profileHeader, {
            opacity: entranceAnim,
            transform: [{ translateY: entranceAnim.interpolate({ inputRange: [0, 1], outputRange: [15, 0] }) }],
          }]}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#8B5CF6', '#3B82F6', '#10B981']}
                style={styles.avatarMesh}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.avatarBorder} />
            </View>

            <Text style={styles.displayName}>{MOCK_USER.displayName}</Text>

            <AnimatedPressable
              scaleDepth={0.96}
              onPress={handleCopy}
              style={styles.addressPill}
            >
              <Text style={styles.addressText}>
                {MOCK_USER.pubkey.slice(0, 6)}...{MOCK_USER.pubkey.slice(-4)}
              </Text>
              {copied ? (
                <Check size={14} color="#10B981" strokeWidth={2.5} />
              ) : (
                <Copy size={14} color="#888888" strokeWidth={2} />
              )}
            </AnimatedPressable>
          </Animated.View>

          {/* Bento Box Stats */}
          <View style={styles.bentoContainer}>
            <View style={styles.bentoRow}>
              <View style={[styles.bentoCard, { flex: 1.2 }]}>
                <View style={styles.bentoHeader}>
                  <Users size={16} color="#888888" />
                  <Text style={styles.bentoLabel}>Squads</Text>
                </View>
                <Text style={styles.bentoValue}>{MOCK_USER.squads.length}</Text>
              </View>

              <View style={[styles.bentoCard, { flex: 1 }]}>
                <View style={styles.bentoHeader}>
                  <Activity size={16} color="#888888" />
                  <Text style={styles.bentoLabel}>Txns</Text>
                </View>
                <Text style={styles.bentoValue}>24</Text>
              </View>

              <View style={[styles.bentoCard, { flex: 1 }]}>
                <View style={styles.bentoHeader}>
                  <Flame size={16} color="#F59E0B" />
                  <Text style={styles.bentoLabel}>Streak</Text>
                </View>
                <Text style={styles.bentoValue}>{MOCK_USER.streakDays}</Text>
              </View>
            </View>
          </View>

          {/* SOTA Vertical Assets List */}
          <Text style={styles.sectionTitle}>Assets</Text>
          <View style={styles.listContainer}>
            {Platform.OS !== 'android' && (
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            )}
            <View style={styles.listInnerContainer}>
              {tokenData.map((token, index) => (
                <View key={token.symbol}>
                  <AnimatedPressable scaleDepth={0.98} style={styles.assetRow}>
                    <View style={styles.assetLeft}>
                      <View style={[styles.assetIconBox, { backgroundColor: `${token.color}20` }]}>
                        <View style={[styles.assetIconInner, { backgroundColor: token.color }]} />
                      </View>
                      <View style={styles.assetTextStack}>
                        <Text style={styles.assetName}>{token.name}</Text>
                        <Text style={styles.assetSymbol}>{token.symbol}</Text>
                      </View>
                    </View>
                    <View style={styles.assetRight}>
                      <Text style={styles.assetBalance}>
                        {token.balance.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </Text>
                      <Text style={styles.assetUsd}>
                        ${token.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Text>
                    </View>
                  </AnimatedPressable>
                  {index < tokenData.length - 1 && <View style={styles.listDivider} />}
                </View>
              ))}
            </View>
          </View>

          {/* SOTA Settings List */}
          <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Settings</Text>
          <View style={styles.listContainer}>
            {Platform.OS !== 'android' && (
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            )}
            <View style={styles.listInnerContainer}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIconWrap}>
                    <Lock size={18} color="#ffffff" strokeWidth={2} />
                  </View>
                  <Text style={styles.settingLabel}>Biometric Lock</Text>
                </View>
                <Switch
                  value={biometrics}
                  onValueChange={setBiometrics}
                  trackColor={{ false: '#222222', true: '#ffffff' }}
                  thumbColor={biometrics ? '#000000' : '#888888'}
                  ios_backgroundColor="#222222"
                />
              </View>
              <View style={styles.listDivider} />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIconWrap}>
                    <Bell size={18} color="#ffffff" strokeWidth={2} />
                  </View>
                  <Text style={styles.settingLabel}>Notifications</Text>
                </View>
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: '#222222', true: '#ffffff' }}
                  thumbColor={notifications ? '#000000' : '#888888'}
                  ios_backgroundColor="#222222"
                />
              </View>
              <View style={styles.listDivider} />

              <AnimatedPressable scaleDepth={0.98} style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIconWrap}>
                    <Settings color="#ffffff" size={18} strokeWidth={2} />
                  </View>
                  <Text style={styles.settingLabel}>Network</Text>
                </View>
                <View style={styles.settingRightBadge}>
                  <Text style={styles.settingRightBadgeText}>Devnet</Text>
                  <ChevronRight size={16} color="#555555" />
                </View>
              </AnimatedPressable>
              <View style={styles.listDivider} />

              <AnimatedPressable scaleDepth={0.98} style={styles.settingRow} onPress={handleDisconnect}>
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIconWrap, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                    <LogOut color="#EF4444" size={18} strokeWidth={2} />
                  </View>
                  <Text style={[styles.settingLabel, { color: '#EF4444' }]}>Disconnect Wallet</Text>
                </View>
              </AnimatedPressable>
            </View>
          </View>

          <Text style={styles.versionText}>Rally v0.1.0</Text>
        </ScrollView>

        <Modal visible={showDisconnect} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalIconWrap}>
                <LogOut size={24} color="#EF4444" strokeWidth={2} />
              </View>
              <Text style={styles.modalTitle}>Disconnect Wallet</Text>
              <Text style={styles.modalSub}>Are you sure you want to disconnect? You will need to sign in again.</Text>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalCancel} onPress={() => setShowDisconnect(false)}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalDanger} onPress={confirmDisconnect}>
                  <Text style={styles.modalDangerText}>Disconnect</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },

  // Profile Header (SOTA)
  profileHeader: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    position: 'relative',
    marginBottom: 16,
  },
  avatarMesh: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  avatarBorder: {
    position: 'absolute',
    top: -2, left: -2, right: -2, bottom: -2,
    borderRadius: 42,
    borderWidth: HAIRLINE,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  displayName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  addressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#111111',
    borderWidth: HAIRLINE,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addressText: {
    fontSize: 13,
    color: '#888888',
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },

  // Bento Box
  bentoContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bentoCard: {
    backgroundColor: '#111111',
    borderWidth: HAIRLINE,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 16,
  },
  bentoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  bentoLabel: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  bentoValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.5,
  },

  // Lists (Assets & Settings)
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    letterSpacing: -0.2,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  listContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    backgroundColor: Platform.OS === 'android' ? '#111111' : 'rgba(17, 17, 17, 0.4)',
    borderWidth: HAIRLINE,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  listInnerContainer: {
    paddingVertical: 4,
  },
  listDivider: {
    height: HAIRLINE,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginHorizontal: 16,
  },

  // Asset Item
  assetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  assetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  assetIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetIconInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  assetTextStack: {
    gap: 2,
  },
  assetName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  assetSymbol: {
    fontSize: 13,
    color: '#888888',
    letterSpacing: -0.2,
  },
  assetRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  assetBalance: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  assetUsd: {
    fontSize: 13,
    color: '#888888',
    fontVariant: ['tabular-nums'],
  },

  // Setting Item
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  settingRightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  settingRightBadgeText: {
    fontSize: 14,
    color: '#888888',
  },

  versionText: {
    fontSize: 12,
    color: '#444444',
    textAlign: 'center',
    marginTop: 32,
    fontWeight: '500',
    letterSpacing: -0.2,
  },

  // Modal (SOTA style)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    ...Platform.select({
      web: { backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' } as any,
    }),
  },
  modalContent: {
    backgroundColor: '#111111',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: HAIRLINE,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#222222',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
  },
  modalDanger: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
  },
  modalDangerText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
  },
});
