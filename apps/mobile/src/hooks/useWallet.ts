import { useCallback } from 'react';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { PublicKey } from '@solana/web3.js';
import { useWalletStore } from '../stores/wallet';
import { SOLANA_CLUSTER } from '../utils/constants';

const APP_IDENTITY = {
  name: 'Rally',
  uri: 'https://rally.app',
  icon: 'favicon.ico',
};

export function useWallet() {
  const {
    publicKey,
    connected,
    connecting,
    setPublicKey,
    setConnected,
    setConnecting,
    disconnect: storeDisconnect,
  } = useWalletStore();

  const connect = useCallback(async () => {
    if (connecting || connected) return;

    setConnecting(true);
    try {
      await transact(async (wallet) => {
        const authResult = await wallet.authorize({
          cluster: SOLANA_CLUSTER,
          identity: APP_IDENTITY,
        });

        const pubkey = new PublicKey(authResult.accounts[0].address);
        setPublicKey(pubkey.toBase58());
        setConnected(true);
      });
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    } finally {
      setConnecting(false);
    }
  }, [connecting, connected, setPublicKey, setConnected, setConnecting]);

  const disconnect = useCallback(async () => {
    try {
      await transact(async (wallet) => {
        await wallet.deauthorize({
          auth_token: '', // Clears authorization
        });
      });
    } catch {
      // Deauthorization may fail if wallet is not available, that's fine
    } finally {
      storeDisconnect();
    }
  }, [storeDisconnect]);

  const signMessage = useCallback(
    async (message: Uint8Array) => {
      if (!connected) throw new Error('Wallet not connected');

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
    [connected, publicKey]
  );

  return {
    publicKey,
    connected,
    connecting,
    connect,
    disconnect,
    signMessage,
  };
}
