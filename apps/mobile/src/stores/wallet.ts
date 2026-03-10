import { create } from 'zustand';
import { api } from '../services/api';
import { useAuthStore } from './auth';

export type WalletProvider = 'phantom' | 'solflare' | 'backpack' | 'glow' | 'tiplink' | 'demo';

interface WalletState {
  publicKey: string | null;
  connected: boolean;
  connecting: boolean;
  balance: number;
  usdcBalance: number;
  skrBalance: number;
  walletProvider: WalletProvider | null;
  setPublicKey: (key: string | null) => void;
  setConnected: (connected: boolean) => void;
  setConnecting: (connecting: boolean) => void;
  setBalance: (balance: number) => void;
  setUsdcBalance: (balance: number) => void;
  setSkrBalance: (balance: number) => void;
  setWalletProvider: (provider: WalletProvider) => void;
  disconnect: () => void;
  onWalletConnected: (pubkey: string, displayName?: string) => Promise<void>;
  connectDemo: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  // Start disconnected — real wallet connection or demo mode populates these
  publicKey: null,
  connected: false,
  connecting: false,
  balance: 0,
  usdcBalance: 0,
  skrBalance: 0,
  walletProvider: null,

  setPublicKey: (key) => set({ publicKey: key }),
  setConnected: (connected) => set({ connected }),
  setConnecting: (connecting) => set({ connecting }),
  setBalance: (balance) => set({ balance }),
  setUsdcBalance: (usdcBalance) => set({ usdcBalance }),
  setSkrBalance: (skrBalance) => set({ skrBalance }),
  setWalletProvider: (provider) => set({ walletProvider: provider }),

  disconnect: () => {
    useAuthStore.getState().logout();
    set({
      publicKey: null,
      connected: false,
      connecting: false,
      balance: 0,
      usdcBalance: 0,
      skrBalance: 0,
      walletProvider: null,
    });
  },

  onWalletConnected: async (pubkey: string, displayName?: string) => {
    set({ publicKey: pubkey, connected: true, connecting: false });

    // Register with backend (or use pubkey as token in hackathon mode)
    try {
      await useAuthStore.getState().register(pubkey, displayName || 'Rally User');
    } catch (error) {
      // Fallback: set pubkey as auth token directly
      api.setAuthToken(pubkey);
      console.log('Auth registration fallback, using pubkey as token');
    }
  },

  // Demo mode: pre-populate with realistic data for hackathon demo
  connectDemo: () => {
    const demoPubkey = '7xKqR2mN5pWvLr8sYhX4J6zTbC9qE3nFp';
    api.setAuthToken(demoPubkey);
    useAuthStore.getState().register(demoPubkey, 'Alex').catch(() => {
      api.setAuthToken(demoPubkey);
    });
    set({
      publicKey: demoPubkey,
      connected: true,
      connecting: false,
      balance: 24.85,
      usdcBalance: 1247.50,
      skrBalance: 142,
      walletProvider: 'demo',
    });
  },
}));
