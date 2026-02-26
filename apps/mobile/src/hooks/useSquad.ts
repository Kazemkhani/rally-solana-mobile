import { useCallback } from 'react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { useSolana } from './useSolana';
import { useSquadStore } from '../stores/squads';
import { SOLANA_CLUSTER } from '../utils/constants';
import { api } from '../services/api';

export function useSquad() {
  const { connection, publicKey } = useSolana();
  const { squads, activeSquadId, setActiveSquad, fetchSquads: storeFetchSquads } =
    useSquadStore();

  const activeSquad = squads.find((s) => s.id === activeSquadId) || null;

  const fetchSquads = useCallback(async () => {
    await storeFetchSquads();
  }, [storeFetchSquads]);

  const createSquad = useCallback(
    async (name: string, memberPubkeys: string[], emoji = '🏠') => {
      if (!publicKey) throw new Error('Wallet not connected');
      return useSquadStore.getState().createSquadOnApi(name, emoji, memberPubkeys);
    },
    [publicKey]
  );

  const depositToSquad = useCallback(
    async (squadId: string, amountSOL: number) => {
      if (!publicKey) throw new Error('Wallet not connected');

      const squad = squads.find((s) => s.id === squadId);
      if (!squad || !squad.vault) throw new Error('Squad not found');

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(squad.vault),
          lamports: Math.round(amountSOL * LAMPORTS_PER_SOL),
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await transact(async (wallet) => {
        await wallet.authorize({
          cluster: SOLANA_CLUSTER,
          identity: { name: 'Rally', uri: 'https://rally.app', icon: 'favicon.ico' },
        });

        const signedTx = await wallet.signTransactions({
          transactions: [transaction],
        });

        return connection.sendRawTransaction(signedTx[0].serialize());
      });

      await connection.confirmTransaction(signature, 'confirmed');

      // Log off-chain
      await api.logSquadTransaction(squadId, {
        type: 'POOL',
        amount: amountSOL,
        currency: 'SOL',
        txSignature: signature,
        memo: 'Squad deposit',
      }).catch(() => {});

      // Update local state
      useSquadStore.getState().depositToVault(squadId, 0, amountSOL);

      return signature;
    },
    [publicKey, connection, squads]
  );

  const getSquadBalance = useCallback(
    async (vaultAddress: string) => {
      try {
        const balance = await connection.getBalance(new PublicKey(vaultAddress));
        return balance / LAMPORTS_PER_SOL;
      } catch {
        return 0;
      }
    },
    [connection]
  );

  return {
    squads,
    activeSquad,
    fetchSquads,
    createSquad,
    depositToSquad,
    getSquadBalance,
    selectSquad: setActiveSquad,
  };
}
