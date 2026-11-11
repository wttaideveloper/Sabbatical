# syntax=docker/dockerfile:1
#
# Intimate Sabbatical — Next.js frontend image (production, standalone output).
#
# Build from the repository root:
#   docker build -t intimate-sabbatical-web:<tag> \
#     --build-arg NEXT_PUBLIC_CMS_PUBLIC_URL=https://CMS_DOMAIN_REPLACE_ME \
#     --build-arg NEXT_PUBLIC_WEB_URL=https://WEB_DOMAIN_REPLACE_ME \
#     --build-arg NEXT_PUBLIC_CONTACT_EMAIL=CONTACT_EMAIL_REPLACE_ME .
#
# Only PUBLIC, non-secret NEXT_PUBLIC_* values are build arguments (Next.js inlines them into
# the bundle, so they cannot be changed without a rebuild). Secrets — STRAPI_API_TOKEN,
# ADMIN_PANEL_PASSWORD, ADMIN_SESSION_SECRET — are NEVER baked in; they are injected at
# runtime by docker-compose.yml. `next build` needs internet access (next/font downloads
# Google Fonts), so build on a developer machine or CI — not on the shared VPS.

# ---------------------------------------------------------------------------
# 1) deps: install ALL dependencies (devDependencies are needed to build) from the lockfile
# ---------------------------------------------------------------------------
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------------------------------------------------------------------------
# 2) build: compile the standalone server
# ---------------------------------------------------------------------------
FROM node:22-bookworm-slim AS build
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

ARG NEXT_PUBLIC_CMS_PUBLIC_URL
ARG NEXT_PUBLIC_WEB_URL
ARG NEXT_PUBLIC_CONTACT_EMAIL
ARG NEXT_PUBLIC_FULLSCRIPT_URL=""

ENV NEXT_PUBLIC_CMS_PUBLIC_URL=${NEXT_PUBLIC_CMS_PUBLIC_URL} \
    NEXT_PUBLIC_WEB_URL=${NEXT_PUBLIC_WEB_URL} \
    NEXT_PUBLIC_CONTACT_EMAIL=${NEXT_PUBLIC_CONTACT_EMAIL} \
    NEXT_PUBLIC_FULLSCRIPT_URL=${NEXT_PUBLIC_FULLSCRIPT_URL}

# Build-stage-only, non-secret placeholder. The CMS is never queried while building (see
# lib/strapi.ts), this just guarantees the "required in production" check cannot trip while
# Next prerenders framework pages. The real runtime value (http://cms:1337) comes from
# docker-compose.yml and is NOT part of the final image.
ENV STRAPI_INTERNAL_URL=http://cms:1337

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# next.config.ts fails this step with a clear message if a required NEXT_PUBLIC_* value is missing.
# The CMS is not contacted during the build, so no CMS content can be baked into the image.
RUN npm run build

# ---------------------------------------------------------------------------
# 3) runtime: minimal image with only the standalone server, no build tooling
# ---------------------------------------------------------------------------
FROM node:22-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public

# Writable cache directory for the image optimiser, owned by the unprivileged user.
RUN mkdir -p .next/cache && chown -R node:node .next

USER node
EXPOSE 3000

# Liveness is checked by docker-compose.yml (GET /api/health).
CMD ["node", "server.js"]
