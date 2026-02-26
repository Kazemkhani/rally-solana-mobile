import { create } from 'zustand';
import { api, ApiUser } from '../services/api';

interface AuthState {
  token: string | null;
  user: ApiUser | null;
  isRegistered: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  register: (pubkey: string, displayName: string) => Promise<void>;
  loadProfile: () => Promise<void>;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isRegistered: false,
  isLoading: false,
  error: null,

  register: async (pubkey: string, displayName: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await api.registerUser(pubkey, displayName);
      api.setAuthToken(token);
      set({ token, user, isRegistered: true, isLoading: false });
    } catch (error) {
      // Fallback: use pubkey directly as auth token (hackathon mode)
      api.setAuthToken(pubkey);
      set({
        token: pubkey,
        user: {
          id: pubkey,
          pubkey,
          displayName,
          avatar: null,
          fcmToken: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        isRegistered: true,
        isLoading: false,
        error: null,
      });
    }
  },

  loadProfile: async () => {
    const { token } = get();
    if (!token) return;

    set({ isLoading: true });
    try {
      api.setAuthToken(token);
      const { user } = await api.getProfile();
      set({ user, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: 'Failed to load profile' });
    }
  },

  setToken: (token: string) => {
    api.setAuthToken(token);
    set({ token });
  },

  logout: () => {
    api.clearAuthToken();
    set({ token: null, user: null, isRegistered: false, error: null });
  },
}));
