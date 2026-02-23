import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { connection, getSquadVaultAddress } from '../config/solana';

export async function getBalance(pubkey: string): Promise<number> {
  const balance = await connection.getBalance(new PublicKey(pubkey));
  return balance / LAMPORTS_PER_SOL;
}

export async function getTokenBalance(
  pubkey: string,
  mintAddress: string
): Promise<number> {
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    new PublicKey(pubkey),
    { mint: new PublicKey(mintAddress) }
  );

  if (tokenAccounts.value.length === 0) return 0;
  return tokenAccounts.value[0].account.data.parsed.info.tokenAmount
    .uiAmount as number;
}

export async function verifyTransaction(signature: string): Promise<boolean> {
  try {
    const tx = await connection.getTransaction(signature, {
      commitment: 'confirmed',
    });
    return tx !== null && tx.meta?.err === null;
  } catch {
    return false;
  }
}

export async function getSquadVaultBalance(squadPubkey: string): Promise<number> {
  const [vaultAddress] = getSquadVaultAddress(new PublicKey(squadPubkey));
  const balance = await connection.getBalance(vaultAddress);
  return balance / LAMPORTS_PER_SOL;
}
