import { Connection, PublicKey } from '@solana/web3.js';

export const SOLANA_RPC_URL =
  process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';

export const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

export const PROGRAM_IDS = {
  squad: process.env.PROGRAM_RALLY_SQUAD
    ? new PublicKey(process.env.PROGRAM_RALLY_SQUAD)
    : null,
  stream: process.env.PROGRAM_RALLY_STREAM
    ? new PublicKey(process.env.PROGRAM_RALLY_STREAM)
    : null,
  vote: process.env.PROGRAM_RALLY_VOTE
    ? new PublicKey(process.env.PROGRAM_RALLY_VOTE)
    : null,
};

export function getSquadVaultAddress(squadPubkey: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('vault'), squadPubkey.toBuffer()],
    PROGRAM_IDS.squad!
  );
}

export function getStreamAddress(
  senderPubkey: PublicKey,
  streamId: bigint
): [PublicKey, number] {
  const streamIdBuffer = Buffer.alloc(8);
  streamIdBuffer.writeBigUInt64LE(streamId);
  return PublicKey.findProgramAddressSync(
    [Buffer.from('stream'), senderPubkey.toBuffer(), streamIdBuffer],
    PROGRAM_IDS.stream!
  );
}
