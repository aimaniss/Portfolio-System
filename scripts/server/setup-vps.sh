#!/usr/bin/env bash
# One-time VPS setup for the portfolio and ops stacks. Needs sudo:
#   scp scripts/server/setup-vps.sh ~/.ssh/id_ed25519.pub aiman@<vps>:/tmp/
#   ssh -t aiman@<vps> sudo DEPLOY_KEY_FILE=/tmp/id_ed25519.pub bash /tmp/setup-vps.sh
set -euo pipefail

# Public key that may log in as `deploy` (not a secret), copied next to this script.
DEPLOY_KEY=$(cat "${DEPLOY_KEY_FILE:-/tmp/deploy_key.pub}")

echo "==> Folders for /srv/portfolio and /srv/ops"
install -d -o deploy -g deploy /srv/portfolio /srv/portfolio/storage /srv/ops

echo "==> Allow the key to log in as deploy"
install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
touch /home/deploy/.ssh/authorized_keys
grep -qxF "$DEPLOY_KEY" /home/deploy/.ssh/authorized_keys || echo "$DEPLOY_KEY" >> /home/deploy/.ssh/authorized_keys
chown deploy:deploy /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys

echo "==> Tailscale"
command -v tailscale >/dev/null || curl -fsSL https://tailscale.com/install.sh | sh
# --operator lets `aiman` run `tailscale serve` without sudo. Opens a login link the first time.
tailscale up --operator=aiman --hostname=byaiman-vps

echo "==> Done. Tailscale IP: $(tailscale ip -4)"
