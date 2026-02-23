# Rally — Onchain Squad Finance for Solana Seeker

> The first mobile-native app that makes group financial coordination as easy as texting — powered by Solana.

## The Problem

Groups coordinate around money constantly. Roommates split rent. Friends split dinner. Clubs pool funds for events. Couples manage shared expenses. Yet:
- **Venmo/Cash App** are centralized, slow to settle, and can't do programmable money
- **Crypto wallets** are intimidating, individual-focused, and feel like trading apps
- **Splitwise** only tracks — it doesn't settle, pool, or earn
- **No app** unifies payments + splitting + pooling + voting + streaming + yield

## The Solution

**Rally** is a mobile-first Solana app that brings 6 financial superpowers to squads:

| Feature | What It Does | Solana Advantage |
|---------|-------------|------------------|
| **Instant Pay** | Send SOL/USDC with one tap | <1 sec finality, <$0.01 fees |
| **Smart Split** | Scan receipts, auto-split expenses | Onchain settlement, transparent ledger |
| **Pool Funds** | Group savings for shared goals | Programmable vaults with time locks |
| **Quick Vote** | Vote on how to spend pooled funds | Smart contract-enforced execution |
| **Pay Streams** | Real-time payment streaming | By-the-second payments, pausable |
| **Earn Yield** | Idle pool funds earn DeFi yield | Composable with Solana DeFi |

## Tech Stack

- **Mobile**: React Native + Expo (Android/Seeker-first)
- **Blockchain**: Solana Programs via Anchor (Rust)
- **Backend**: Node.js + Express + TypeScript + Prisma
- **Mobile Crypto**: Solana Mobile Stack + Mobile Wallet Adapter
- **Database**: PostgreSQL
- **Notifications**: Firebase Cloud Messaging

## Project Structure

```
rally/
├── apps/
│   ├── mobile/          # React Native (Expo) Seeker app
│   └── api/             # Node.js Express backend
├── programs/
│   ├── rally-squad/     # Shared wallet (multisig-lite)
│   ├── rally-stream/    # Payment streaming engine
│   └── rally-vote/      # Proposal voting system
├── tests/               # Program integration tests
├── docs/                # Architecture, pitch deck, demo script
└── scripts/             # Setup and deployment scripts
```

## Quick Start

```bash
# Install dependencies
npm install

# Build Solana programs
cd programs && anchor build

# Start mobile app
cd apps/mobile && npx expo start

# Start API server
cd apps/api && npm run dev
```

## SKR Integration

Rally deeply integrates the Seeker (SKR) token:
- Earn SKR rewards for daily engagement
- SKR-powered squad governance
- Reputation staking with SKR
- Premium pool features for SKR holders

## Hackathon

Built for the **MONOLITH — Solana Mobile Hackathon** (Jan-Mar 2026).

## Team

Built by [Kazemkhani](https://github.com/Kazemkhani)

## License

MIT
