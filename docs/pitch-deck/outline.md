# Rally — Pitch Deck Outline

## Slide 1: Title
**Rally — Your Squad's Onchain Wallet**
Mobile-first group finance on Solana Seeker.
MONOLITH Hackathon 2026

## Slide 2: The Problem (30 sec)
- Groups coordinate around money every day: splitting dinner, pooling for trips, sharing subscriptions, managing club funds
- Current solutions are broken:
  - **Venmo/Cash App**: Centralized, slow settlement, US-centric, no programmable money
  - **Splitwise**: Tracks debts but doesn't settle them
  - **Crypto wallets**: Individual-focused, intimidating, feel like trading apps
- **Nobody has built a consumer-grade group finance app on crypto**

## Slide 3: The Solution (30 sec)
**Rally unifies 6 financial superpowers into one mobile app — powered by Solana:**
1. Instant P2P payments (<1 sec, <$0.01)
2. Smart expense splitting (scan → split → settle)
3. Group fund pooling (shared savings goals)
4. Democratic spending votes (smart contract enforced)
5. Payment streaming (by-the-second subscriptions)
6. Yield on idle funds (invisible DeFi integration)

## Slide 4: Demo (90 sec)
**Live walkthrough**: 4 friends go to dinner:
1. Open Rally → See squad dashboard
2. Scan the receipt → Auto-split between 4 members
3. Everyone settles with one tap (instant on Solana)
4. Remaining group funds earn yield automatically
5. Someone proposes a weekend trip → Squad votes → Funds allocated
6. Set up a streaming payment for shared Netflix subscription

## Slide 5: Why Mobile-First Matters
- Group payments happen in the real world: restaurants, trips, events
- 150,000 Seeker devices launching — Rally is their go-to finance app
- NFC tap-to-split, camera receipt scanning, push notification prompts
- Features that literally cannot work on desktop

## Slide 6: Technical Architecture
- **Mobile**: React Native + Expo (Seeker-optimized)
- **Blockchain**: 3 Anchor programs (Squad Wallet, Streaming, Voting)
- **Backend**: Node.js API for indexing, notifications, receipt OCR
- **Solana Mobile Stack**: MWA, SMS SDK, dApp Store ready
- **SKR Integration**: Rewards, governance, reputation staking

## Slide 7: Solana Integration Depth
| Feature | Solana Tech Used |
|---------|-----------------|
| Squad Wallets | Custom program + PDA vaults |
| P2P Payments | SPL Token transfers via MWA |
| Expense Splitting | Batch transactions |
| Voting | On-chain proposal + vote program |
| Streaming | Real-time token streaming program |
| Yield | Composable with Marinade/Jupiter |
| SKR Rewards | SPL token integration |

## Slide 8: Market Opportunity
- $500B+ global P2P payments market
- 150,000 Seeker devices at launch (captive audience)
- Gen Z/Millennials split expenses 3-5x per week
- No competitor offers: split + pool + vote + stream in one app
- Crypto-native users already comfortable with wallets

## Slide 9: SKR Integration
Rally deeply integrates the Seeker token:
- **Daily Rewards**: Earn SKR for app usage (splits, payments, votes)
- **Squad Governance**: SKR-weighted votes for premium features
- **Reputation Staking**: Stake SKR to boost trust score
- **Premium Pools**: SKR-denominated savings with boosted yield
- **Referral Bonuses**: Earn SKR for growing the community

## Slide 10: Traction & Roadmap
**Now**: Functional prototype with all 6 core features
**Q2 2026**: dApp Store launch with Seeker devices
**Q3 2026**: 10,000 active squads, DeFi yield integration
**Q4 2026**: Cross-chain expansion, enterprise features
**2027**: 100,000+ users, seed round

## Slide 11: Team
- **[Your Name]** — Full-stack developer, Solana builder
- Previously: [relevant experience]
- Hackathon wins: [if applicable]
- Passionate about making crypto useful for everyday people

## Slide 12: The Ask
- We're building the app that 150,000 Seeker owners will use every day
- Rally makes Solana useful for real life — not just trading
- **Vote for Rally. Your squad is waiting.**

---

## Presentation Tips
- Demo > slides. Spend 60% of time showing the app working.
- Show REAL transactions on devnet during the demo.
- Emphasize the "zero crypto jargon" UX — judges are looking for consumer readiness.
- Highlight mobile-specific features: NFC, camera scanning, push notifications.
- End with a memorable line: "Every group needs a Rally."
