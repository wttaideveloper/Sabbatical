#!/usr/bin/env bash
#
# Intimate Sabbatical — consistent backup of the SQLite database + CMS uploads.
#
# What it does
#   1. Asks the RUNNING cms container to take an online backup of the live database using
#      SQLite's backup API (via the better-sqlite3 module already inside the image). This is safe
#      while Strapi is running — it is NOT a raw copy of a live database file.
#   2. Verifies the backup with PRAGMA integrity_check.
#   3. Packs the database backup and the uploads directory into ONE timestamped archive, so the
#      two always belong together:   intimate-sabbatical-backup-<UTC timestamp>.tar.gz
#   4. Writes a .sha256 checksum next to it and deletes archives older than RETENTION_DAYS.
#
# Safety
#   - Docker access is restricted to containers labelled with the "intimate-sabbatical" Compose
#     project (the project name is hard-coded below on purpose). No other container is touched.
#   - Nothing is stopped, restarted or removed, and no docker prune/system command is used.
#   - Retention deletes only this script's own archives, inside BACKUP_DIR.
#
# Usage (run as a user that can use docker and read APP_DATA_DIR, e.g. via sudo):
#     bash deploy/backup.sh
#     APP_DATA_DIR=/srv/appdata/intimate-sabbatical RETENTION_DAYS=14 bash deploy/backup.sh
#
# Cron example (daily 03:15) — see DEPLOYMENT.md:
#     15 3 * * * /bin/bash /path/to/deploy/backup.sh >> /var/log/intimate-sabbatical-backup.log 2>&1

set -euo pipefail
umask 077

# Hard-coded: the script must never be pointed at another project's containers.
readonly PROJECT="intimate-sabbatical"

APP_DATA_DIR="${APP_DATA_DIR:-/srv/appdata/intimate-sabbatical}"
BACKUP_DIR="${BACKUP_DIR:-${APP_DATA_DIR}/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"

readonly DB_IN_CONTAINER="/opt/app/.tmp/data.db"
readonly BACKUPS_IN_CONTAINER="/backups"   # = ${APP_DATA_DIR}/backups on the host
readonly UPLOADS_DIR="${APP_DATA_DIR}/cms-uploads"

log()  { printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*"; }
fail() { log "ERROR: $*" >&2; exit 1; }

# ---- sanity checks -------------------------------------------------------------------------
command -v docker >/dev/null 2>&1 || fail "docker is not installed or not in PATH"
[[ "${RETENTION_DAYS}" =~ ^[0-9]+$ ]] || fail "RETENTION_DAYS must be a whole number"
[[ -d "${APP_DATA_DIR}" ]]  || fail "APP_DATA_DIR does not exist: ${APP_DATA_DIR}"
[[ -d "${UPLOADS_DIR}" ]]   || fail "uploads directory does not exist: ${UPLOADS_DIR}"
[[ -d "${BACKUP_DIR}" ]]    || fail "backup directory does not exist: ${BACKUP_DIR} (create it first, see DEPLOYMENT.md)"
# The staging area inside the container is the host's backups/ directory; they must be the same one.
[[ "${BACKUP_DIR}" == "${APP_DATA_DIR}/backups" ]] \
  || fail "BACKUP_DIR must be ${APP_DATA_DIR}/backups (it is the directory mounted into the cms container)"

# ---- locate the cms container of THIS project only -----------------------------------------
CID="$(docker ps --quiet \
        --filter "label=com.docker.compose.project=${PROJECT}" \
        --filter "label=com.docker.compose.service=cms" \
        --filter "status=running" | head -n 1)"
[[ -n "${CID}" ]] || fail "the ${PROJECT} cms container is not running; start it (docker compose -p ${PROJECT} up -d cms) and retry"

TS="$(date -u +%Y%m%dT%H%M%SZ)"
STAGE_NAME=".staging-${TS}"
[[ "${STAGE_NAME}" =~ ^\.staging-[0-9]{8}T[0-9]{6}Z$ ]] || fail "unexpected staging name"
STAGE_IN_CONTAINER="${BACKUPS_IN_CONTAINER}/${STAGE_NAME}"
STAGE_ON_HOST="${BACKUP_DIR}/${STAGE_NAME}"
ARCHIVE="${BACKUP_DIR}/intimate-sabbatical-backup-${TS}.tar.gz"

cleanup() {
  # Remove the staging dir through the container (it owns the files) and any half-written archive.
  docker exec "${CID}" rm -rf "${STAGE_IN_CONTAINER}" >/dev/null 2>&1 || true
  rm -f "${ARCHIVE}.partial"
}
trap cleanup EXIT

# ---- 1+2) online SQLite backup + integrity check, performed inside the container -----------
read -r -d '' SQLITE_BACKUP_JS <<'JS' || true
const Database = require('better-sqlite3');
const [src, dest] = process.argv.slice(1);
const db = new Database(src, { readonly: true, fileMustExist: true });
db.backup(dest)
  .then(() => {
    db.close();
    const copy = new Database(dest, { readonly: true });
    const result = copy.pragma('integrity_check', { simple: true });
    copy.close();
    if (result !== 'ok') {
      console.error('integrity_check failed: ' + result);
      process.exit(2);
    }
    console.log('sqlite online backup ok (integrity_check: ok)');
  })
  .catch((err) => {
    console.error(String((err && err.message) || err));
    process.exit(1);
  });
JS

log "Backing up SQLite database from container ${CID:0:12} ..."
docker exec "${CID}" mkdir -p "${STAGE_IN_CONTAINER}"
docker exec "${CID}" node -e "${SQLITE_BACKUP_JS}" "${DB_IN_CONTAINER}" "${STAGE_IN_CONTAINER}/data.db"
[[ -s "${STAGE_ON_HOST}/data.db" ]] || fail "database backup was not produced at ${STAGE_ON_HOST}/data.db"

# ---- 3) one archive containing database + uploads ------------------------------------------
log "Creating archive ${ARCHIVE##*/} ..."
set +e
tar -czf "${ARCHIVE}.partial" -C "${STAGE_ON_HOST}" data.db -C "${APP_DATA_DIR}" cms-uploads
TAR_RC=$?
set -e
# GNU tar exits 1 when a file changed while being read (an upload landed mid-archive): tolerated.
# Anything higher is a real failure.
if (( TAR_RC > 1 )); then fail "tar failed with exit code ${TAR_RC}"; fi
(( TAR_RC == 1 )) && log "WARNING: some upload files changed while archiving (non-fatal)"

mv "${ARCHIVE}.partial" "${ARCHIVE}"
( cd "${BACKUP_DIR}" && sha256sum "${ARCHIVE##*/}" > "${ARCHIVE##*/}.sha256" )
log "Backup written: ${ARCHIVE} ($(du -h "${ARCHIVE}" | cut -f1))"

# ---- 4) retention: only this script's own archives, only inside BACKUP_DIR -----------------
log "Applying retention: deleting archives older than ${RETENTION_DAYS} days ..."
find "${BACKUP_DIR}" -maxdepth 1 -type f \
  \( -name 'intimate-sabbatical-backup-*.tar.gz' -o -name 'intimate-sabbatical-backup-*.tar.gz.sha256' \) \
  -mtime +"${RETENTION_DAYS}" -print -delete

# Leftovers of an interrupted earlier run (a staging dir older than a day). The name pattern is
# strict, so nothing but this script's own staging folders can ever match.
find "${BACKUP_DIR}" -maxdepth 1 -type d -name '.staging-????????T??????Z' -mtime +1 \
  -exec rm -rf {} + 2>/dev/null \
  || log "WARNING: could not remove an old staging directory (permissions?) — remove it manually"

log "Done."
