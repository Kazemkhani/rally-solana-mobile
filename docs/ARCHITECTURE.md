# Rally — Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    SOLANA SEEKER DEVICE                       │
│  ┌─────────────────────────────────────────────────────┐     │
│  │            Rally Mobile App (React Native/Expo)      │     │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │     │
│  │  │  Home    │ │  Squads  │ │   Pay    │ │Streams │ │     │
│  │  │Dashboard │ │  Manager │ │  Center  │ │ View   │ │     │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘ │     │
│  │       │             │            │            │      │     │
│  │  ┌────▼─────────────▼────────────▼────────────▼────┐ │     │
│  │  │        Solana Mobile Stack Integration          │ │     │
│  │  │  • Mobile Wallet Adapter (MWA)                  │ │     │
│  │  │  • SMS SDK                                      │ │     │
│  │  │  • NFC / Deep Linking                           │ │     │
│  │  └────────────────────┬────────────────────────────┘ │     │
│  └───────────────────────┼──────────────────────────────┘     │
└──────────────────────────┼──────────────────────────────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
┌──────────────────┐ ┌──────────┐ ┌──────────────────────┐
│  Rally API       │ │  Solana  │ │  External Services   │
│  (Node/Express)  │ │  Devnet  │ │                      │
│                  │ │          │ │  • Firebase (FCM)    │
│  • User mgmt    │ │ Programs:│ │  • Google Vision     │
│  • Off-chain    │ │ • Squad  │ │    (Receipt OCR)     │
│  • indexing     │ │ • Stream │ │  • CoinGecko         │
│  • Push notifs  │ │ • Vote   │ │    (Price feeds)     │
│  • Split logic  │ │          │ │                      │
│                  │ │  PDAs:   │ │                      │
│  ┌────────────┐  │ │ • Vaults │ │                      │
│  │ PostgreSQL │  │ │ • Stream │ │                      │
│  │ (Prisma)   │  │ │   accts  │ │                      │
│  └────────────┘  │ │ • Vote   │ │                      │
│                  │ │   accts  │ │                      │
└──────────────────┘ └──────────┘ └──────────────────────┘
```

## Solana Program Architecture

### rally-squad (Shared Wallet)

**Purpose**: Multisig-lite shared wallets for groups.

**Accounts**:
- `Squad` PDA: `[b"squad", authority.key()]`
- `Vault` PDA: `[b"vault", squad.key()]`

**Key Design Decisions**:
- Spend threshold: amounts below threshold = any member can spend (fast)
- Above threshold: requires a passed vote from rally-vote program
- Members capped at 10 (keeps accounts small, compute efficient)
- Authority (creator) has admin powers: add/remove members

### rally-stream (Payment Streaming)

**Purpose**: By-the-second continuous payment flows.

**Accounts**:
- `Stream` PDA: `[b"stream", sender.key(), recipient.key(), stream_id]`
- `StreamVault` PDA: `[b"stream_vault", stream.key()]`

**Key Design Decisions**:
- Funds locked upfront in vault
- Recipient can withdraw anytime (accumulated amount)
- Sender can cancel (unstreamed funds returned)
- Rate stored as lamports_per_second for precision

### rally-vote (Proposals & Voting)

**Purpose**: Democratic spending decisions for squads.

**Accounts**:
- `Proposal` PDA: `[b"proposal", squad.key(), proposal_id]`

**Key Design Decisions**:
- Simple majority: yes_votes > 50% of members
- One vote per member per proposal
- Deadline-based: votes must happen before deadline
- Auto-executable: once passed and deadline reached

## Data Flow

### P2P Payment Flow
```
User taps "Send" → Enter amount + recipient
    → Mobile Wallet Adapter signs transaction
    → Solana processes transfer
    → API logs transaction (off-chain index)
    → Push notification to recipient
    → UI updates with confirmation
```

### Expense Split Flow
```
User scans receipt (camera) → OCR extracts items
    → User selects squad members to split with
    → API creates ExpenseSplit record
    → Push notification to all splitees
    → Each member settles via on-chain transfer
    → API tracks settlement status
    → All settled → Split marked complete
```

### Squad Vote Flow
```
Member creates proposal → rally-vote program stores on-chain
    → API notifies squad members
    → Members vote via rally-vote program
    → Deadline passes → Anyone calls execute
    → If passed: rally-squad authorizes withdrawal
    → Funds transferred to proposal recipient
```

### Payment Stream Flow
```
Sender creates stream → Deposits total into vault PDA
    → rally-stream program starts tracking
    → Recipient sees live counter in app
    → Recipient withdraws accumulated funds anytime
    → Stream ends naturally or sender cancels
    → Remaining funds returned on cancel
```

## Mobile Integration Points

| Feature | Solana Mobile Stack Component |
|---------|-------------------------------|
| Wallet Connection | Mobile Wallet Adapter (MWA) |
| Transaction Signing | MWA `transact()` |
| dApp Discovery | Solana dApp Store listing |
| NFC Payments | Android NFC API + Solana Pay |
| Push Notifications | Firebase + SMS SDK hooks |
| Deep Linking | Expo Linking + Solana Pay URLs |

## Security Model

1. **All financial operations**: Signed by user's wallet via MWA (never touch private keys)
2. **API authentication**: JWT derived from wallet signature challenge
3. **Server-side verification**: All tx signatures verified against Solana before updating state
4. **PDA authority**: Programs own vaults, not users — funds are programmatically controlled
5. **Input validation**: Zod schemas on all API inputs, Anchor constraints on all program accounts

## Scalability Considerations

- **Solana**: 400ms block times, 65k TPS — not a bottleneck
- **API**: Stateless Express server, horizontally scalable
- **Database**: PostgreSQL with proper indexes on pubkey/address fields
- **Push Notifications**: Firebase handles scale natively
- **Caching**: Add Redis layer if needed (not for MVP)
