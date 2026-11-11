# syntax=docker/dockerfile:1
#
# Intimate Sabbatical — Strapi 5 CMS image (production, SQLite).
#
# Build with ./cms as the context:
#   docker build -t intimate-sabbatical-cms:<tag> ./cms
#
# No secrets are baked in. Every secret (APP_KEYS, ADMIN_JWT_SECRET, ...) is supplied at
# runtime through cms/.env via docker-compose.yml. The build-only placeholder values below
# exist solely so Strapi can load its config files while compiling the admin panel; they live
# in the throw-away build stage and are not present in the final image.
#
# `strapi build` bundles the admin panel and is memory-hungry (>= ~2 GB) — build on a
# developer machine or CI, not on the shared VPS.

# ---------------------------------------------------------------------------
# 1) build: install everything (incl. native modules), compile TS, build the admin panel
# ---------------------------------------------------------------------------
FROM node:22-bookworm-slim AS build

# Toolchain used only if a native module (better-sqlite3, sharp) has no prebuilt binary.
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/app

# devDependencies (TypeScript) are required to build, so no NODE_ENV=production for `npm ci`.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN NODE_ENV=production \
    APP_KEYS=build-only-a,build-only-b \
    ADMIN_JWT_SECRET=build-only \
    API_TOKEN_SALT=build-only \
    TRANSFER_TOKEN_SALT=build-only \
    ENCRYPTION_KEY=build-only \
    JWT_SECRET=build-only \
    npm run build

# Drop devDependencies from the tree that is copied into the runtime image.
RUN npm prune --omit=dev

# ---------------------------------------------------------------------------
# 2) runtime: no compilers, no build tooling, unprivileged user
# ---------------------------------------------------------------------------
FROM node:22-bookworm-slim AS runtime

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=1337 \
    STRAPI_TELEMETRY_DISABLED=true

WORKDIR /opt/app

COPY --from=build --chown=node:node /opt/app ./

# Mount points for persistent data (bind-mounted by docker-compose.yml):
#   .tmp            -> SQLite database   (DATABASE_FILENAME=.tmp/data.db)
#   public/uploads  -> uploaded media
#   /backups        -> backup staging area used by deploy/backup.sh
RUN mkdir -p .tmp public/uploads /backups \
 && chown -R node:node .tmp public/uploads /backups

USER node
EXPOSE 1337

# Health is checked by docker-compose.yml against Strapi's built-in GET /_health.
CMD ["./node_modules/.bin/strapi", "start"]
