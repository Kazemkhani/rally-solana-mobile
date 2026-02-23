#!/bin/bash
# Rally Development Setup Script
# Run this once to set up the full development environment

set -e

echo "🚀 Setting up Rally development environment..."

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js required. Install from https://nodejs.org"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm required."; exit 1; }

echo "✅ Node.js $(node -v) detected"

# Check optional tools
if command -v anchor >/dev/null 2>&1; then
    echo "✅ Anchor $(anchor --version) detected"
else
    echo "⚠️  Anchor not found. Install: cargo install --git https://github.com/coral-xyz/anchor anchor-cli"
    echo "   Solana programs won't build without Anchor."
fi

if command -v solana >/dev/null 2>&1; then
    echo "✅ Solana CLI $(solana --version) detected"
else
    echo "⚠️  Solana CLI not found. Install: sh -c \"\$(curl -sSfL https://release.anza.xyz/stable/install)\""
fi

# Install root dependencies
echo ""
echo "📦 Installing root dependencies..."
npm install

# Install mobile app dependencies
echo ""
echo "📱 Installing mobile app dependencies..."
cd apps/mobile
npm install
cd ../..

# Install API dependencies
echo ""
echo "🖥️  Installing API dependencies..."
cd apps/api
npm install

# Generate Prisma client
echo ""
echo "🗄️  Generating Prisma client..."
npx prisma generate 2>/dev/null || echo "⚠️  Prisma generate skipped (set DATABASE_URL first)"
cd ../..

# Build Solana programs (if Anchor is available)
if command -v anchor >/dev/null 2>&1; then
    echo ""
    echo "⚓ Building Solana programs..."
    anchor build || echo "⚠️  Anchor build failed. Check Rust/Anchor installation."
fi

# Create .env files if they don't exist
if [ ! -f apps/api/.env ]; then
    echo ""
    echo "📝 Creating API .env file..."
    cat > apps/api/.env << 'ENVEOF'
# Solana
SOLANA_CLUSTER=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
PROGRAM_RALLY_SQUAD=
PROGRAM_RALLY_STREAM=
PROGRAM_RALLY_VOTE=

# Database
DATABASE_URL=postgresql://localhost:5432/rally_dev

# Auth
JWT_SECRET=change-this-to-a-random-secret

# Server
PORT=3001

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=

# SKR Token
SKR_MINT_ADDRESS=
ENVEOF
    echo "   ⚠️  Update apps/api/.env with your actual values"
fi

echo ""
echo "✅ Rally development environment ready!"
echo ""
echo "Quick start:"
echo "  📱 Mobile app:  cd apps/mobile && npx expo start"
echo "  🖥️  API server:  cd apps/api && npm run dev"
echo "  ⚓ Programs:    anchor build && anchor test"
echo ""
echo "🏁 Let's build! — Rally"
