#!/usr/bin/env bash
# ─── Rally Mobile — EAS APK Build Script ─────────────────────
# Prerequisites: eas-cli installed, Expo account, project linked
#
# Usage:
#   ./scripts/build-apk.sh                  # Production APK
#   ./scripts/build-apk.sh --preview        # Preview APK (faster)
#   ./scripts/build-apk.sh --dev            # Development build
#
# First-Time Setup:
#   1. npm install -g eas-cli
#   2. eas login
#   3. cd apps/mobile && eas build:configure
#
# APK Output:
#   Downloaded to current directory after build completes (~10-15 min)
#
set -euo pipefail

cd "$(dirname "$0")/../apps/mobile"

PROFILE="production"

for arg in "$@"; do
  case $arg in
    --preview) PROFILE="preview" ;;
    --dev) PROFILE="development" ;;
  esac
done

echo "╔═══════════════════════════════════════╗"
echo "║  Rally Mobile — EAS APK Build          ║"
echo "╚═══════════════════════════════════════╝"

if ! command -v eas &> /dev/null; then
  echo "✗ EAS CLI not found. Install: npm install -g eas-cli"
  exit 1
fi

echo "→ Profile: $PROFILE"
echo "→ Platform: Android (APK)"
echo ""

# Verify eas.json exists
if [ ! -f eas.json ]; then
  echo "✗ eas.json not found. Run: eas build:configure"
  exit 1
fi

# Install deps
echo "→ Installing dependencies..."
npm install

# Build
echo "→ Starting EAS build..."
echo "  This will build on Expo's cloud servers (~10-15 minutes)"
echo ""

eas build --platform android --profile "$PROFILE" --non-interactive

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║  ✓ APK build submitted!                ║"
echo "╚═══════════════════════════════════════╝"
echo ""
echo "Track build: eas build:list"
echo "Download:    eas build:download --latest --platform android"
echo ""
echo "Install on Seeker:"
echo "  adb install rally-*.apk"
