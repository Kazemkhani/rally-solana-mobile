import { create } from 'zustand';
import type { Squad, SquadMember } from '../types';
import { MOCK_SQUADS } from '../data/mockData';

interface SquadState {
  squads: Squad[];
  activeSquadId: string | null;
  loading: boolean;
  setSquads: (squads: Squad[]) => void;
  setActiveSquad: (id: string) => void;
  setLoading: (loading: boolean) => void;

  // New features
  addSquad: (squad: Omit<Squad, 'id'>) => void;
  depositToVault: (squadId: string, amountUsdc: number, amountSol: number) => void;
  withdrawFromVault: (squadId: string, amountUsdc: number, amountSol: number) => void;
}

export const useSquadStore = create<SquadState>((set) => ({
  squads: [...MOCK_SQUADS],
  activeSquadId: null,
  loading: false,

  setSquads: (squads) => set({ squads }),
  setActiveSquad: (id) => set({ activeSquadId: id }),
  setLoading: (loading) => set({ loading }),

  addSquad: (squadData) =>
    set((state) => ({
      squads: [
        { ...squadData, id: Math.random().toString(36).substring(7) },
        ...state.squads,
      ],
    })),

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
