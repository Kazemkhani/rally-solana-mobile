#!/usr/bin/env bash
# ─── Rally Solana Programs — Devnet Deployment Script ─────────
# Prerequisites: solana CLI, anchor CLI, funded devnet wallet
#
# Usage:
#   ./scripts/deploy-programs.sh                    # Build + deploy all
#   ./scripts/deploy-programs.sh --build-only       # Just build, no deploy
#   ./scripts/deploy-programs.sh --airdrop          # Airdrop SOL first
#
# First-Time Setup:
#   1. Install Solana CLI:
#      sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
#      export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
#
#   2. Install Anchor CLI:
#      cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked
#
#   3. Generate keypair:
#      solana-keygen new --no-bip39-passphrase
#
#   4. Configure devnet:
#      solana config set --url devnet
#
#   5. Fund wallet:
#      solana airdrop 5
#
set -euo pipefail

cd "$(dirname "$0")/.."

BUILD_ONLY=false
AIRDROP=false

for arg in "$@"; do
  case $arg in
    --build-only) BUILD_ONLY=true ;;
    --airdrop) AIRDROP=true ;;
  esac
done

echo "╔═══════════════════════════════════════╗"
echo "║  Rally Programs — Devnet Deployment    ║"
echo "╚═══════════════════════════════════════╝"

# Verify tools
for cmd in solana anchor; do
  if ! command -v $cmd &> /dev/null; then
    echo "✗ $cmd not found. See setup instructions at top of this script."
    exit 1
  fi
done

echo "→ Solana: $(solana --version)"
echo "→ Anchor: $(anchor --version)"
echo "→ Cluster: $(solana config get | grep 'RPC URL')"
echo "→ Wallet:  $(solana address)"
echo "→ Balance:  $(solana balance) SOL"
echo ""

# Airdrop if requested
if [ "$AIRDROP" = true ]; then
  echo "→ Requesting airdrop (5 SOL)..."
  solana airdrop 5 || solana airdrop 2
  echo "→ New balance: $(solana balance) SOL"
  echo ""
fi

# Check balance
BALANCE=$(solana balance | awk '{print $1}')
if (( $(echo "$BALANCE < 2" | bc -l) )); then
  echo "⚠ Low balance ($BALANCE SOL). Programs need ~3 SOL to deploy."
  echo "  Run: solana airdrop 5  (or use --airdrop flag)"
  exit 1
fi

# Build
echo "→ Building all programs..."
anchor build

echo ""
echo "→ Program keypairs generated:"
echo "  rally-squad:  $(solana address -k target/deploy/rally_squad-keypair.json)"
echo "  rally-stream: $(solana address -k target/deploy/rally_stream-keypair.json)"
echo "  rally-vote:   $(solana address -k target/deploy/rally_vote-keypair.json)"

if [ "$BUILD_ONLY" = true ]; then
  echo ""
  echo "✓ Build complete (deploy skipped)."
  exit 0
fi

# Update program IDs in source
SQUAD_ID=$(solana address -k target/deploy/rally_squad-keypair.json)
STREAM_ID=$(solana address -k target/deploy/rally_stream-keypair.json)
VOTE_ID=$(solana address -k target/deploy/rally_vote-keypair.json)

echo ""
echo "→ Updating program IDs in source..."

# Update Anchor.toml
sed -i "s/rally_squad = \".*\"/rally_squad = \"$SQUAD_ID\"/" Anchor.toml
sed -i "s/rally_stream = \".*\"/rally_stream = \"$STREAM_ID\"/" Anchor.toml
sed -i "s/rally_vote = \".*\"/rally_vote = \"$VOTE_ID\"/" Anchor.toml

# Update lib.rs declare_id! macros
sed -i "s/declare_id!(\".*\")/declare_id!(\"$SQUAD_ID\")/" programs/rally-squad/src/lib.rs
sed -i "s/declare_id!(\".*\")/declare_id!(\"$STREAM_ID\")/" programs/rally-stream/src/lib.rs
sed -i "s/declare_id!(\".*\")/declare_id!(\"$VOTE_ID\")/" programs/rally-vote/src/lib.rs

# Rebuild with correct IDs
echo "→ Rebuilding with updated program IDs..."
anchor build

# Deploy
echo ""
echo "→ Deploying rally-squad..."
anchor deploy --program-name rally_squad --provider.cluster devnet

echo "→ Deploying rally-stream..."
anchor deploy --program-name rally_stream --provider.cluster devnet

echo "→ Deploying rally-vote..."
anchor deploy --program-name rally_vote --provider.cluster devnet

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║  ✓ All programs deployed to devnet!    ║"
echo "╚═══════════════════════════════════════╝"
echo ""
echo "Program IDs:"
echo "  PROGRAM_RALLY_SQUAD=$SQUAD_ID"
echo "  PROGRAM_RALLY_STREAM=$STREAM_ID"
echo "  PROGRAM_RALLY_VOTE=$VOTE_ID"
echo ""
echo "Add these to your .env files and Railway variables."
echo ""
echo "Verify on Solana Explorer:"
echo "  https://explorer.solana.com/address/$SQUAD_ID?cluster=devnet"
echo "  https://explorer.solana.com/address/$STREAM_ID?cluster=devnet"
echo "  https://explorer.solana.com/address/$VOTE_ID?cluster=devnet"
