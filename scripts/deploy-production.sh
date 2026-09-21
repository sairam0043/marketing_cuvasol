#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="/opt/cuvasol-marketing"
REPO_URL="https://github.com/sairam0043/marketing_cuvasol.git"
ROOT_ENV_PARAMETER="/cuvasol/marketing/root-env"
BACKEND_ENV_PARAMETER="/cuvasol/marketing/backend-env"
SERVICE_NAME="cuvasol-marketing.service"

if [[ -z "${RELEASE_SHA:-}" ]] || [[ ! "${RELEASE_SHA}" =~ ^[0-9a-f]{40}$ ]]; then
  echo "RELEASE_SHA must be a full 40-character Git commit SHA." >&2
  exit 1
fi

RELEASE_DIR="${APP_ROOT}/releases/${RELEASE_SHA}"
PREVIOUS_TARGET="$(readlink -f "${APP_ROOT}/current" 2>/dev/null || true)"
ROOT_ENV_TEMP="$(mktemp)"
BACKEND_ENV_TEMP="$(mktemp)"

cleanup() {
  rm -f -- "${ROOT_ENV_TEMP}" "${BACKEND_ENV_TEMP}"
}
trap cleanup EXIT

rollback() {
  if [[ -n "${PREVIOUS_TARGET}" && -d "${PREVIOUS_TARGET}" ]]; then
    ln -sfn "${PREVIOUS_TARGET}" "${APP_ROOT}/current"
    systemctl restart "${SERVICE_NAME}"
    systemctl reload nginx
    echo "Deployment failed and the previous release was restored." >&2
  fi
}
trap rollback ERR

mkdir -p "${APP_ROOT}/releases"
if [[ ! -d "${RELEASE_DIR}/.git" ]]; then
  git clone --no-checkout "${REPO_URL}" "${RELEASE_DIR}"
fi

git -C "${RELEASE_DIR}" fetch --prune origin
git -C "${RELEASE_DIR}" checkout --detach "${RELEASE_SHA}"
test "$(git -C "${RELEASE_DIR}" rev-parse HEAD)" = "${RELEASE_SHA}"

aws ssm get-parameter \
  --region ap-south-1 \
  --name "${ROOT_ENV_PARAMETER}" \
  --with-decryption \
  --query 'Parameter.Value' \
  --output text > "${ROOT_ENV_TEMP}"

aws ssm get-parameter \
  --region ap-south-1 \
  --name "${BACKEND_ENV_PARAMETER}" \
  --with-decryption \
  --query 'Parameter.Value' \
  --output text > "${BACKEND_ENV_TEMP}"

chmod 600 "${ROOT_ENV_TEMP}" "${BACKEND_ENV_TEMP}"
cp "${ROOT_ENV_TEMP}" "${RELEASE_DIR}/.env"

cd "${RELEASE_DIR}"
npm ci
npm run build
rm -f -- "${RELEASE_DIR}/.env"

install -o root -g root -m 600 "${BACKEND_ENV_TEMP}" /etc/cuvasol-marketing/backend.env
if ! grep -q '^MONGODB_URI=' /etc/cuvasol-marketing/backend.env && grep -q '^MONGO_URI=' /etc/cuvasol-marketing/backend.env; then
  sed -i 's/^MONGO_URI=/MONGODB_URI=/' /etc/cuvasol-marketing/backend.env
fi
if ! grep -q '^HOST=' /etc/cuvasol-marketing/backend.env; then
  printf '\nHOST=127.0.0.1\n' >> /etc/cuvasol-marketing/backend.env
fi

chown -R cuvasol-marketing:cuvasol-marketing "${RELEASE_DIR}"
find "${RELEASE_DIR}" -type d -exec chmod 755 {} +
find "${RELEASE_DIR}" -type f -exec chmod 644 {} +

ln -sfn "${RELEASE_DIR}" "${APP_ROOT}/current"
systemctl restart "${SERVICE_NAME}"
nginx -t
systemctl reload nginx

for attempt in {1..12}; do
  if curl --fail --silent --show-error https://marketing.cuvasol.com/api/health >/dev/null; then
    curl --fail --silent --show-error https://marketing.cuvasol.com/ >/dev/null
    trap - ERR
    echo "Deployment ${RELEASE_SHA} completed successfully."
    exit 0
  fi
  sleep 5
done

echo "Production health checks did not pass." >&2
false
