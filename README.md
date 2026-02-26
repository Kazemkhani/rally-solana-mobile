<div align="center">

# Rally

### Onchain Squad Finance for Solana Seeker

**The first mobile app that makes group money management as easy as texting — powered by Solana.**

[Demo Video](#demo) · [Architecture](#architecture) · [Setup](#quick-start) · [Pitch Deck](#why-rally-wins)

---

**Built for MONOLITH — Solana Mobile Hackathon**

</div>

---

## The Problem

Every group of humans coordinates around money. Roommates split rent. Friends split dinner. Clubs pool funds. Couples manage shared budgets. Travel groups save for trips.

Yet today's tools are broken:

| Tool | What's Missing |
|------|---------------|
| **Venmo / Cash App** | Centralized. Slow settlement. Can't pool, vote, stream, or earn. |
| **Splitwise** | Only *tracks* — doesn't *settle*. No wallets, no programmable money. |
| **Crypto wallets** | Individual-focused. Intimidating. Feel like trading terminals, not fintech. |
| **DeFi apps** | Desktop-first. Jargon-heavy. Zero group coordination features. |

**No app unifies payments + splitting + pooling + voting + streaming + yield into one mobile experience.**

Rally does.

---

## The Solution

Rally brings **6 financial superpowers** to squads — all in one native Android app optimized for Solana Seeker:

| # | Feature | What Users Do | Solana Advantage |
|---|---------|--------------|------------------|
| 1 | **Instant Pay** | One-tap send SOL or USDC to anyone | Sub-second finality, <$0.01 fees |
| 2 | **Smart Split** | Scan a receipt, assign items, settle instantly | Onchain settlement — no IOUs, no chasing |
| 3 | **Squad Pools** | Create shared wallets for rent, trips, events | Programmable vaults with spend thresholds |
| 4 | **Quick Vote** | Squad votes on spending above threshold | Smart contract enforced — no trust needed |
| 5 | **Pay Streams** | Real-time by-the-second payments | Subscriptions, allowances, payroll — all streaming |
| 6 | **Earn Yield** | Idle pool funds earn DeFi yield automatically | Composable with Solana DeFi protocols |

**Each feature exists in isolation somewhere. Rally is the first to compose all six into one daily-use mobile app.**

---

## Why Rally Wins

<table>
<tr>
<td width="25%" valign="top">

### Stickiness & PMF
**25%**

People split costs, check balances, and manage group money **every single day**. Rally becomes the default app for any group financial interaction.

- Roommates open Rally to split rent every month
- Friend groups open Rally to split dinner every weekend
- Travel squads check their pool balance daily
- Real-time stream counters create pull-to-refresh habit loops

**Rally isn't a "use once" crypto app. It's a daily utility.**

</td>
<td width="25%" valign="top">

### User Experience
**25%**

Zero crypto jargon. Venmo-level simplicity with Cash App aesthetics.

- Glassmorphism dark UI with cinematic animations
- One-tap payments via number pad
- Swipe-to-split with receipt scanning
- Real-time stream counters with glow effects
- Native haptic feedback on every interaction
- Pull-to-refresh with skeleton loading states
- Mock data fallback for instant offline demos

**If you can text, you can use Rally.**

</td>
<td width="25%" valign="top">

### Innovation / X-Factor
**25%**

Nobody has unified these six capabilities into one cohesive mobile experience:

1. P2P payments (Venmo)
2. Expense splitting (Splitwise)
3. Group fund pooling (shared bank account)
4. Democratic spending votes (onchain governance)
5. Payment streaming (Superfluid)
6. Yield on idle funds (DeFi)

**3 custom Solana programs. 25 API endpoints. 5 polished screens. One app.**

</td>
<td width="25%" valign="top">

### Presentation & Demo
**25%**

The demo tells a story anyone understands:

> *"Watch 4 friends go to dinner. They split the $89 bill in 3 taps. They pool funds for a Bali trip. They vote on the hotel. Their idle pool earns yield. One friend streams rent to another by the second. All in 90 seconds."*

No blockchain terminology. No wallet setup friction. Just humans doing what humans do — coordinating money with their squad.

</td>
</tr>
</table>

---

## Demo

### The 90-Second Flow

```
1. OPEN  → Home screen shows portfolio balance, recent activity
2. PAY   → Tap contact, enter $25, send SOL instantly
3. SPLIT → Scan dinner receipt, assign items to friends, settle
4. POOL  → Create "Bali Trip" squad, everyone deposits to shared vault
5. VOTE  → Someone proposes $500 hotel booking, squad votes yes
6. STREAM → Set up monthly rent payment streaming by the second
```

### Screen Architecture

```
┌─────────────────────────────────────────────────┐
│                    RALLY                         │
├─────────┬─────────┬─────────┬─────────┬─────────┤
│  Home   │ Squads  │   Pay   │ Streams │ Profile │
│         │         │  (+ ●)  │         │         │
│ Balance │ Squad   │ Number  │ Live    │ Assets  │
│ Card    │ Cards   │ Pad     │ Counter │ List    │
│         │         │         │         │         │
│ Recent  │ Create  │ Contact │ Progress│ Settings│
│ Activity│ Modal   │ Picker  │ Bars    │         │
│         │         │         │         │         │
│ Quick   │ Filter  │ Split   │ Filter  │ Bento   │
│ Actions │ Pills   │ Mode    │ Pills   │ Stats   │
└─────────┴─────────┴─────────┴─────────┴─────────┘
```

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     SOLANA SEEKER DEVICE                        │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              RALLY MOBILE APP (React Native)              │  │
│  │  Expo Router · Zustand Stores · Reanimated Animations     │  │
│  └────────────────────┬──────────────────────────────────────┘  │
│                       │                                         │
│  ┌────────────────────▼──────────────────────────────────────┐  │
│  │           MOBILE WALLET ADAPTER (MWA)                     │  │
│  │     Wallet authorization · Transaction signing            │  │
│  └────────────────────┬──────────────────────────────────────┘  │
└───────────────────────┼─────────────────────────────────────────┘
                        │
          ┌─────────────┼──────────────┐
          ▼                            ▼
┌──────────────────┐        ┌──────────────────────┐
│   SOLANA DEVNET  │        │    RALLY API SERVER   │
│                  │        │                       │
│  rally-squad     │        │  Express + TypeScript  │
│  rally-stream    │        │  Prisma + PostgreSQL   │
│  rally-vote      │        │  JWT + Pubkey Auth     │
│                  │        │  25 REST Endpoints     │
│  3 Anchor        │        │  Zod Validation        │
│  Programs        │        │                       │
└──────────────────┘        └──────────────────────┘
```

### Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Mobile** | React Native + Expo 54 | Cross-platform but Seeker-optimized. Expo Router for native navigation. |
| **UI** | Reanimated 3 + LinearGradient | 60fps spring animations, glassmorphism, haptic feedback. Cash App aesthetics. |
| **State** | Zustand 5 | Lightweight stores with API fetch + mock fallback. Works offline for demos. |
| **Solana** | @solana/web3.js + Mobile Wallet Adapter | Official Solana Mobile Stack. Native MWA integration. |
| **API** | Node.js + Express + TypeScript | 25 endpoints. Zod validation. JWT + hackathon pubkey auth. |
| **Database** | PostgreSQL + Prisma 6 | Type-safe ORM. 9 models covering all entities. Seed script for demo data. |
| **Programs** | Anchor (Rust) | 3 onchain programs: squad wallets, payment streaming, proposal voting. |

### Solana Programs

```
programs/
├── rally-squad/     Squad wallets with configurable spend thresholds
│                    • initialize_squad(name, members, threshold)
│                    • deposit(amount) — any member
│                    • withdraw(amount) — free if below threshold
│                    • add_member / remove_member
│
├── rally-stream/    Real-time payment streaming engine
│                    • create_stream(rate, start, end) — deposits upfront
│                    • withdraw_from_stream() — recipient claims earned
│                    • cancel_stream() — sender stops, pays owed
│
└── rally-vote/      Democratic spending proposals
                     • create_proposal(title, amount, recipient, deadline)
                     • cast_vote(yes/no) — one per member, deadline enforced
                     • execute_proposal() — requires quorum majority
```

### Data Flow

```
Screen → Zustand Store → API Service → Express API → Prisma → PostgreSQL
              ↓ (catch)
         Mock Data (app works offline for demos)
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Android Studio / Expo Go (for mobile)
- Anchor CLI (for Solana programs)

### 1. Install Dependencies

```bash
git clone https://github.com/Kazemkhani/rally-solana-mobile.git
cd rally-solana-mobile
npm install
```

### 2. Setup Database

```bash
cd apps/api
cp .env.example .env          # Edit DATABASE_URL for your PostgreSQL
npx prisma db push             # Push schema to database
npm run db:seed                # Seed demo data (5 users, 3 squads, 4 txs, 2 streams)
```

### 3. Start API Server

```bash
cd apps/api
npm run dev                    # Runs on http://localhost:3001
```

Verify: `curl http://localhost:3001/api/health`

### 4. Start Mobile App

```bash
cd apps/mobile
npx expo start                 # Scan QR with Expo Go or Android emulator
```

### 5. Build Solana Programs (optional)

```bash
cd programs
anchor build
anchor test                    # Run integration tests
anchor deploy                  # Deploy to devnet
```

---

## API Endpoints

Rally's backend provides 25 REST endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/users/register` | Register user, get JWT |
| `GET` | `/api/users/me` | Profile with squads |
| `GET` | `/api/users/me/transactions` | Transaction history |
| `PUT` | `/api/users/me` | Update profile |
| `POST` | `/api/squads` | Create squad |
| `GET` | `/api/squads` | List user's squads |
| `GET` | `/api/squads/:id` | Squad details |
| `POST` | `/api/squads/:id/transactions` | Log squad transaction |
| `POST` | `/api/payments/send` | Log P2P payment |
| `POST` | `/api/payments/split` | Create expense split |
| `GET` | `/api/payments/splits` | Pending splits |
| `POST` | `/api/payments/splits/:id/settle` | Settle a split |
| `POST` | `/api/streams` | Create payment stream |
| `GET` | `/api/streams` | List streams |
| `POST` | `/api/streams/:id/cancel` | Cancel stream |
| `POST` | `/api/streams/:id/withdraw` | Withdraw from stream |
| `POST` | `/api/proposals` | Create spending proposal |
| `GET` | `/api/proposals` | List proposals |
| `GET` | `/api/proposals/:id` | Proposal details |
| `POST` | `/api/proposals/:id/vote` | Cast vote |
| `POST` | `/api/proposals/:id/execute` | Execute passed proposal |
| `POST` | `/api/notifications/register` | Register push token |
| `GET/PUT` | `/api/notifications/preferences` | Notification settings |

---

## Database Schema

9 Prisma models covering the full data model:

```
User ←→ SquadMembership ←→ Squad
                              ├── Transaction
                              ├── ExpenseSplit → SplitItem
                              └── Proposal

PaymentStream (sender ↔ recipient)
NotificationPreference (per user)
```

---

## SKR Integration

Rally deeply integrates the Seeker (SKR) token:

| Integration | Description |
|-------------|-------------|
| **Rally Rewards** | Earn SKR for daily app usage — splitting, paying, voting |
| **Squad Governance** | SKR holders vote on platform-wide features |
| **Premium Pools** | SKR-denominated savings pools with boosted yield |
| **Reputation Staking** | Stake SKR to boost trust score in squads |
| **Referral Bonuses** | Earn SKR for inviting friends to Rally |

---

## Project Structure

```
rally-solana-mobile/
├── apps/
│   ├── mobile/                    React Native (Expo) — Seeker app
│   │   ├── app/                   Expo Router (file-based routing)
│   │   │   ├── (tabs)/            5 tab screens
│   │   │   └── squad/[id].tsx     Dynamic squad detail
│   │   └── src/
│   │       ├── screens/           HomeScreen, SquadScreen, PayScreen, StreamScreen, ProfileScreen
│   │       ├── components/        13 reusable components (AnimatedPressable, BalanceDisplay, etc.)
│   │       ├── stores/            5 Zustand stores (auth, wallet, squads, streams, transactions)
│   │       ├── hooks/             useSolana, useWallet, useSquad
│   │       ├── services/          Typed API client (25 endpoints)
│   │       ├── data/              Mock data for offline/demo mode
│   │       ├── types/             TypeScript interfaces
│   │       └── utils/             Constants, colors, spacing tokens
│   └── api/                       Node.js Express backend
│       ├── src/
│       │   ├── routes/            users, squads, payments, streams, notifications
│       │   ├── middleware/        JWT auth, Zod validation
│       │   └── config/            Database, Solana, Firebase config
│       └── prisma/
│           ├── schema.prisma      9 models
│           └── seed.ts            Demo data
├── programs/                      3 Solana Programs (Anchor/Rust)
│   ├── rally-squad/               Multisig-lite shared wallets
│   ├── rally-stream/              Payment streaming engine
│   └── rally-vote/                Proposal voting system
└── CLAUDE.md                      Project brain — architecture, rules, status
```

---

## What Makes Rally Different

| | Venmo | Splitwise | Phantom | **Rally** |
|---|:---:|:---:|:---:|:---:|
| Instant P2P payments | ✅ | ❌ | ✅ | ✅ |
| Expense splitting | ❌ | ✅ | ❌ | ✅ |
| Group fund pooling | ❌ | ❌ | ❌ | ✅ |
| Democratic voting | ❌ | ❌ | ❌ | ✅ |
| Payment streaming | ❌ | ❌ | ❌ | ✅ |
| Yield on idle funds | ❌ | ❌ | ❌ | ✅ |
| Mobile-native | ✅ | ✅ | ✅ | ✅ |
| Onchain settlement | ❌ | ❌ | ✅ | ✅ |
| Sub-second finality | ❌ | ❌ | ✅ | ✅ |
| < $0.01 fees | ❌ | ❌ | ✅ | ✅ |

---

## Deployment

### One-Command Setup
```bash
./scripts/setup.sh     # Installs deps, starts PostgreSQL, seeds demo data
```

### Deploy Everything
```bash
./scripts/deploy-programs.sh    # 3 Solana programs → devnet
./scripts/deploy-api.sh --seed  # API + PostgreSQL → Railway
./scripts/build-apk.sh --preview  # Android APK → EAS Build
```

### Docker (local production stack)
```bash
cd apps/api && docker compose up -d
curl http://localhost:3001/api/health
```

---

## Hackathon

**MONOLITH — Solana Mobile Hackathon** (Jan – Mar 2026)

- **Platform**: Android APK for Solana Seeker
- **Stack**: Solana Mobile Stack + Mobile Wallet Adapter
- **Programs**: 3 custom Anchor programs deployed to devnet
- **Backend**: 25 REST endpoints with PostgreSQL
- **Frontend**: 5 polished screens with glassmorphism UI
- **Deployment**: Dockerfile, docker-compose, Railway, EAS configs included

---

## Team

Built by [Kazemkhani](https://github.com/Kazemkhani) and [theSaksham02](https://github.com/theSaksham02)

---

## License

MIT
