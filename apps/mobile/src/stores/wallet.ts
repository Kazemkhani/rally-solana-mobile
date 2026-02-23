import { create } from 'zustand';

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

  disconnect: () =>
    set({
      publicKey: null,
      connected: false,
      connecting: false,
      balance: 0,
      usdcBalance: 0,
      skrBalance: 0,
    }),
}));
