import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { useCallback, useMemo } from 'react';
import { useWalletStore } from '../stores/wallet';
import { SOLANA_CLUSTER, SOLANA_RPC_URL } from '../utils/constants';

export function useSolana() {
  const { publicKey, setBalance } = useWalletStore();

  const connection = useMemo(
    () => new Connection(SOLANA_RPC_URL, 'confirmed'),
    []
  );

  const refreshBalance = useCallback(async () => {
    if (!publicKey) return 0;
    try {
      const balance = await connection.getBalance(new PublicKey(publicKey));
      const solBalance = balance / LAMPORTS_PER_SOL;
      setBalance(solBalance);
      return solBalance;
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      return 0;
    }
  }, [publicKey, connection, setBalance]);

  const sendSOL = useCallback(
    async (recipientPubkey: string, amountSOL: number) => {
      if (!publicKey) throw new Error('Wallet not connected');

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(publicKey),
          toPubkey: new PublicKey(recipientPubkey),
          lamports: Math.round(amountSOL * LAMPORTS_PER_SOL),
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = new PublicKey(publicKey);

      const signature = await transact(async (wallet) => {
        const authResult = await wallet.authorize({
          cluster: SOLANA_CLUSTER,
          identity: {
            name: 'Rally',
            uri: 'https://rally.app',
            icon: 'favicon.ico',
          },
        });

        const signedTx = await wallet.signTransactions({
          transactions: [transaction],
        });

        const sig = await connection.sendRawTransaction(
          signedTx[0].serialize()
        );
        return sig;
      });

      await connection.confirmTransaction(signature, 'confirmed');
      await refreshBalance();
      return signature;
    },
    [publicKey, connection, refreshBalance]
  );

  const getTokenBalance = useCallback(
    async (mintAddress: string) => {
      if (!publicKey) return 0;
      try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          new PublicKey(publicKey),
          { mint: new PublicKey(mintAddress) }
        );
        if (tokenAccounts.value.length === 0) return 0;
        return tokenAccounts.value[0].account.data.parsed.info.tokenAmount
          .uiAmount as number;
      } catch {
        return 0;
      }
    },
    [publicKey, connection]
  );

  return {
    connection,
    publicKey: publicKey ? new PublicKey(publicKey) : null,
    refreshBalance,
    sendSOL,
    getTokenBalance,
  };
}
