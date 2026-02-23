export interface Squad {
  id: string;
  name: string;
  emoji: string;
  members: SquadMember[];
  vault: string;
  spendThreshold: number;
  totalDeposited: number;
  usdcBalance: number;
  createdAt: number;
  lastActivity: string;
}

export interface SquadMember {
  id: string;
  name: string;
  pubkey: string;
  displayName: string;
  avatar: string;       // emoji avatar
  color: string;        // avatar background color
  role: 'admin' | 'member';
  joinedAt: number;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'split' | 'pool' | 'stream';
  amount: number;
  currency: 'SOL' | 'USDC' | 'SKR';
  from: string;
  to: string;
  fromName: string;
  toName: string;
  fromAvatar: string;
  toAvatar: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  memo?: string;
}

export interface Contact {
  id: string;
  displayName: string;
  avatar: string;
  color: string;
  pubkey: string;
  lastInteraction: number;
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
  senderName: string;
  senderAvatar: string;
  recipient: string;
  recipientName: string;
  recipientAvatar: string;
  amountPerSecond: number;
  currency: 'SOL' | 'USDC';
  startTime: number;
  endTime: number;
  totalDeposited: number;
  totalWithdrawn: number;
  isActive: boolean;
  isCancelled: boolean;
  rateLabel: string;  // e.g. "$2.40 / hour"
}

export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  assignedTo: string[]; // member IDs
}

export interface SplitRequest {
  id: string;
  squadId?: string;
  items: ReceiptItem[];
  participants: Contact[];
  totalAmount: number;
  createdAt: number;
}

export interface UserProfile {
  pubkey: string;
  displayName: string;
  avatar: string;
  squads: string[];
  streakDays: number;
}

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  icon: string;
  color: string;
}
