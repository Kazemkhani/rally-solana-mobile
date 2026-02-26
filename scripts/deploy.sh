#!/usr/bin/env bash
# ─── Rally — Full Deployment (Programs + API + APK) ──────────
# Usage: ./scripts/deploy.sh
#
# This script orchestrates all three deployments in order:
#   1. Solana programs → devnet
#   2. API server → Railway (with PostgreSQL)
#   3. Mobile APK → EAS Build
#
# Prerequisites: solana, anchor, railway, eas CLIs installed & authenticated
#
set -euo pipefail

cd "$(dirname "$0")/.."

echo ""
echo "  ╔═══════════════════════════════════════╗"
echo "  ║  Rally — Full Deployment               ║"
echo "  ╚═══════════════════════════════════════╝"
echo ""

# ── Step 1: Solana Programs ───────────────────────────────────
echo "═══ STEP 1/3: Solana Programs → Devnet ═══"
echo ""
./scripts/deploy-programs.sh

# Capture program IDs for API config
SQUAD_ID=$(solana address -k target/deploy/rally_squad-keypair.json)
STREAM_ID=$(solana address -k target/deploy/rally_stream-keypair.json)
VOTE_ID=$(solana address -k target/deploy/rally_vote-keypair.json)

# ── Step 2: API Server ────────────────────────────────────────
echo ""
echo "═══ STEP 2/3: API Server → Railway ═══"
echo ""

# Set program IDs as Railway variables
if command -v railway &> /dev/null; then
  railway variables set PROGRAM_RALLY_SQUAD="$SQUAD_ID"
  railway variables set PROGRAM_RALLY_STREAM="$STREAM_ID"
  railway variables set PROGRAM_RALLY_VOTE="$VOTE_ID"
fi

./scripts/deploy-api.sh --seed

# ── Step 3: Mobile APK ────────────────────────────────────────
echo ""
echo "═══ STEP 3/3: Mobile APK → EAS Build ═══"
echo ""
./scripts/build-apk.sh --preview

echo ""
echo "  ╔═══════════════════════════════════════╗"
echo "  ║  Rally fully deployed!                 ║"
echo "  ╚═══════════════════════════════════════╝"
echo ""
echo "  Programs: https://explorer.solana.com/address/$SQUAD_ID?cluster=devnet"
echo "  API:      railway open"
echo "  APK:      eas build:download --latest --platform android"
echo ""
