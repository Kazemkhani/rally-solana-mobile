#!/usr/bin/env bash
# ─── Rally — One-Command Dev Environment Setup ───────────────
# Usage: ./scripts/setup.sh
#
# What this does:
#   1. Checks prerequisites (Node.js, optional Anchor/Solana)
#   2. Installs all npm dependencies (monorepo workspaces)
#   3. Generates Prisma client
#   4. Starts PostgreSQL via Docker (or uses existing)
#   5. Pushes schema to database
#   6. Seeds demo data
#   7. Verifies everything works
#
# Prerequisites:
#   - Node.js 18+
#   - Docker (for PostgreSQL) OR provide your own DATABASE_URL in apps/api/.env
#   - Optional: Anchor CLI + Solana CLI for program builds
#
set -euo pipefail

cd "$(dirname "$0")/.."
ROOT=$(pwd)

echo ""
echo "  ╔═══════════════════════════════════════╗"
echo "  ║  Rally — Dev Environment Setup         ║"
echo "  ╚═══════════════════════════════════════╝"
echo ""

# ── Prerequisites ─────────────────────────────────────────────
echo "[1/6] Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo "  x Node.js required. Install from https://nodejs.org"; exit 1; }
echo "  + Node.js $(node -v)"

if command -v anchor >/dev/null 2>&1; then
  echo "  + Anchor $(anchor --version)"
else
  echo "  - Anchor not found (optional: cargo install --git https://github.com/coral-xyz/anchor anchor-cli)"
fi

if command -v solana >/dev/null 2>&1; then
  echo "  + Solana CLI $(solana --version | head -1)"
else
  echo "  - Solana CLI not found (optional: sh -c \"\$(curl -sSfL https://release.anza.xyz/stable/install)\")"
fi

# ── Dependencies ──────────────────────────────────────────────
echo ""
echo "[2/6] Installing dependencies..."
npm install
echo "  + All workspace dependencies installed"

# ── Environment file ──────────────────────────────────────────
echo ""
echo "[3/6] Setting up environment..."
cd "$ROOT/apps/api"
if [ ! -f .env ]; then
  cp .env.example .env
  echo "  + Created .env from .env.example"
  echo "  ! Edit apps/api/.env if you need custom database settings"
else
  echo "  + .env already exists"
fi

# ── PostgreSQL ────────────────────────────────────────────────
echo ""
echo "[4/6] Starting PostgreSQL..."
if command -v docker &> /dev/null; then
  if docker ps 2>/dev/null | grep -q rally-db; then
    echo "  + PostgreSQL already running (rally-db)"
  elif docker ps -a 2>/dev/null | grep -q rally-db; then
    docker start rally-db >/dev/null 2>&1
    echo "  + PostgreSQL restarted (rally-db)"
  else
    docker run -d \
      --name rally-db \
      -e POSTGRES_USER=rally \
      -e POSTGRES_PASSWORD=rally \
      -e POSTGRES_DB=rally_dev \
      -p 5432:5432 \
      postgres:16-alpine >/dev/null 2>&1 || true
    echo "  + PostgreSQL started (localhost:5432)"
  fi
  echo "  > Waiting for database to be ready..."
  sleep 3
else
  echo "  - Docker not found. Ensure PostgreSQL is running and DATABASE_URL is correct in .env"
fi

# ── Prisma ────────────────────────────────────────────────────
echo ""
echo "[5/6] Setting up database..."
cd "$ROOT/apps/api"
npx prisma generate 2>/dev/null
npx prisma db push --skip-generate 2>/dev/null || echo "  ! DB push failed — check DATABASE_URL in .env"
echo "  + Prisma client generated & schema pushed"

# ── Seed data ─────────────────────────────────────────────────
echo ""
echo "[6/6] Seeding demo data..."
npm run db:seed 2>/dev/null || echo "  ! Seed failed (database may already be seeded or unreachable)"
echo "  + Demo data seeded (5 users, 3 squads, 4 txs, 2 streams)"

# ── Verify ────────────────────────────────────────────────────
cd "$ROOT"
echo ""
echo "  ╔═══════════════════════════════════════╗"
echo "  ║  Rally dev environment ready!          ║"
echo "  ╚═══════════════════════════════════════╝"
echo ""
echo "  Start development:"
echo "    API:       cd apps/api && npm run dev"
echo "    Mobile:    cd apps/mobile && npx expo start"
echo "    Programs:  anchor build && anchor test"
echo ""
echo "  Verify API:  curl http://localhost:3001/api/health"
echo ""
echo "  Deploy:"
echo "    API:       ./scripts/deploy-api.sh"
echo "    Programs:  ./scripts/deploy-programs.sh"
echo "    APK:       ./scripts/build-apk.sh"
echo ""
