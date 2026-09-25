#!/usr/bin/env bash
#
# dev-setup.sh — restore/prepare the local development environment.
#
# Idempotent: safe to run repeatedly. It selects a matching Node version
# (via nvm when available), installs dependencies from the lockfile, and
# prints how to run the app. Pass --start to launch the app afterwards.
#
# Usage:
#   ./scripts/dev-setup.sh
#   ./scripts/dev-setup.sh --start

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

REQUIRED_MAJOR=22

log() { printf '\033[1;34m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33mwarning:\033[0m %s\n' "$*" >&2; }
err() { printf '\033[1;31merror:\033[0m %s\n' "$*" >&2; }

# Source nvm if it is installed so a matching Node version can be selected.
load_nvm() {
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  if [ -s "$NVM_DIR/nvm.sh" ]; then
    # shellcheck disable=SC1091
    . "$NVM_DIR/nvm.sh"
    return 0
  fi
  return 1
}

ensure_node() {
  if load_nvm; then
    log "nvm detected — installing/using Node ${REQUIRED_MAJOR}"
    nvm install "$REQUIRED_MAJOR" >/dev/null
    nvm use "$REQUIRED_MAJOR" >/dev/null
  fi

  if ! command -v node >/dev/null 2>&1; then
    err "Node.js is not installed and nvm was not found."
    err "Install Node ${REQUIRED_MAJOR}+ (https://nodejs.org) or nvm (https://github.com/nvm-sh/nvm), then re-run."
    exit 1
  fi

  local major
  major="$(node -p 'process.versions.node.split(".")[0]')"
  if [ "$major" -lt "$REQUIRED_MAJOR" ]; then
    warn "Node $(node --version) detected; this project targets Node >= ${REQUIRED_MAJOR}."
    warn "Consider upgrading to avoid compatibility issues."
  else
    log "Using Node $(node --version)"
  fi
}

install_deps() {
  if [ -f package-lock.json ]; then
    log "Installing dependencies with npm ci"
    npm ci
  else
    log "No lockfile found; running npm install"
    npm install
  fi
}

main() {
  ensure_node
  install_deps

  log "Setup complete."
  log "Start the app:   npm start   (serves http://localhost:3000)"
  log "Run the tests:   npm test"

  if [ "${1:-}" = "--start" ]; then
    log "Launching the app (npm start)…"
    exec npm start
  fi
}

main "$@"
