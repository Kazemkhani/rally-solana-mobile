export const COLORS = {
  background: '#0A0E1A',
  surface: '#141929',
  surfaceLight: '#1E2438',
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  secondary: '#8B5CF6',
  success: '#10B981',
  successDark: '#059669',
  error: '#EF4444',
  warning: '#F59E0B',
  text: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  border: '#1E293B',
  borderLight: '#334155',
} as const;

export const SOLANA_CLUSTER = 'devnet' as const;
export const SOLANA_RPC_URL = 'https://api.devnet.solana.com';

export const API_URL = __DEV__
  ? 'http://localhost:3001'
  : 'https://api.rally.app';

export const APP_NAME = 'Rally';
export const LAMPORTS_PER_SOL = 1_000_000_000;

export const SKR_MINT_ADDRESS = ''; // Set when SKR mint is known

export const TRUNCATE_ADDRESS = (address: string, chars = 4) =>
  `${address.slice(0, chars)}...${address.slice(-chars)}`;
