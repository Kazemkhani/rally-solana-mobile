export interface Squad {
  id: string;
  name: string;
  members: string[];
  vault: string;
  spendThreshold: number;
  totalDeposited: number;
  createdAt: number;
}

export interface SquadMember {
  pubkey: string;
  displayName: string;
  avatar?: string;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'split' | 'pool' | 'stream';
  amount: number;
  currency: 'SOL' | 'USDC' | 'SKR';
  from: string;
  to: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  memo?: string;
}

export interface Proposal {
  id: string;
  squadId: string;
  title: string;
  description: string;
  amount: number;
  recipient: string;
  yesVotes: number;
  noVotes: number;
  deadline: number;
  isExecuted: boolean;
}

export interface PaymentStream {
  id: string;
  sender: string;
  recipient: string;
  amountPerSecond: number;
  startTime: number;
  endTime: number;
  totalDeposited: number;
  totalWithdrawn: number;
  isCancelled: boolean;
}

export interface UserProfile {
  pubkey: string;
  displayName: string;
  avatar?: string;
  squads: string[];
  streakDays: number;
}
