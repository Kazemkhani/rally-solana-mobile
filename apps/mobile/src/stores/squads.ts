import { create } from 'zustand';
import type { Squad } from '../types';

interface SquadState {
  squads: Squad[];
  activeSquad: Squad | null;
  loading: boolean;
  setSquads: (squads: Squad[]) => void;
  setActiveSquad: (squad: Squad | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useSquadStore = create<SquadState>((set) => ({
  squads: [],
  activeSquad: null,
  loading: false,

  setSquads: (squads) => set({ squads }),
  setActiveSquad: (squad) => set({ activeSquad: squad }),
  setLoading: (loading) => set({ loading }),
}));
