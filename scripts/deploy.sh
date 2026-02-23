#!/bin/bash
# Rally Deployment Script — Deploy Solana programs to devnet
set -e

echo "🚀 Deploying Rally programs to devnet..."

# Ensure we're on devnet
solana config set --url devnet

# Check wallet balance
BALANCE=$(solana balance | awk '{print $1}')
echo "💰 Wallet balance: $BALANCE SOL"

if (( $(echo "$BALANCE < 2" | bc -l) )); then
    echo "⚠️  Low balance. Requesting airdrop..."
    solana airdrop 2
    sleep 5
fi

# Build programs
echo ""
echo "⚓ Building programs..."
anchor build

# Deploy
echo ""
echo "📤 Deploying rally-squad..."
SQUAD_ID=$(anchor deploy --program-name rally_squad 2>&1 | grep "Program Id:" | awk '{print $3}')
echo "   Squad Program ID: $SQUAD_ID"

echo ""
echo "📤 Deploying rally-stream..."
STREAM_ID=$(anchor deploy --program-name rally_stream 2>&1 | grep "Program Id:" | awk '{print $3}')
echo "   Stream Program ID: $STREAM_ID"

echo ""
echo "📤 Deploying rally-vote..."
VOTE_ID=$(anchor deploy --program-name rally_vote 2>&1 | grep "Program Id:" | awk '{print $3}')
echo "   Vote Program ID: $VOTE_ID"

echo ""
echo "✅ All programs deployed!"
echo ""
echo "Update your .env with:"
echo "  PROGRAM_RALLY_SQUAD=$SQUAD_ID"
echo "  PROGRAM_RALLY_STREAM=$STREAM_ID"
echo "  PROGRAM_RALLY_VOTE=$VOTE_ID"
