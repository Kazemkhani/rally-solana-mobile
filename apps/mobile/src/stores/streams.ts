import { create } from 'zustand';
import type { PaymentStream } from '../types';
import { MOCK_STREAMS } from '../data/mockData';
import { api, ApiPaymentStream } from '../services/api';

interface StreamState {
  streams: PaymentStream[];
  loading: boolean;
  error: string | null;

  // API-integrated actions
  fetchStreams: (userPubkey: string) => Promise<void>;
  addStream: (stream: Omit<PaymentStream, 'id'>) => void;
  cancelStream: (id: string) => void;
  cancelStreamOnApi: (id: string) => Promise<void>;
  withdrawFromStream: (id: string, amount: number) => void;
}

/** Convert an API stream to the frontend PaymentStream type */
function apiStreamToStream(stream: ApiPaymentStream, userPubkey: string): PaymentStream {
  const isIncoming = stream.recipientPubkey === userPubkey;
  const startTime = Math.floor(new Date(stream.startTime).getTime() / 1000);
  const endTime = Math.floor(new Date(stream.endTime).getTime() / 1000);
  const duration = endTime - startTime;
  const totalDeposited = stream.amountPerSecond * duration;
  const ratePerHour = stream.amountPerSecond * 3600;

  return {
    id: stream.id,
    sender: stream.senderPubkey,
    senderName: isIncoming ? stream.senderPubkey.slice(0, 8) : 'You',
    senderAvatar: isIncoming ? '👤' : '🚀',
    recipient: stream.recipientPubkey,
    recipientName: isIncoming ? 'You' : stream.recipientPubkey.slice(0, 8),
    recipientAvatar: isIncoming ? '🚀' : '👤',
    amountPerSecond: stream.amountPerSecond,
    currency: 'SOL',
    startTime,
    endTime,
    totalDeposited,
    totalWithdrawn: 0,
    isActive: stream.status === 'ACTIVE',
    isCancelled: stream.status === 'CANCELLED',
    rateLabel: `${ratePerHour.toFixed(3)} SOL / hour`,
  };
}

export const useStreamStore = create<StreamState>((set) => ({
  streams: [...MOCK_STREAMS],
  loading: false,
  error: null,

  fetchStreams: async (userPubkey: string) => {
    set({ loading: true, error: null });
    try {
      const { streams } = await api.getStreams();
      const converted = streams.map((s) => apiStreamToStream(s, userPubkey));
      if (converted.length > 0) {
        set({ streams: converted, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.log('API unavailable for streams, using mock data:', error);
      set({ loading: false });
    }
  },

  addStream: (streamData) =>
    set((state) => ({
      streams: [
        { ...streamData, id: Math.random().toString(36).substring(7) },
        ...state.streams,
      ],
    })),

  cancelStream: (id) =>
    set((state) => ({
      streams: state.streams.map((s) =>
        s.id === id ? { ...s, isActive: false, isCancelled: true, endTime: Math.floor(Date.now() / 1000) } : s
      ),
    })),

  cancelStreamOnApi: async (id: string) => {
    try {
      await api.cancelStream(id);
      set((state) => ({
        streams: state.streams.map((s) =>
          s.id === id ? { ...s, isActive: false, isCancelled: true, endTime: Math.floor(Date.now() / 1000) } : s
        ),
      }));
    } catch (error) {
      console.error('Failed to cancel stream on API:', error);
    }
  },

  withdrawFromStream: (id, amount) =>
    set((state) => ({
      streams: state.streams.map((s) =>
        s.id === id ? { ...s, totalWithdrawn: s.totalWithdrawn + amount } : s
      ),
    })),
}));
