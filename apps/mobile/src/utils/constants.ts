export const COLORS = {
  // Core backgrounds (deep space/charcoal base)
  background: '#04040a',
  surface: '#0d0d14',
  surfaceElevated: '#1a1824',
  surfaceInput: '#14121a',

  // Accent (Warm/Cinematic Purple & Amber)
  primary: '#b175ff',
  primaryDark: '#8a4dee',
  primaryLight: '#d2a8ff',
  primaryGlow: 'rgba(177, 117, 255, 0.15)',
  primarySubtle: 'rgba(177, 117, 255, 0.08)',
  secondary: '#ff9c7a',
  secondaryGlow: 'rgba(255, 156, 122, 0.15)',

  // Functional
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  streamBlue: '#3B82F6',
  solanaGreen: '#14F195',

  // Text
  text: '#FFFFFF',
  textSecondary: '#6B7280',
  textTertiary: '#4B5563',

  // Borders & Dividers
  border: 'rgba(255,255,255,0.04)',
  divider: 'rgba(255,255,255,0.04)',

  // Legacy aliases (keep for any untouched files)
  card: '#111122',
  surfaceLight: '#1A1A35',
  textMuted: '#4B5563',
  splitGreen: '#10B981',
  error: '#EF4444',
  errorLight: '#FCA5A5',
  success_dark: '#059669',
  borderLight: 'rgba(255,255,255,0.06)',
  glass: 'rgba(139, 92, 246, 0.08)',
  glassBorder: 'rgba(139, 92, 246, 0.15)',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

export const FONT_SIZES = {
  caption: 12,
  xs: 11,
  sm: 13,
  md: 14,
  lg: 15,
  xl: 16,
  xxl: 18,
  section: 18,
  title: 28,
  balance: 42,
  hero: 56,
} as const;

export const FONT_WEIGHTS = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

import { Platform } from 'react-native';

export const SOLANA_CLUSTER = 'devnet' as const;
export const SOLANA_RPC_URL = 'https://api.devnet.solana.com';

export const API_URL = __DEV__
  ? Platform.OS === 'android'
    ? 'http://10.0.2.2:3001'
    : 'http://localhost:3001'
  : 'https://api.rally.app';

export const APP_NAME = 'Rally';
export const APP_VERSION = '0.1.0';
export const LAMPORTS_PER_SOL = 1_000_000_000;

export const SKR_MINT_ADDRESS = '';

export const TRUNCATE_ADDRESS = (address: string, chars = 4) =>
  `${address.slice(0, chars)}...${address.slice(-chars)}`;
