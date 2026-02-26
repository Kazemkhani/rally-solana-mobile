import { create } from 'zustand';
import { api } from '../services/api';
import { useAuthStore } from './auth';

interface WalletState {
  publicKey: string | null;
  connected: boolean;
  connecting: boolean;
  balance: number;
  usdcBalance: number;
  skrBalance: number;
  setPublicKey: (key: string | null) => void;
  setConnected: (connected: boolean) => void;
  setConnecting: (connecting: boolean) => void;
  setBalance: (balance: number) => void;
  setUsdcBalance: (balance: number) => void;
  setSkrBalance: (balance: number) => void;
  disconnect: () => void;
  onWalletConnected: (pubkey: string, displayName?: string) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
  // Pre-populated for demo
  publicKey: '7xKqR2mN5pWvLr8sYhX4J6zTbC9qE3nFp',
  connected: true,
  connecting: false,
  balance: 24.85,
  usdcBalance: 1247.50,
  skrBalance: 142,

  setPublicKey: (key) => set({ publicKey: key }),
  setConnected: (connected) => set({ connected }),
  setConnecting: (connecting) => set({ connecting }),
  setBalance: (balance) => set({ balance }),
  setUsdcBalance: (usdcBalance) => set({ usdcBalance }),
  setSkrBalance: (skrBalance) => set({ skrBalance }),

  disconnect: () => {
    useAuthStore.getState().logout();
    set({
      publicKey: null,
      connected: false,
      connecting: false,
      balance: 0,
      usdcBalance: 0,
      skrBalance: 0,
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
}));
