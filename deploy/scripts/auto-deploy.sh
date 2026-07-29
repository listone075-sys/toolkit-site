#!/bin/bash
set -euo pipefail

LOG_FILE="/var/log/toolkit-deploy.log"
REPO_DIR="/opt/toolkit_site"
MAX_LOG_LINES=5000

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Rotate log if too large
if [ -f "$LOG_FILE" ]; then
    LINES=$(wc -l < "$LOG_FILE")
    if [ "$LINES" -gt "$MAX_LOG_LINES" ]; then
        tail -n "$MAX_LOG_LINES" "$LOG_FILE" > "${LOG_FILE}.tmp"
        mv "${LOG_FILE}.tmp" "$LOG_FILE"
        log "Log rotated (kept last $MAX_LOG_LINES lines)"
    fi
fi

cd "$REPO_DIR" || { log "FATAL: repo dir not found"; exit 1; }

# Ensure working tree is clean
if ! git diff --quiet 2>/dev/null; then
    log "Working tree dirty, stashing..."
    git stash 2>&1 | tee -a "$LOG_FILE"
fi

# Fetch latest
log "Fetching origin main..."
git fetch origin main 2>&1 | tee -a "$LOG_FILE"

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
    log "No changes (HEAD at ${LOCAL:0:7})"
    exit 0
fi

log "Changes detected: ${LOCAL:0:7} -> ${REMOTE:0:7}"

# Pull (fast-forward only)
log "Pulling..."
if ! git pull --ff-only 2>&1 | tee -a "$LOG_FILE"; then
    log "ERROR: git pull --ff-only failed. Manual intervention required."
    exit 1
fi

# Install deps
log "Installing dependencies..."
if ! npm install --legacy-peer-deps 2>&1 | tee -a "$LOG_FILE"; then
    log "ERROR: npm install failed. Current version unchanged."
    exit 1
fi

# Build
log "Building..."
if ! npm run build 2>&1 | tee -a "$LOG_FILE"; then
    log "ERROR: build failed. Current version unchanged."
    exit 1
fi

# Restart service
log "Restarting toolkit-site..."
systemctl restart toolkit-site
log "SUCCESS: Deployed ${REMOTE:0:7}, service restarted."
