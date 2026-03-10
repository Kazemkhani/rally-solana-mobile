import { useCallback } from 'react';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { PublicKey, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWalletStore, WalletProvider } from '../stores/wallet';
import { SOLANA_CLUSTER, SOLANA_RPC_URL } from '../utils/constants';

const APP_IDENTITY = {
  name: 'Rally',
  uri: 'https://rally.app',
  icon: 'favicon.ico',
};

const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

export function useWallet() {
  const {
    publicKey,
    connected,
    connecting,
    walletProvider,
    setPublicKey,
    setConnected,
    setConnecting,
    setBalance,
    setUsdcBalance,
    setWalletProvider,
    disconnect: storeDisconnect,
    onWalletConnected,
    connectDemo,
  } = useWalletStore();

  // Fetch SOL balance from chain
  const fetchBalance = useCallback(async (pubkey: string) => {
    try {
      const pk = new PublicKey(pubkey);
      const lamports = await connection.getBalance(pk);
      const sol = lamports / LAMPORTS_PER_SOL;
      setBalance(sol);
    } catch (error) {
      console.log('Balance fetch failed (expected on demo mode):', error);
    }
  }, [setBalance]);

  // Connect via Mobile Wallet Adapter (works with Phantom, Solflare, Backpack, Glow)
  // The MWA protocol is wallet-agnostic — it opens whichever compliant wallet is installed
  const connect = useCallback(async (provider: WalletProvider = 'phantom') => {
    if (connecting || connected) return;

    // Demo mode — use mock data, no real wallet needed
    if (provider === 'demo') {
      connectDemo();
      return;
    }

    // Tip Link is web-based — for mobile, show a message
    if (provider === 'tiplink') {
      // In a production app, this would open a WebView or deep link
      // For the hackathon demo, we use demo mode as fallback
      connectDemo();
      return;
    }

    setConnecting(true);
    setWalletProvider(provider);
    try {
      await transact(async (wallet) => {
        // MWA opens the installed wallet (Phantom, Solflare, Backpack, Glow, etc.)
        const authResult = await wallet.authorize({
          cluster: SOLANA_CLUSTER,
          identity: APP_IDENTITY,
        });

        const pubkey = new PublicKey(authResult.accounts[0].address);
        const pubkeyStr = pubkey.toBase58();

        setPublicKey(pubkeyStr);
        setConnected(true);

        // Register with backend + fetch balance
        await onWalletConnected(pubkeyStr, authResult.accounts[0].label || 'Rally User');
        await fetchBalance(pubkeyStr);
      });
    } catch (error: any) {
      console.error(`${provider} connection failed:`, error);
      setConnected(false);
      setPublicKey(null);
      setWalletProvider(null as any);
      throw error;
    } finally {
      setConnecting(false);
    }
  }, [connecting, connected, setPublicKey, setConnected, setConnecting, setWalletProvider, onWalletConnected, fetchBalance, connectDemo]);

  const disconnect = useCallback(async () => {
    // Only deauthorize if we're using a real wallet (not demo mode)
    if (walletProvider && walletProvider !== 'demo' && walletProvider !== 'tiplink') {
      try {
        await transact(async (wallet) => {
          await wallet.deauthorize({
            auth_token: '',
          });
        });
      } catch {
        // Deauthorization may fail if wallet is not available, that's fine
      }
    }
    storeDisconnect();
  }, [storeDisconnect, walletProvider]);

  const signMessage = useCallback(
    async (message: Uint8Array) => {
      if (!connected) throw new Error('Wallet not connected');
      if (walletProvider === 'demo') {
        // Return mock signature for demo mode
        return new Uint8Array(64);
      }

      const signature = await transact(async (wallet) => {
        await wallet.authorize({
          cluster: SOLANA_CLUSTER,
          identity: APP_IDENTITY,
        });

        const signedMessages = await wallet.signMessages({
          addresses: [publicKey!],
          payloads: [message],
        });

        return signedMessages[0];
      });

      return signature;
    },
    [connected, publicKey, walletProvider]
  );

  // Refresh balance on demand
  const refreshBalance = useCallback(async () => {
    if (publicKey && walletProvider !== 'demo') {
      await fetchBalance(publicKey);
    }
  }, [publicKey, fetchBalance, walletProvider]);

  return {
    publicKey,
    connected,
    connecting,
    walletProvider,
    connect,
    disconnect,
    signMessage,
    refreshBalance,
  };
}
