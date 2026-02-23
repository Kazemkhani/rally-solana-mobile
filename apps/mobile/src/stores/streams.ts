import { create } from 'zustand';
import type { PaymentStream } from '../types';
import { MOCK_STREAMS } from '../data/mockData';

interface StreamState {
    streams: PaymentStream[];
    addStream: (stream: Omit<PaymentStream, 'id'>) => void;
    cancelStream: (id: string) => void;
    withdrawFromStream: (id: string, amount: number) => void;
}

export const useStreamStore = create<StreamState>((set) => ({
    streams: [...MOCK_STREAMS],

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

    withdrawFromStream: (id, amount) =>
        set((state) => ({
            streams: state.streams.map((s) =>
                s.id === id ? { ...s, totalWithdrawn: s.totalWithdrawn + amount } : s
            ),
        })),
}));
