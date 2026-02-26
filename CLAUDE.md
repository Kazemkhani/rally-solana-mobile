# CLAUDE.md — Rally: Onchain Squad Finance for Solana Seeker

> This file is the brain of this project. Claude reads it at every session start.
> It drives learning, iteration, deep thinking, and relentless execution.
> Inspired by first-principles thinking: every mistake becomes a lesson, every lesson becomes a pattern.

---

## 🎯 PROJECT IDENTITY

**Rally** is a mobile-first onchain group finance app for Solana Seeker.
It makes splitting, pooling, streaming, and voting on money as easy as texting —
powered by Solana's instant finality, <$0.01 fees, and programmable money.

**One-liner**: "Venmo meets onchain superpowers — for squads."

**Hackathon**: MONOLITH — Solana Mobile Hackathon (Submissions close March 9, 2026)
**Prize pool**: 10 × $10,000 USDC + $10,000 SKR Best Integration
**Target**: Win top placement by maximizing ALL four judging criteria.

---

## 📐 HACKATHON ALIGNMENT MATRIX

Every decision must score against these four axes. If it doesn't serve at least 2, cut it.

| Criteria | Weight | What Judges Want | How Rally Wins |
|----------|--------|------------------|----------------|
| **Stickiness & PMF** | 25% | Creates habits, daily engagement, resonates with Seeker community | People split costs, manage group money, and check balances DAILY. Rally becomes the default app for any group financial interaction. |
| **User Experience** | 25% | Intuitive, polished, easy to navigate, enjoyable | Venmo-level simplicity. One-tap pay, swipe-to-split, beautiful animations. Zero crypto jargon in the UI. |
| **Innovation / X-Factor** | 25% | Novel, creative, stands out from 523 teams | First app unifying P2P pay + expense splitting + group pools + voting + payment streaming + DeFi yield — all mobile-native on Solana. Nobody has combined these. |
| **Presentation & Demo** | 25% | Clear communication, effective showcase of features | Relatable demo: "Watch 4 friends go to dinner, split the bill, pool funds for a trip, vote on the hotel, and earn yield on idle funds — all in 90 seconds." |

---

## 🧠 LEARNING & MISTAKE TRACKING SYSTEM

### Principles
1. **Every error is data.** When something breaks, document WHY, not just WHAT.
2. **Pattern recognition > individual fixes.** If a mistake happens twice, it's a pattern. Create a rule.
3. **Pre-mortems > post-mortems.** Before building, ask: "What could go wrong?" and design against it.
4. **Compound improvement.** Each session should be measurably better than the last.

### Error Log Format
When a mistake occurs, add it here:
```
### [DATE] — ERROR_TITLE
- **What happened**: (factual description)
- **Root cause**: (the actual WHY, not the symptom)
- **Pattern**: (is this part of a broader pattern?)
- **Fix applied**: (what was done)
- **Rule created**: (new rule to prevent recurrence)
- **Confidence**: (how sure are we this won't recur: LOW/MED/HIGH)
```

### Active Rules (Learned from Mistakes)
<!-- Add rules here as mistakes are encountered -->
1. Always run `anchor build` before committing Solana program changes.
2. Never hardcode Solana cluster URLs — use environment config.
3. Test Mobile Wallet Adapter flows on actual Seeker/Android emulator, not just web.
4. Always validate transaction signatures server-side before updating state.
5. Keep UI state and blockchain state in sync via event listeners, never polling.
6. All stores must have API fetch + mock data fallback — app must work offline for demos.
7. Auth uses hackathon mode (raw pubkey as Bearer token) — no JWT needed for dev/demo.
8. Saksham's UI is the source of truth for frontend design. Preserve his component library and design tokens.

### Mistake Patterns to Watch For
- **Premature optimization**: Building features before validating core flow works end-to-end.
- **Crypto-brain UX**: Using blockchain terminology in user-facing UI.
- **Desktop assumptions**: Designing for desktop viewport/interaction patterns.
- **Over-engineering programs**: Solana program compute limits are real. Keep programs minimal.
- **Missing error states**: Every transaction can fail. Every screen needs error/loading/empty states.

---

## 🔄 ITERATION FRAMEWORK

### The Build Loop
```
THINK → PLAN → BUILD → TEST → DEMO → REFLECT → IMPROVE → REPEAT
```

### Iteration Checklist (Run Before Each Major Feature)
- [ ] Does this feature directly serve a judging criterion?
- [ ] Can I demo this compellingly in under 30 seconds?
- [ ] Does the UX feel native-mobile (not web-in-a-wrapper)?
- [ ] Have I considered the failure modes?
- [ ] Is this the simplest implementation that could work?
- [ ] Would a non-crypto user understand this without explanation?

### Version Milestones
| Version | Focus | Status |
|---------|-------|--------|
| v0.1 | Wallet connection + basic P2P send on Seeker | ✅ (hooks ready) |
| v0.2 | Squad creation + shared wallet (multisig-lite) | ✅ (program + API + UI) |
| v0.3 | Expense splitting with receipt scan | ✅ (API + UI, OCR pending) |
| v0.4 | Fund pooling + group savings goals | ✅ (squad vault deposit/withdraw) |
| v0.5 | Quick votes on spending proposals | ✅ (program done, UI pending) |
| v0.6 | Payment streaming (subscriptions, allowances) | ✅ (program + API + UI) |
| v0.7 | DeFi yield on idle pool funds | 🔲 |
| v0.8 | SKR token integration (rewards, governance) | 🔲 |
| v0.9 | Polish: animations, haptics, empty states, error handling | ✅ (Saksham's UI overhaul) |
| v1.0 | Demo video + pitch deck + final submission | 🔲 |

---

## 💡 DEEP BRAINSTORM FRAMEWORK

### How to Brainstorm in This Project
1. **Diverge first**: Generate 10+ ideas without judging.
2. **Converge with criteria**: Score each against the 4 judging axes.
3. **Prototype the top 3**: Build the simplest possible version of each.
4. **User-test mentally**: "Would my non-crypto friend use this daily?"
5. **Kill darlings**: If a feature doesn't pass the 30-second demo test, cut it.

### Core Innovation Thesis
The crypto industry has built incredible financial infrastructure but wrapped it in terrible UX.
Rally's innovation is NOT new financial primitives — it's making EXISTING Solana capabilities
feel like consumer apps that 150,000 Seeker owners will actually use every day.

**The X-Factor**: No one has unified these 6 features into one cohesive mobile experience:
1. Instant P2P payments (like Venmo)
2. Smart expense splitting (like Splitwise)
3. Group fund pooling (like shared bank accounts)
4. Democratic spending votes (like onchain governance, but simple)
5. Payment streaming (like Superfluid, but mobile-native)
6. Yield on idle funds (like DeFi, but invisible to the user)

Each of these exists in isolation. Rally is the first to compose them into one daily-use app.

---

## 🏗️ ARCHITECTURE DECISIONS

### Tech Stack (Locked)
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Mobile App | React Native + Expo (Android-first) | Cross-platform but Seeker-optimized. Expo for fast iteration. |
| Navigation | React Navigation v6 | Industry standard for RN, smooth native transitions |
| State | Zustand + React Query | Lightweight, no boilerplate, great for async blockchain state |
| Solana Client | @solana/web3.js + @solana-mobile/mobile-wallet-adapter | Official Solana Mobile Stack |
| UI Kit | React Native Paper + custom components | Material Design base with custom Rally theme |
| Backend API | Node.js + Express + TypeScript | Fast to build, easy to deploy |
| Database | PostgreSQL + Prisma ORM | Relational for squad/user relationships, Prisma for type safety |
| Solana Programs | Anchor (Rust) | Industry standard for Solana program development |
| Notifications | Firebase Cloud Messaging | Push notifications for payments, votes, streams |
| Receipt OCR | Google Cloud Vision API | Accurate receipt parsing for expense splitting |
| Deployment | Railway (API) + Vercel (if web needed) | Simple, fast deployment |

### Solana Program Architecture
```
programs/
├── rally-squad/     → Shared wallet (multisig-lite) with configurable thresholds
├── rally-stream/    → Token streaming engine (by-the-second payments)
└── rally-vote/      → Lightweight proposal + voting with auto-execution
```

### Key Design Decisions
1. **Multisig-lite, not full multisig**: Squad wallets use M-of-N approval but with sensible defaults (any member can send under threshold, votes needed above).
2. **Optimistic UI**: Show transactions as confirmed immediately, reconcile in background. Users shouldn't wait for finality.
3. **Progressive onboarding**: First-time users create a wallet in-app. No external wallet required initially. Power users can connect Phantom/Solflare.
4. **Mobile-first data model**: All amounts shown in fiat (USD) with SOL/USDC toggle. Crypto complexity hidden by default.

---

## 🎬 HACKATHON MODE — EXECUTION PROTOCOLS

### Sprint Rules
1. **Feature-complete > pixel-perfect**: Get all 6 core features working before polishing any one.
2. **Demo-driven development**: Build what you can SHOW, not what sounds impressive.
3. **2-hour rule**: If a feature takes >2 hours and isn't core, defer it.
4. **Test on device**: Every feature must work on Android emulator minimum, physical Seeker preferred.
5. **Commit often**: Meaningful commits show technical depth to judges.

### Daily Standup Template
```
Yesterday: [what was built]
Today: [what will be built]
Blockers: [what's stuck]
Judging alignment check: [which criteria did yesterday's work serve?]
```

### Submission Checklist
- [ ] GitHub repo is clean, well-documented, meaningful commit history
- [ ] Demo video: 3-5 minutes, shows ALL core features in action
- [ ] Pitch deck: Problem → Solution → Demo → Tech → Vision → Team
- [ ] README with setup instructions, architecture diagram, screenshots
- [ ] App runs on Android (Seeker-compatible)
- [ ] All Solana programs deployed to devnet
- [ ] SKR integration documented and functional

---

## 📁 PROJECT STRUCTURE

```
rally/
├── CLAUDE.md                          # This file — project brain
├── README.md                          # Public-facing project overview
├── .gitignore
├── package.json                       # Monorepo root (npm workspaces)
├── turbo.json                         # Turborepo config
├── apps/
│   ├── mobile/                        # React Native (Expo) — Seeker app
│   │   ├── app.json
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── App.tsx
│   │   ├── src/
│   │   │   ├── screens/               # All app screens
│   │   │   ├── components/            # Reusable UI components
│   │   │   ├── navigation/            # React Navigation setup
│   │   │   ├── hooks/                 # Custom hooks (useSolana, useSquad, etc.)
│   │   │   ├── services/              # API, Solana, storage services
│   │   │   ├── stores/                # Zustand stores (auth, wallet, squads, streams, transactions)
│   │   │   ├── utils/                 # Helpers, constants, formatters
│   │   │   └── types/                 # TypeScript type definitions
│   │   └── assets/                    # Images, fonts, animations
│   └── api/                           # Node.js Express API
│       ├── package.json
│       ├── tsconfig.json
│       ├── src/
│       │   ├── index.ts               # Server entry point
│       │   ├── routes/                # Express route handlers
│       │   ├── services/              # Business logic services
│       │   ├── middleware/            # Auth, validation, error handling
│       │   ├── models/                # Prisma-generated types
│       │   └── config/                # Database, Solana, Firebase config
│       └── prisma/
│           ├── schema.prisma          # Database schema (9 models)
│           └── seed.ts                # Demo data seed script
├── programs/                          # Solana Programs (Anchor/Rust)
│   ├── rally-squad/                   # Shared wallet program
│   ├── rally-stream/                  # Payment streaming program
│   └── rally-vote/                    # Voting/proposals program
├── tests/                             # Integration tests for programs
├── docs/
│   ├── ARCHITECTURE.md                # Technical architecture deep-dive
│   ├── pitch-deck/                    # Pitch deck assets
│   └── demo-script.md                # Demo video script
└── scripts/
    ├── setup.sh                       # One-command dev environment setup
    └── deploy.sh                      # Deploy programs to devnet
```

---

## 🚀 QUICK COMMANDS

```bash
# Setup
npm install                            # Install all workspace dependencies
cd programs && anchor build            # Build Solana programs
cd apps/api && npx prisma generate     # Generate Prisma client

# Database
cd apps/api && cp .env.example .env    # Copy env template (edit DATABASE_URL)
cd apps/api && npx prisma db push      # Push schema to DB (dev)
cd apps/api && npx prisma migrate dev  # Create migration (production)
cd apps/api && npm run db:seed         # Seed demo data

# Development
cd apps/mobile && npx expo start       # Start mobile app (Expo)
cd apps/api && npm run dev             # Start API server
cd programs && anchor test             # Run program tests

# Verify API
curl http://localhost:3001/api/health  # Health check

# Deployment
cd programs && anchor deploy           # Deploy to devnet
cd apps/api && npm run deploy          # Deploy API to Railway
```

---

## 🔑 ENVIRONMENT VARIABLES

```
# Solana
SOLANA_CLUSTER=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
PROGRAM_RALLY_SQUAD=<deployed_program_id>
PROGRAM_RALLY_STREAM=<deployed_program_id>
PROGRAM_RALLY_VOTE=<deployed_program_id>

# API
DATABASE_URL=postgresql://...
JWT_SECRET=<secret>
PORT=3001

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID=<id>
FIREBASE_PRIVATE_KEY=<key>

# Google Cloud Vision (Receipt OCR)
GOOGLE_CLOUD_API_KEY=<key>

# SKR Token
SKR_MINT_ADDRESS=<address>
```

---

## 🎯 SKR INTEGRATION STRATEGY (Bonus Prize)

Rally integrates SKR (Seeker token) deeply:
1. **Rally Rewards**: Earn SKR for daily app usage (splitting, paying, voting).
2. **Squad Governance**: SKR holders can vote on platform-wide features.
3. **Premium Pools**: SKR-denominated savings pools with boosted yield.
4. **Reputation Staking**: Stake SKR to boost your trust score in squads.
5. **Referral Bonuses**: Earn SKR for inviting friends to Rally.

---

## 📝 SESSION CONTEXT

### Current Focus
<!-- Update this at the start of each session -->
Frontend-backend integration. Saksham's UI overhaul is the source of truth for the mobile app. All screens now fetch from the API with mock data as fallback.

### Integration Status (2026-02-26)

| Layer | Status | Notes |
|-------|--------|-------|
| **Mobile UI (Saksham)** | DONE | 5 screens + squad detail, glassmorphism, reanimated, Expo Router |
| **API Backend** | DONE | 20 endpoints, Prisma, JWT + pubkey auth, Zod validation |
| **Solana Programs** | DONE | rally-squad, rally-stream, rally-vote — all implemented |
| **Frontend-Backend Integration** | DONE | Stores fetch from API with mock fallback. Auth store handles registration. |
| **Prisma Schema** | DONE | 9 models: User, Squad (with emoji), SquadMembership, Transaction, ExpenseSplit, SplitItem, PaymentStream, Proposal, NotificationPreference |
| **Seed Data** | DONE | prisma/seed.ts creates demo users, squads, transactions, splits, streams |

### Data Flow Architecture
```
Screen → Zustand Store → API Service → Express API → Prisma → PostgreSQL
              ↓ (fallback)
         Mock Data (offline/demo mode)
```

### Stores → API Mapping
| Store | API Endpoints | Fallback |
|-------|--------------|----------|
| `useAuthStore` | POST /api/users/register, GET /api/users/me | Pubkey as token |
| `useWalletStore` | (calls useAuthStore.register on connect) | Pre-populated demo values |
| `useSquadStore` | GET /api/squads, POST /api/squads | MOCK_SQUADS |
| `useStreamStore` | GET /api/streams, POST /api/streams/:id/cancel | MOCK_STREAMS |
| `useTransactionStore` | GET /api/users/me/transactions | MOCK_TRANSACTIONS |

### Mobile Store Files
- `src/stores/auth.ts` — JWT token, user profile, register/login
- `src/stores/wallet.ts` — Solana wallet state, triggers auth on connect
- `src/stores/squads.ts` — Squad CRUD with API + mock fallback
- `src/stores/streams.ts` — Stream listing with API + mock fallback
- `src/stores/transactions.ts` — Transaction history with API + mock fallback

### API Route Summary (20 endpoints)
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | /api/users/register | No | Register/update user, returns JWT |
| GET | /api/users/me | Yes | User profile with squads |
| GET | /api/users/me/transactions | Yes | User's transaction history |
| PUT | /api/users/me | Yes | Update profile |
| GET | /api/users/:pubkey | No | Public profile |
| POST | /api/squads | Yes | Create squad (with emoji) |
| GET | /api/squads | Yes | List user's squads |
| GET | /api/squads/:id | Yes | Squad details |
| POST | /api/squads/:id/transactions | Yes | Log squad transaction |
| GET | /api/squads/:id/transactions | No | Squad transaction history |
| POST | /api/payments/send | Yes | Log P2P payment |
| POST | /api/payments/split | Yes | Create expense split |
| GET | /api/payments/splits | Yes | User's splits |
| POST | /api/payments/splits/:id/settle | Yes | Settle split |
| POST | /api/streams | Yes | Create stream |
| GET | /api/streams | Yes | User's streams |
| POST | /api/streams/:id/cancel | Yes | Cancel stream |
| POST | /api/streams/:id/withdraw | Yes | Log withdrawal (stub) |
| POST | /api/notifications/register | Yes | Register FCM token |
| GET/PUT | /api/notifications/preferences | Yes | Notification prefs |

### Open Questions
- Exact SKR token mint address for devnet testing?
- Seeker device testing access timeline?
- Need PostgreSQL connection for end-to-end testing

### Next Actions
1. Deploy API to Railway with PostgreSQL
2. Run Prisma migrations and seed on production DB
3. Deploy Solana programs to devnet
4. Build and test on physical Seeker device
5. Record demo video

---

## 🧪 QUALITY GATES

Before ANY PR/commit to main:
1. TypeScript: Zero type errors (`tsc --noEmit`)
2. Lint: Zero warnings (`eslint .`)
3. Programs: `anchor test` passes
4. Mobile: App boots without crashes on Android emulator
5. API: All routes return expected responses
6. No hardcoded secrets or cluster URLs

---

## 💬 COMMUNICATION STYLE

- Be direct and concise. No fluff.
- Show don't tell — code speaks louder than descriptions.
- When stuck, state the blocker clearly and propose 3 solutions.
- Commit messages follow: `type(scope): description` (e.g., `feat(squad): add multisig wallet creation`)
- Every file should have a clear purpose. If you can't explain it in one sentence, split it.

---

*This document evolves with the project. Every session should leave it better than it was found.*
