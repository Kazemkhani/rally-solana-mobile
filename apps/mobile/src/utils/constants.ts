export const COLORS = {
  // Core
  background: '#0F0F1A',
  surface: '#1A1A2E',
  surfaceLight: '#252540',
  card: '#1A1A2E',

  // Accent
  primary: '#8B5CF6',       // Purple
  primaryDark: '#7C3AED',
  primaryLight: '#A78BFA',
  secondary: '#6366F1',     // Indigo
  splitGreen: '#10B981',    // Green for split actions
  streamBlue: '#3B82F6',    // Blue for stream actions

  // Status
  success: '#10B981',
  successDark: '#059669',
  error: '#EF4444',
  errorLight: '#FCA5A5',
  warning: '#F59E0B',

  // Text
  text: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',

  // Border
  border: 'rgba(255,255,255,0.05)',
  borderLight: 'rgba(255,255,255,0.1)',

  // Glass
  glass: 'rgba(139, 92, 246, 0.08)',
  glassBorder: 'rgba(139, 92, 246, 0.2)',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

export const FONT_SIZES = {
  xs: 11,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  display: 48,
  hero: 56,
} as const;

export const SOLANA_CLUSTER = 'devnet' as const;
export const SOLANA_RPC_URL = 'https://api.devnet.solana.com';

export const API_URL = __DEV__
  ? 'http://localhost:3001'
  : 'https://api.rally.app';

export const APP_NAME = 'Rally';
export const APP_VERSION = '0.1.0';
export const LAMPORTS_PER_SOL = 1_000_000_000;

export const SKR_MINT_ADDRESS = ''; // Set when SKR mint is known

export const TRUNCATE_ADDRESS = (address: string, chars = 4) =>
  `${address.slice(0, chars)}...${address.slice(-chars)}`;
