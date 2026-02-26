import { create } from 'zustand';
import type { Squad } from '../types';
import { MOCK_SQUADS } from '../data/mockData';
import { api, ApiSquad } from '../services/api';

interface SquadState {
  squads: Squad[];
  activeSquadId: string | null;
  loading: boolean;
  error: string | null;
  setSquads: (squads: Squad[]) => void;
  setActiveSquad: (id: string) => void;
  setLoading: (loading: boolean) => void;

  // API-integrated actions
  fetchSquads: () => Promise<void>;
  addSquad: (squad: Omit<Squad, 'id'>) => void;
  createSquadOnApi: (name: string, emoji: string, memberPubkeys: string[]) => Promise<Squad>;
  depositToVault: (squadId: string, amountUsdc: number, amountSol: number) => void;
  withdrawFromVault: (squadId: string, amountUsdc: number, amountSol: number) => void;
}

/** Convert an API squad to the frontend Squad type */
function apiSquadToSquad(apiSquad: ApiSquad): Squad {
  return {
    id: apiSquad.id,
    name: apiSquad.name,
    emoji: apiSquad.emoji || '🏠',
    members: (apiSquad.members || []).map((m) => ({
      id: m.id,
      name: m.userId,
      pubkey: m.userId,
      displayName: m.userId.slice(0, 8),
      avatar: m.role === 'OWNER' ? '🚀' : '👤',
      color: m.role === 'OWNER' ? '#8B5CF6' : '#3B82F6',
      role: m.role === 'OWNER' ? 'admin' as const : 'member' as const,
      joinedAt: new Date(m.joinedAt).getTime(),
    })),
    vault: apiSquad.onchainAddress || '',
    spendThreshold: 1_000_000_000,
    totalDeposited: 0,
    usdcBalance: 0,
    createdAt: new Date(apiSquad.createdAt).getTime(),
    lastActivity: apiSquad.transactions && apiSquad.transactions.length > 0
      ? `${apiSquad.transactions[0].type} · ${new Date(apiSquad.transactions[0].createdAt).toLocaleDateString()}`
      : 'No activity yet',
  };
}

export const useSquadStore = create<SquadState>((set, get) => ({
  squads: [...MOCK_SQUADS],
  activeSquadId: null,
  loading: false,
  error: null,

  setSquads: (squads) => set({ squads }),
  setActiveSquad: (id) => set({ activeSquadId: id }),
  setLoading: (loading) => set({ loading }),

  fetchSquads: async () => {
    set({ loading: true, error: null });
    try {
      const { squads } = await api.getSquads();
      const converted = squads.map(apiSquadToSquad);
      // Merge with mock data: API squads first, then mock squads as fallback
      if (converted.length > 0) {
        set({ squads: converted, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.log('API unavailable, using mock data:', error);
      set({ loading: false });
    }
  },

  addSquad: (squadData) =>
    set((state) => ({
      squads: [
        { ...squadData, id: Math.random().toString(36).substring(7) },
        ...state.squads,
      ],
    })),

  createSquadOnApi: async (name, emoji, memberPubkeys) => {
    set({ loading: true, error: null });
    try {
      const apiSquad = await api.createSquad(name, emoji, memberPubkeys);
      const squad = apiSquadToSquad(apiSquad);
      set((state) => ({
        squads: [squad, ...state.squads],
        loading: false,
      }));
      return squad;
    } catch (error) {
      // Fallback to local-only squad creation
      const localSquad: Squad = {
        id: Math.random().toString(36).substring(7),
        name,
        emoji,
        members: [],
        vault: '',
        spendThreshold: 1_000_000_000,
        totalDeposited: 0,
        usdcBalance: 0,
        createdAt: Date.now(),
        lastActivity: 'Just created',
      };
      set((state) => ({
        squads: [localSquad, ...state.squads],
        loading: false,
      }));
      return localSquad;
    }
  },

  depositToVault: (squadId, amountUsdc, amountSol) =>
    set((state) => ({
      squads: state.squads.map((s) =>
        s.id === squadId
          ? {
            ...s,
            usdcBalance: s.usdcBalance + amountUsdc,
            totalDeposited: s.totalDeposited + (amountSol * 1_000_000_000),
          }
          : s
      ),
    })),

  withdrawFromVault: (squadId, amountUsdc, amountSol) =>
    set((state) => ({
      squads: state.squads.map((s) =>
        s.id === squadId
          ? {
            ...s,
            usdcBalance: Math.max(0, s.usdcBalance - amountUsdc),
            totalDeposited: Math.max(0, s.totalDeposited - (amountSol * 1_000_000_000)),
          }
          : s
      ),
    })),
}));
