import { API_URL } from '../utils/constants';
import type { Squad, Transaction, PaymentStream, UserProfile } from '../types';

// ─── API RESPONSE TYPES ───────────────────────────────────────
export interface ApiUser {
  id: string;
  pubkey: string;
  displayName: string;
  avatar: string | null;
  fcmToken: string | null;
  createdAt: string;
  updatedAt: string;
  squads?: Array<{ squad: ApiSquad }>;
}

export interface ApiSquad {
  id: string;
  name: string;
  emoji: string;
  description: string | null;
  avatar: string | null;
  onchainAddress: string;
  createdAt: string;
  members: ApiSquadMembership[];
  transactions?: ApiTransaction[];
}

export interface ApiSquadMembership {
  id: string;
  userId: string;
  squadId: string;
  role: string;
  joinedAt: string;
}

export interface ApiTransaction {
  id: string;
  type: string;
  amount: string; // Decimal comes as string from Prisma
  currency: string;
  fromPubkey: string;
  toPubkey: string;
  squadId: string | null;
  txSignature: string;
  memo: string | null;
  status: string;
  createdAt: string;
}

export interface ApiPaymentStream {
  id: string;
  onchainAddress: string;
  senderPubkey: string;
  recipientPubkey: string;
  amountPerSecond: number;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
}

export interface ApiProposal {
  id: string;
  squadId: string;
  onchainAddress: string;
  title: string;
  description: string;
  amount: string;
  recipientPubkey: string;
  deadline: string;
  status: string;
  createdAt: string;
  squad?: { name: string; emoji: string };
}

export interface RegisterResponse {
  user: ApiUser;
  token: string;
}

// ─── API CLIENT ───────────────────────────────────────────────
class ApiService {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor() {
    this.baseUrl = API_URL;
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  clearAuthToken() {
    this.authToken = null;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // ─── Users ─────────────────────────────────────────────────
  async registerUser(pubkey: string, displayName: string, fcmToken?: string): Promise<RegisterResponse> {
    return this.request<RegisterResponse>('/api/users/register', {
      method: 'POST',
      body: JSON.stringify({ pubkey, displayName, fcmToken }),
    });
  }

  async getProfile(): Promise<{ user: ApiUser }> {
    return this.request<{ user: ApiUser }>('/api/users/me');
  }

  async updateProfile(data: { displayName?: string; avatar?: string }): Promise<{ user: ApiUser }> {
    return this.request<{ user: ApiUser }>('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getTransactions(): Promise<{ transactions: ApiTransaction[] }> {
    return this.request<{ transactions: ApiTransaction[] }>('/api/users/me/transactions');
  }

  async getPublicProfile(pubkey: string): Promise<{ user: Pick<ApiUser, 'pubkey' | 'displayName' | 'avatar' | 'createdAt'> }> {
    return this.request('/api/users/' + pubkey);
  }

  // ─── Squads ────────────────────────────────────────────────
  async getSquads(): Promise<{ squads: ApiSquad[] }> {
    return this.request<{ squads: ApiSquad[] }>('/api/squads');
  }

  async createSquad(name: string, emoji: string, members: string[], description?: string): Promise<ApiSquad> {
    return this.request<ApiSquad>('/api/squads', {
      method: 'POST',
      body: JSON.stringify({ name, emoji, members, description }),
    });
  }

  async getSquadDetails(squadId: string): Promise<ApiSquad> {
    return this.request<ApiSquad>('/api/squads/' + squadId);
  }

  async getSquadTransactions(squadId: string): Promise<{ transactions: ApiTransaction[] }> {
    return this.request<{ transactions: ApiTransaction[] }>('/api/squads/' + squadId + '/transactions');
  }

  async logSquadTransaction(squadId: string, data: {
    type: string;
    amount: number;
    currency?: string;
    txSignature: string;
    memo?: string;
  }): Promise<ApiTransaction> {
    return this.request<ApiTransaction>('/api/squads/' + squadId + '/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ─── Payments ──────────────────────────────────────────────
  async logPayment(data: {
    amount: number;
    currency?: string;
    toPubkey: string;
    txSignature: string;
    memo?: string;
  }): Promise<ApiTransaction> {
    return this.request<ApiTransaction>('/api/payments/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createSplit(data: {
    description: string;
    totalAmount: number;
    currency?: string;
    squadId?: string;
    splits: { userPubkey: string; amount: number }[];
  }) {
    return this.request('/api/payments/split', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPendingSplits() {
    return this.request<{ splits: any[] }>('/api/payments/splits');
  }

  async settleSplit(splitId: string, txSignature: string) {
    return this.request('/api/payments/splits/' + splitId + '/settle', {
      method: 'POST',
      body: JSON.stringify({ txSignature }),
    });
  }

  // ─── Streams ───────────────────────────────────────────────
  async getStreams(): Promise<{ streams: ApiPaymentStream[] }> {
    return this.request<{ streams: ApiPaymentStream[] }>('/api/streams');
  }

  async createStream(data: {
    onchainAddress: string;
    recipientPubkey: string;
    amountPerSecond: number;
    startTime: number;
    endTime: number;
  }): Promise<ApiPaymentStream> {
    return this.request<ApiPaymentStream>('/api/streams', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async cancelStream(streamId: string): Promise<ApiPaymentStream> {
    return this.request<ApiPaymentStream>('/api/streams/' + streamId + '/cancel', {
      method: 'POST',
    });
  }

  async withdrawFromStream(streamId: string) {
    return this.request('/api/streams/' + streamId + '/withdraw', {
      method: 'POST',
    });
  }

  // ─── Notifications ─────────────────────────────────────────
  async registerFCMToken(token: string) {
    return this.request('/api/notifications/register', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async getNotificationPreferences() {
    return this.request<{
      id: string;
      userId: string;
      payments: boolean;
      votes: boolean;
      streams: boolean;
      splits: boolean;
    }>('/api/notifications/preferences');
  }

  async updateNotificationPreferences(prefs: {
    payments?: boolean;
    votes?: boolean;
    streams?: boolean;
    splits?: boolean;
  }) {
    return this.request('/api/notifications/preferences', {
      method: 'PUT',
      body: JSON.stringify(prefs),
    });
  }

  // ─── Proposals ────────────────────────────────────────────
  async createProposal(data: {
    squadId: string;
    title: string;
    description: string;
    amount: number;
    recipientPubkey: string;
    deadline: string;
  }): Promise<ApiProposal> {
    return this.request<ApiProposal>('/api/proposals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProposals(): Promise<{ proposals: ApiProposal[] }> {
    return this.request<{ proposals: ApiProposal[] }>('/api/proposals');
  }

  async getProposalDetails(proposalId: string): Promise<ApiProposal> {
    return this.request<ApiProposal>('/api/proposals/' + proposalId);
  }

  async voteOnProposal(proposalId: string, vote: 'yes' | 'no'): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/api/proposals/' + proposalId + '/vote', {
      method: 'POST',
      body: JSON.stringify({ vote }),
    });
  }

  async executeProposal(proposalId: string): Promise<ApiProposal> {
    return this.request<ApiProposal>('/api/proposals/' + proposalId + '/execute', {
      method: 'POST',
    });
  }

  // ─── Health ────────────────────────────────────────────────
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/api/health');
  }
}

export const api = new ApiService();
