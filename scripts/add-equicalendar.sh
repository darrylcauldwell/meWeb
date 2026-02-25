#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# add-equicalendar.sh - Add EquiCalendar to an existing meWeb production stack
# =============================================================================
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/darrylcauldwell/meWeb/main/scripts/add-equicalendar.sh \
#     | bash -s -- [HOME_POSTCODE]
#
# Example:
#   curl -fsSL https://raw.githubusercontent.com/darrylcauldwell/meWeb/main/scripts/add-equicalendar.sh \
#     | bash -s -- "SW1A 1AA"
# =============================================================================

DEPLOY_DIR="/opt/meWeb/site"
HOME_POSTCODE="${1:-}"

log() {
  echo "[equicalendar] $*"
}

if [[ -z "$HOME_POSTCODE" ]]; then
  echo "Usage: $0 <HOME_POSTCODE>"
  echo "  e.g. bash -s -- \"SW1A 1AA\""
  exit 1
fi

# ---------------------------------------------------------------------------
# 1. Pull latest repo
# ---------------------------------------------------------------------------
log "Pulling latest meWeb repo..."
cd "$DEPLOY_DIR"
git stash --quiet 2>/dev/null || true
git pull
git stash drop --quiet 2>/dev/null || true

# ---------------------------------------------------------------------------
# 2. Add env vars (idempotent - skips if already present)
# ---------------------------------------------------------------------------
ENV_FILE="$DEPLOY_DIR/.env"
if grep -q "EQUICALENDAR_ADDRESS" "$ENV_FILE" 2>/dev/null; then
  log ".env already contains EQUICALENDAR vars, skipping."
else
  log "Generating API key and appending to .env..."
  EQUICALENDAR_API_KEY=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)
  cat >> "$ENV_FILE" <<ENVEOF

# EquiCalendar
EQUICALENDAR_ADDRESS=equicalendar.dreamfold.dev
EQUICALENDAR_HOME_POSTCODE=${HOME_POSTCODE}
EQUICALENDAR_API_KEY=${EQUICALENDAR_API_KEY}
EQUICALENDAR_ANALYTICS_DOMAIN=
ENVEOF
  log "Added EQUICALENDAR vars to .env (API key auto-generated)."
fi

# ---------------------------------------------------------------------------
# 3. Pull images
# ---------------------------------------------------------------------------
log "Pulling container images..."
docker compose -f docker-compose.production.yml pull

# ---------------------------------------------------------------------------
# 4. Start/restart stack
# ---------------------------------------------------------------------------
log "Starting production stack..."
docker compose -f docker-compose.production.yml up -d

# ---------------------------------------------------------------------------
# 5. Verify
# ---------------------------------------------------------------------------
log "Waiting 10s for container startup..."
sleep 10

log "Container status:"
docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "NAME|equicalendar|meweb"

log "EquiCalendar logs (last 20 lines):"
docker logs equicalendar --tail 20 2>&1 || true

echo ""
if curl -sf --max-time 15 "https://equicalendar.dreamfold.dev" > /dev/null 2>&1; then
  log "HTTPS endpoint is live at https://equicalendar.dreamfold.dev"
else
  log "HTTPS not yet reachable (Caddy may still be provisioning the TLS cert)."
  log "Check with: docker logs meweb | tail -20"
fi

cat <<'DONE'

========================================
  EquiCalendar deployment complete!
========================================

Verify:
  curl -I https://equicalendar.dreamfold.dev
  docker logs equicalendar

To update later:
  cd /opt/meWeb/site
  docker compose -f docker-compose.production.yml pull equicalendar
  docker compose -f docker-compose.production.yml up -d equicalendar

DONE
