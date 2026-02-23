import { create } from 'zustand';

interface WalletState {
  publicKey: string | null;
  connected: boolean;
  connecting: boolean;
  balance: number;
  setPublicKey: (key: string | null) => void;
  setConnected: (connected: boolean) => void;
  setConnecting: (connecting: boolean) => void;
  setBalance: (balance: number) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  publicKey: null,
  connected: false,
  connecting: false,
  balance: 0,

  setPublicKey: (key) => set({ publicKey: key }),
  setConnected: (connected) => set({ connected }),
  setConnecting: (connecting) => set({ connecting }),
  setBalance: (balance) => set({ balance }),

  disconnect: () =>
    set({
      publicKey: null,
      connected: false,
      connecting: false,
      balance: 0,
    }),
}));
