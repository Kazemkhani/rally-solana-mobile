import { API_URL } from '../utils/constants';

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
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Users
  async registerUser(pubkey: string, displayName: string, fcmToken?: string) {
    return this.request('/api/users/register', {
      method: 'POST',
      body: JSON.stringify({ pubkey, displayName, fcmToken }),
    });
  }

  async getProfile() {
    return this.request('/api/users/me');
  }

  // Squads
  async getSquads() {
    return this.request<{ squads: any[] }>('/api/squads');
  }

  async createSquad(name: string, members: string[]) {
    return this.request('/api/squads', {
      method: 'POST',
      body: JSON.stringify({ name, members }),
    });
  }

  async getSquadDetails(squadId: string) {
    return this.request(`/api/squads/${squadId}`);
  }

  async getSquadTransactions(squadId: string) {
    return this.request(`/api/squads/${squadId}/transactions`);
  }

  // Payments
  async logPayment(data: {
    type: string;
    amount: number;
    currency: string;
    fromPubkey: string;
    toPubkey: string;
    txSignature: string;
    memo?: string;
    squadId?: string;
  }) {
    return this.request('/api/payments/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Splits
  async createSplit(data: {
    description: string;
    totalAmount: number;
    currency: string;
    squadId?: string;
    splits: { userPubkey: string; amount: number }[];
  }) {
    return this.request('/api/payments/split', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPendingSplits() {
    return this.request('/api/payments/splits');
  }

  async settleSplit(splitId: string, txSignature: string) {
    return this.request(`/api/payments/splits/${splitId}/settle`, {
      method: 'POST',
      body: JSON.stringify({ txSignature }),
    });
  }

  // Streams
  async getStreams() {
    return this.request('/api/streams');
  }

  async logStreamCreation(data: {
    onchainAddress: string;
    recipientPubkey: string;
    amountPerSecond: number;
    startTime: number;
    endTime: number;
  }) {
    return this.request('/api/streams', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Notifications
  async registerFCMToken(token: string) {
    return this.request('/api/notifications/register', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async getNotificationPreferences() {
    return this.request('/api/notifications/preferences');
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
}

export const api = new ApiService();
