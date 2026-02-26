import { create } from 'zustand';
import type { Transaction } from '../types';
import { MOCK_TRANSACTIONS } from '../data/mockData';
import { api, ApiTransaction } from '../services/api';

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;

  fetchTransactions: () => Promise<void>;
  addTransaction: (tx: Transaction) => void;
}

/** Convert an API transaction to the frontend Transaction type */
function apiTxToTransaction(tx: ApiTransaction): Transaction {
  const amount = parseFloat(tx.amount);
  return {
    id: tx.id,
    type: tx.type.toLowerCase() as Transaction['type'],
    amount,
    currency: tx.currency as 'SOL' | 'USDC' | 'SKR',
    from: tx.fromPubkey,
    to: tx.toPubkey,
    fromName: tx.fromPubkey.slice(0, 8),
    toName: tx.toPubkey.slice(0, 8),
    fromAvatar: '👤',
    toAvatar: '👤',
    timestamp: new Date(tx.createdAt).getTime(),
    status: tx.status.toLowerCase() as Transaction['status'],
    memo: tx.memo || undefined,
  };
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [...MOCK_TRANSACTIONS],
  loading: false,
  error: null,

  fetchTransactions: async () => {
    set({ loading: true, error: null });
    try {
      const { transactions } = await api.getTransactions();
      const converted = transactions.map(apiTxToTransaction);
      if (converted.length > 0) {
        set({ transactions: converted, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.log('API unavailable for transactions, using mock data:', error);
      set({ loading: false });
    }
  },

  addTransaction: (tx) =>
    set((state) => ({
      transactions: [tx, ...state.transactions],
    })),
}));
