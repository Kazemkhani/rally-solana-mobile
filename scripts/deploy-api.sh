#!/usr/bin/env bash
# ─── Rally API — Railway Deployment Script ────────────────────
# Prerequisites: railway CLI installed, logged in, project linked
#
# Usage:
#   ./scripts/deploy-api.sh              # Deploy to Railway
#   ./scripts/deploy-api.sh --docker     # Deploy via Docker locally
#   ./scripts/deploy-api.sh --seed       # Deploy + seed demo data
#
# Railway Setup (first time):
#   1. npm install -g @railway/cli
#   2. railway login
#   3. railway init  (or railway link)
#   4. railway add --plugin postgresql   # Add PostgreSQL
#   5. railway variables set JWT_SECRET=<your-secret>
#   6. railway variables set SOLANA_RPC_URL=https://api.devnet.solana.com
#   7. ./scripts/deploy-api.sh
#
set -euo pipefail

cd "$(dirname "$0")/../apps/api"

SEED=false
DOCKER=false

for arg in "$@"; do
  case $arg in
    --seed) SEED=true ;;
    --docker) DOCKER=true ;;
  esac
done

echo "╔═══════════════════════════════════════╗"
echo "║  Rally API — Deployment               ║"
echo "╚═══════════════════════════════════════╝"

if [ "$DOCKER" = true ]; then
  echo "→ Building Docker image..."
  docker compose build
  echo "→ Starting services..."
  docker compose up -d
  echo "→ Waiting for database..."
  sleep 3
  if [ "$SEED" = true ]; then
    echo "→ Seeding demo data..."
    docker compose exec api npx tsx prisma/seed.ts
  fi
  echo ""
  echo "✓ API running at http://localhost:3001"
  echo "✓ Database at postgresql://rally:rally@localhost:5432/rally_dev"
  echo ""
  echo "Verify: curl http://localhost:3001/api/health"
  exit 0
fi

# Railway deployment
if ! command -v railway &> /dev/null; then
  echo "✗ Railway CLI not found. Install: npm install -g @railway/cli"
  exit 1
fi

echo "→ Building TypeScript..."
npm ci
npx prisma generate
npx tsc

echo "→ Deploying to Railway..."
railway up --detach

echo "→ Running database migrations..."
railway run npx prisma db push --skip-generate

if [ "$SEED" = true ]; then
  echo "→ Seeding demo data..."
  railway run npx tsx prisma/seed.ts
fi

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║  ✓ Rally API deployed to Railway!      ║"
echo "╚═══════════════════════════════════════╝"
echo ""
echo "Check: railway open"
echo "Logs:  railway logs"
echo "URL:   railway domain"
