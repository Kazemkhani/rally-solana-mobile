import { useCallback } from 'react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { useSolana } from './useSolana';
import { useSquadStore } from '../stores/squads';
import { SOLANA_CLUSTER, API_URL } from '../utils/constants';
import type { Squad } from '../types';

export function useSquad() {
  const { connection, publicKey } = useSolana();
  const { squads, activeSquad, setSquads, setActiveSquad, setLoading } =
    useSquadStore();

  const fetchSquads = useCallback(async () => {
    if (!publicKey) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/squads`, {
        headers: {
          Authorization: `Bearer ${publicKey.toBase58()}`,
        },
      });
      const data = await response.json();
      setSquads(data.squads);
    } catch (error) {
      console.error('Failed to fetch squads:', error);
    } finally {
      setLoading(false);
    }
  }, [publicKey, setSquads, setLoading]);

  const createSquad = useCallback(
    async (name: string, memberPubkeys: string[]) => {
      if (!publicKey) throw new Error('Wallet not connected');

      // Create squad on-chain via the rally-squad program
      // For hackathon: simplified — create via API which triggers program
      const response = await fetch(`${API_URL}/api/squads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicKey.toBase58()}`,
        },
        body: JSON.stringify({ name, members: memberPubkeys }),
      });

      if (!response.ok) throw new Error('Failed to create squad');

      const squad: Squad = await response.json();
      await fetchSquads();
      return squad;
    },
    [publicKey, fetchSquads]
  );

  const depositToSquad = useCallback(
    async (squadId: string, amountSOL: number) => {
      if (!publicKey) throw new Error('Wallet not connected');

      const squad = squads.find((s) => s.id === squadId);
      if (!squad) throw new Error('Squad not found');

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
      await fetch(`${API_URL}/api/squads/${squadId}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicKey.toBase58()}`,
        },
        body: JSON.stringify({
          type: 'POOL',
          amount: amountSOL,
          currency: 'SOL',
          txSignature: signature,
          memo: 'Squad deposit',
        }),
      });

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
