# ─── Rally API — Production Dockerfile ────────────────────────
# Multi-stage build for minimal image size
# Deploy to Railway, Render, Fly.io, or any Docker host

FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN npx tsc

# ─── Production image ─────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

# Security: non-root user
RUN addgroup --system rally && adduser --system --ingroup rally rally

# Copy built artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

# Prisma needs the schema at runtime for migrations
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-3001}/api/health || exit 1

USER rally

EXPOSE ${PORT:-3001}

# Start with Prisma migration then server
CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/index.js"]
