# Deployment guide — Intimate Sabbatical

Production deployment of the Next.js site (`web`) and the Strapi CMS (`cms`, SQLite) on a shared Ubuntu 24.04
VPS with Docker, Docker Compose and the host's existing nginx.

**Ground rules for this server** (it already hosts other production projects):

- Everything here is scoped to one Compose project: `intimate-sabbatical`. Always pass `-p intimate-sabbatical`.
- Never run `docker system prune`, `docker volume prune`, `docker rm $(docker ps -aq)`, `docker stop $(docker ps -q)`,
  `systemctl restart docker` or `systemctl restart nginx`. Use project-scoped commands and `nginx -t` +
  `systemctl reload nginx` only.
- Never edit an existing nginx site. Add new files only (templates live in `deploy/nginx/`).
- Never build images on the VPS. Build elsewhere (your machine / CI), then transfer them.
- Never put real secrets in git, in a Dockerfile, in an image, or in build arguments.

`<web-domain>` and `<cms-domain>` below are placeholders — the real subdomains are created later.

---

## 0. Architecture in one picture

```
Browser ──HTTPS──> host nginx ──> 127.0.0.1:WEB_HOST_PORT (web, Next.js)   ┐ private Docker network
                          └─────> 127.0.0.1:CMS_HOST_PORT (cms, Strapi)    ┘ "intimate-sabbatical-net"
                                       ▲
 web ──server-side, http://cms:1337/api──┘   (STRAPI_INTERNAL_URL — never public)
```

| Traffic | URL used | Why |
|---|---|---|
| Next.js → Strapi API | `http://cms:1337` (`STRAPI_INTERNAL_URL`, runtime) | private network, no TLS hop |
| Browser → CMS images/videos | `https://<cms-domain>/uploads/...` (`NEXT_PUBLIC_CMS_PUBLIC_URL`, build time) | browsers cannot reach the Docker network |
| Browser → CMS `/api/` | **blocked in nginx** | the API is internal-only |
| Media references stored in the DB | relative `/uploads/...` | no hostname ever lives in the database |

---

## 1. Local development

```bash
npm install
npm --prefix cms install
```

**Strapi** — copy `cms/.env.example` to `cms/.env` and for local use set:

```
PUBLIC_URL=http://localhost:1337
IS_PROXIED=false
CORS_ORIGINS=http://localhost:3000,http://localhost:1337
STRAPI_SEED=true          # optional: load sample content (development only; production never seeds)
```

Generate the secrets (any random values are fine locally; see §3 for the commands).

**Next.js** — copy `.env.example` to `.env.local` and keep only what you need. With the defaults, local
development needs just:

```
ADMIN_PANEL_PASSWORD=...        # any value locally
ADMIN_SESSION_SECRET=...        # any value locally
STRAPI_API_TOKEN=...            # create it in http://localhost:1337/admin -> Settings -> API Tokens
```

`STRAPI_INTERNAL_URL`, `NEXT_PUBLIC_CMS_PUBLIC_URL` and `NEXT_PUBLIC_WEB_URL` default to `localhost` outside
production, and `NEXT_PUBLIC_CONTACT_EMAIL` defaults to a placeholder.

Run both (two terminals): `npm --prefix cms run develop` and `npm run dev`.

> **Behaviour change:** the seed script no longer runs automatically. Sample content is only created when
> `STRAPI_SEED=true` **and** `NODE_ENV` is not `production`.
> `NEXT_PUBLIC_STRAPI_URL` no longer exists; it was split into `STRAPI_INTERNAL_URL` and `NEXT_PUBLIC_CMS_PUBLIC_URL`.

---

## 2. Production environment variables

Two files on the server, both `chmod 600`, both **never** committed:

- `.env` — next to `docker-compose.yml` (template: `.env.example`)
- `cms/.env` — the CMS environment (template: `cms/.env.example`). The path can be changed with `CMS_ENV_FILE`.

> **Create both files ON THE SERVER from the two `.example` templates, with freshly generated production values.**
> Never copy your local `.env` / `cms/.env` to the server: they hold development-only secrets, a Strapi API token that
> only works against your local database, and `localhost` URLs. They are git-ignored and excluded from both Docker
> build contexts, so they cannot end up in an image either.
>
> Both files are parsed by Docker Compose, which expands `$` in values. Generate secrets with the commands in §3
> (hex/base64 never contain `$`); if a value ever must contain `$` or `#`, wrap it in single quotes.

| Variable | File | When | Public? | Notes |
|---|---|---|---|---|
| `COMPOSE_PROJECT_NAME` | `.env` | compose | – | keep `intimate-sabbatical` |
| `APP_DATA_DIR` | `.env` | compose | – | `/srv/appdata/intimate-sabbatical` |
| `WEB_HOST_PORT`, `CMS_HOST_PORT` | `.env` | compose | – | candidates `4300` / `4301`; **check they're free (§7)** |
| `IMAGE_TAG` | `.env` | compose | – | new tag per release (enables rollback) |
| `CMS_ENV_FILE` | `.env` | compose | – | default `./cms/.env` |
| `NEXT_PUBLIC_CMS_PUBLIC_URL` | `.env` | **build** | public | `https://<cms-domain>` — replace placeholder |
| `NEXT_PUBLIC_WEB_URL` | `.env` | **build** | public | `https://<web-domain>` — replace placeholder |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `.env` | **build** | public | where contact/booking emails go |
| `NEXT_PUBLIC_FULLSCRIPT_URL` | `.env` | **build** | public | optional |
| `STRAPI_INTERNAL_URL` | compose | runtime | server | fixed to `http://cms:1337` by `docker-compose.yml` |
| `STRAPI_API_TOKEN` | `.env` | runtime | **secret** | created in Strapi after first start (§10) |
| `ADMIN_PANEL_PASSWORD` | `.env` | runtime | **secret** | ≥ 12 chars or admin sign-in is disabled |
| `ADMIN_SESSION_SECRET` | `.env` | runtime | **secret** | ≥ 32 chars or admin sign-in is disabled |
| `NODE_ENV`, `PORT`, `HOSTNAME` | compose | runtime | – | set by `docker-compose.yml` |
| `HOST`, `PORT` | `cms/.env` | runtime | – | `0.0.0.0`, `1337` |
| `APP_KEYS` | `cms/.env` | runtime | **secret** | 4 comma-separated random values |
| `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`, `TRANSFER_TOKEN_SALT`, `ENCRYPTION_KEY`, `JWT_SECRET` | `cms/.env` | runtime | **secret** | random values |
| `PUBLIC_URL` | `cms/.env` | runtime | – | `https://<cms-domain>` |
| `IS_PROXIED` | `cms/.env` | runtime | – | `true` behind nginx |
| `CORS_ORIGINS` | `cms/.env` | runtime | – | `https://<web-domain>,https://<cms-domain>` |
| `STRAPI_SEED` | `cms/.env` | runtime | – | `false`; production never seeds regardless |
| `DATABASE_CLIENT`, `DATABASE_FILENAME` | `cms/.env` | runtime | – | `sqlite`, `.tmp/data.db` (relative!) |
| `FLAG_NPS`, `FLAG_PROMOTE_EE`, `FLAG_DOC_LINKS` | `cms/.env` | runtime | – | `false`, `false`, `true` |

Strapi refuses to start in production if a required secret is empty or still contains `REPLACE_ME`.
`next build` refuses to build if a required `NEXT_PUBLIC_*` value is missing.

---

## 3. Generating secrets (run these yourself, on a trusted machine)

Nothing in the repo contains real secrets. Generate each value independently:

```bash
openssl rand -hex 32        # run once per secret: ADMIN_JWT_SECRET, API_TOKEN_SALT, TRANSFER_TOKEN_SALT,
                            #   ENCRYPTION_KEY, JWT_SECRET, ADMIN_SESSION_SECRET   (64 hex chars each)

# APP_KEYS — four values, comma-separated, no spaces:
echo "$(openssl rand -hex 16),$(openssl rand -hex 16),$(openssl rand -hex 16),$(openssl rand -hex 16)"

# ADMIN_PANEL_PASSWORD — a long random passphrase, stored in your password manager:
openssl rand -base64 24
```

`STRAPI_API_TOKEN` is not generated by you; Strapi creates it (§10).

---

## 4. Building the images (off the VPS)

On your machine or in CI, from the repository root. `next build` downloads Google Fonts, so it needs internet.
On Apple Silicon add `--platform linux/amd64` (the VPS is x86-64).

```bash
export IMAGE_TAG=2026-11-12-1        # a new tag per release

docker build -t intimate-sabbatical-cms:$IMAGE_TAG ./cms

docker build -t intimate-sabbatical-web:$IMAGE_TAG \
  --build-arg NEXT_PUBLIC_CMS_PUBLIC_URL=https://<cms-domain> \
  --build-arg NEXT_PUBLIC_WEB_URL=https://<web-domain> \
  --build-arg NEXT_PUBLIC_CONTACT_EMAIL=<contact-email> \
  .
```

Only if you use the Fullscript dispensary link, also add `--build-arg NEXT_PUBLIC_FULLSCRIPT_URL=<url>`; leave it out otherwise.

The web image bakes in the **public** URLs, so the real subdomain *names* must be decided before this step
(DNS can come later). A different domain means a rebuild. No secret is passed to either build.

---

## 5. Getting the images onto the VPS (without building there)

**Option A — file transfer (no registry needed):**

```bash
docker save intimate-sabbatical-web:$IMAGE_TAG intimate-sabbatical-cms:$IMAGE_TAG | gzip > isabbatical-$IMAGE_TAG.tar.gz
scp isabbatical-$IMAGE_TAG.tar.gz <user>@<vps>:/tmp/
# on the VPS:
gunzip -c /tmp/isabbatical-$IMAGE_TAG.tar.gz | docker load      # only adds these two images
```

**Option B — a private registry:** retag (`docker tag ... <registry>/...`), `docker push`, then on the VPS
`docker pull` and `docker tag` back to `intimate-sabbatical-{web,cms}:$IMAGE_TAG` (the compose file uses those names).

Copy only these files to the VPS, into a dedicated project directory (for example `/opt/intimate-sabbatical`, any path is
fine): `docker-compose.yml`, `.env.example`, `cms/.env.example` (into a `cms/` subfolder), and the `deploy/` folder
(`backup.sh` and the nginx templates). Then create `.env` and `cms/.env` there from the two templates (§2) — do not copy
your local env files.

Before running anything from `deploy/`, make sure the scripts have Unix (LF) line endings — files copied from a Windows
working tree can carry CRLF, which breaks `backup.sh` ("bad interpreter: /bin/bash^M"):

```bash
grep -c $'\r' deploy/backup.sh                # must print 0
sed -i 's/\r$//' deploy/backup.sh deploy/nginx/*.template docker-compose.yml     # only if it printed a number > 0
```

(Git fixes this automatically via `.gitattributes` when the repository is cloned; it only matters for direct copies.)

---

## 6. Persistent directories (on the VPS)

```bash
sudo mkdir -p /srv/appdata/intimate-sabbatical/{database,cms-uploads,backups}
sudo chown -R 1000:1000 /srv/appdata/intimate-sabbatical/{database,cms-uploads,backups}   # uid of the container's "node" user
sudo chmod 750 /srv/appdata/intimate-sabbatical/{database,cms-uploads,backups}
```

| Host directory | Container path | Content |
|---|---|---|
| `database/` | `/opt/app/.tmp` | SQLite file `data.db` — **must persist** |
| `cms-uploads/` | `/opt/app/public/uploads` | uploaded images/videos — **must persist** |
| `backups/` | `/backups` | archives written by `deploy/backup.sh` |

If these directories are not pre-created with that ownership, Docker creates them as root and Strapi cannot write.

---

## 7. Check ports before deploying (read-only commands)

`4300` / `4301` are only *candidates*. Confirm both are free, and that nothing else uses the names this project uses:

```bash
docker compose version                           # Compose v2 plugin is required
sudo nginx -T 2>/dev/null | grep -nE 'include .*(conf\.d|sites-enabled)'   # confirms conf.d/*.conf and sites-enabled/* are loaded
ss -ltnH 'sport = :4300'                         # no output  => free
ss -ltnH 'sport = :4301'
docker ps --format 'table {{.Names}}\t{{.Ports}}'          # ports published by running containers
sudo nginx -T 2>/dev/null | grep -nE 'server_name|listen|proxy_pass|upstream'   # what nginx already claims
docker compose ls                                # no existing "intimate-sabbatical" project
docker network ls | grep intimate-sabbatical     # should print nothing yet
df -h /srv && free -m                            # headroom
```

Pick two free ports, set `WEB_HOST_PORT` / `CMS_HOST_PORT` in `.env`, and make the `upstream` blocks in
`deploy/nginx/web.conf.template` and `cms.conf.template` match.

---

## 8. Start only the CMS

```bash
cd /opt/intimate-sabbatical        # your project directory
docker compose -p intimate-sabbatical config --quiet        # validates the files, prints nothing if OK
docker compose -p intimate-sabbatical up -d --no-build --pull never cms   # starts ONLY cms (and the project network)
docker compose -p intimate-sabbatical ps
docker compose -p intimate-sabbatical logs --tail 100 cms
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4301/_health      # expect 204 (use your CMS_HOST_PORT)
```

`--no-build --pull never` is used on every `up` in this guide: Compose then only starts the images you loaded in §5 and can
never start a build (or a registry pull) on the shared server, even if an image or tag is missing — it just fails with a clear error.

In the logs you should see `[seed] Skipped ...` and `[permissions] Public read permissions initialised`.
**No sample content is created.** The CMS is bound to `127.0.0.1` only — nothing is public yet.

---

## 9. Create the first Strapi administrator (SSH tunnel, before exposing the CMS)

Until the first administrator exists, whoever opens `/admin` first can claim it — so do this before any DNS or
nginx vhost points at the CMS.

Strapi derives the admin panel's backend address from `PUBLIC_URL`, so a mismatch between that URL and the address you
browse to can break the panel. For this one step point it at the tunnel:

1. In `cms/.env` temporarily set `PUBLIC_URL=http://localhost:4301`, `IS_PROXIED=false`,
   `CORS_ORIGINS=http://localhost:4301`.
2. `docker compose -p intimate-sabbatical up -d --no-build --pull never cms` (recreates the container with the new env).
3. From your own computer: `ssh -L 4301:127.0.0.1:<CMS_HOST_PORT> <user>@<vps>` and keep it open.
4. Browse to `http://localhost:4301/admin`, create the administrator with a strong, unique password.
5. Stop the tunnel (Ctrl-C), then restore the production values in `cms/.env`
   (`PUBLIC_URL=https://<cms-domain>`, `IS_PROXIED=true`, `CORS_ORIGINS=https://<web-domain>,https://<cms-domain>`)
   and run `docker compose -p intimate-sabbatical up -d --no-build --pull never cms` again.

Also confirm sign-ups are off: *Settings → Users & Permissions → Advanced settings → Enable sign-ups = off*
(the app switches it off at startup; this is just a check).

---

## 10. Create a restricted Strapi API token

*(Do this through the tunnel from step 9, or after the CMS vhost is live.)* *Settings → API Tokens → Create new API Token*:

- **Name:** `web-admin-panel`
- **Token type:** **Custom** (not "Full access")
- **Duration:** 90 days (or unlimited if you accept a manual rotation) — put the expiry in your calendar
- **Permissions:**

| Section | Single types: `home-page`, `about-page`, `educational-consults-page`, `group-sessions-page`, `speaking-retreats-page`, `site-setting` | Collection types: `blog-post`, `product`, `booking-service`, `menu-item`, `dynamic-page` |
|---|---|---|
| Actions | `find`, `update`, `delete` | `find`, `findOne`, `create`, `update`, `delete` |

  plus **Upload → `upload`** and **`find`**, and **Publish → `publish`** (the custom route behind "Publish Live").

Copy the token once (Strapi shows it only at creation) into `.env` as `STRAPI_API_TOKEN`.

---

## 11. Start the frontend

```bash
# .env must now contain: STRAPI_API_TOKEN, ADMIN_PANEL_PASSWORD, ADMIN_SESSION_SECRET
docker compose -p intimate-sabbatical up -d --no-build --pull never web
docker compose -p intimate-sabbatical ps                                  # both "healthy"
curl -s http://127.0.0.1:4300/api/health                                  # {"status":"ok"}
```

The site is still reachable only on `127.0.0.1`. Optionally test through a second SSH tunnel to the web port.

---

## 12. nginx virtual hosts (new files only)

The templates are in `deploy/nginx/`. **They are templates — copy and fill them; never edit an existing site.**

1. **Rate-limit zones** (http context, new file):
   ```bash
   sudo test ! -e /etc/nginx/conf.d/intimate-sabbatical-ratelimit.conf \
     && sudo cp deploy/nginx/ratelimit.conf.template /etc/nginx/conf.d/intimate-sabbatical-ratelimit.conf
   ```
2. **Port-80 block** (ACME + redirect) — replace both domain placeholders:
   ```bash
   sudo mkdir -p /var/www/intimate-sabbatical-acme
   sed -e 's/WEB_DOMAIN_REPLACE_ME/<web-domain>/g' -e 's/CMS_DOMAIN_REPLACE_ME/<cms-domain>/g' \
       deploy/nginx/http-redirect.conf.template \
     | sudo tee /etc/nginx/sites-available/intimate-sabbatical-http.conf >/dev/null
   sudo ln -s /etc/nginx/sites-available/intimate-sabbatical-http.conf /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx          # reload only — never restart
   ```
3. Issue certificates (§13), then install the HTTPS vhosts:
   ```bash
   sed -e 's/WEB_DOMAIN_REPLACE_ME/<web-domain>/g' -e 's/127.0.0.1:4300/127.0.0.1:<WEB_HOST_PORT>/' \
       deploy/nginx/web.conf.template \
     | sudo tee /etc/nginx/sites-available/intimate-sabbatical-web.conf >/dev/null
   sed -e 's/CMS_DOMAIN_REPLACE_ME/<cms-domain>/g' -e 's/127.0.0.1:4301/127.0.0.1:<CMS_HOST_PORT>/' \
       deploy/nginx/cms.conf.template \
     | sudo tee /etc/nginx/sites-available/intimate-sabbatical-cms.conf >/dev/null
   sudo ln -s /etc/nginx/sites-available/intimate-sabbatical-web.conf /etc/nginx/sites-enabled/
   sudo ln -s /etc/nginx/sites-available/intimate-sabbatical-cms.conf /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   ```
   If `nginx -t` fails, nothing has been reloaded — fix the file and retry. The templates intentionally use
   `listen 443 ssl;` **without** `http2`: on nginx 1.24 (Ubuntu 24.04) that flag belongs to the shared listen socket, so
   setting it here would silently change every other site on port 443.

What the templates do: forward `Host`, `X-Forwarded-Host`, `X-Forwarded-Proto` and overwrite the client-IP headers
(the app's login lockout trusts them); allow 20 MB bodies; rate-limit both login endpoints; **return 404 for `/api/`
on the CMS host** (the site reaches Strapi over the private network) while keeping `/uploads/` public and the Strapi
admin panel working; send HSTS (without `includeSubDomains`, since this server hosts other projects).

**Upload limits.** nginx (20 MB), Next.js Server Actions (20 MB) and Strapi (20 MB per file) are aligned. The Next.js and
nginx limits apply to the *whole request*, so one admin form save with several images counts them together, and
multipart overhead counts too. Keep each file comfortably below 20 MB and save large images one at a time. For long
videos, prefer a YouTube/Vimeo link over an upload.

---

## 13. DNS and SSL

1. Create `A` (and `AAAA` if the VPS has IPv6) records for `<web-domain>` and `<cms-domain>` pointing to the VPS.
   Wait for propagation: `dig +short <web-domain>` / `dig +short <cms-domain>`.
2. Install the port-80 block (step 2 above). Then issue **one certificate per domain** (the templates expect
   `/etc/letsencrypt/live/<domain>/`). Dry-run first to avoid rate limits:
   ```bash
   sudo certbot certonly --webroot -w /var/www/intimate-sabbatical-acme -d <web-domain> --cert-name <web-domain> --dry-run
   sudo certbot certonly --webroot -w /var/www/intimate-sabbatical-acme -d <cms-domain> --cert-name <cms-domain> --dry-run
   # then the same commands without --dry-run
   ```
   Use `certonly` (not `--nginx`, which edits vhosts). Never use `--force-renewal`. Renewal runs from certbot's
   existing timer; make sure its deploy hook only *reloads* nginx (`systemctl reload nginx`).
3. Install the HTTPS vhosts (step 3 above).

**Image optimisation note:** the web container downloads CMS images through `https://<cms-domain>/uploads/...`
(the public URL — Next.js blocks private/loopback hosts in production). The VPS must therefore be able to reach its own public
hostnames from inside a container. This normally works; if image requests fail with timeouts, add an
`extra_hosts: ["<cms-domain>:host-gateway"]` entry under the `web` service.

---

## 14. Verify

- `https://<web-domain>` renders; CMS images load (no broken images).
- `https://<web-domain>/blog/does-not-exist` → **404**, not a sample post.
- `https://<cms-domain>/api/home-page` → **404** (blocked); `https://<cms-domain>/admin` → Strapi login.
- `https://<web-domain>/admin` → redirects to `/admin/login`; sign in, edit a page, upload an image, **Publish Live**.
- `https://<web-domain>/robots.txt` disallows `/admin` and `/api/`.
- `docker compose -p intimate-sabbatical ps` → both services `healthy`.

---

## 15. Backups and restore

```bash
# manual backup (run as a user that can use docker and read the data dir, e.g. via sudo)
sudo bash deploy/backup.sh
```

Each run produces `backups/intimate-sabbatical-backup-<UTC>.tar.gz` (+ `.sha256`) containing a **consistent**
SQLite copy (`data.db`, made with SQLite's online backup API, integrity-checked) and the whole `cms-uploads/` folder,
and deletes archives older than 14 days (`RETENTION_DAYS`). It only talks to containers of the
`intimate-sabbatical` project.

**Schedule it** (example — install it yourself; the repo installs nothing):

```
15 3 * * *  /bin/bash /opt/intimate-sabbatical/deploy/backup.sh >> /var/log/intimate-sabbatical-backup.log 2>&1
```

Copy archives off the server too (a backup on the same disk is not a backup).

**Restore** (stops only the CMS; meanwhile fixed pages show their built-in copy and CMS-backed lists such as the
blog and shop show an explicit "temporarily unavailable" notice):

```bash
DATA=/srv/appdata/intimate-sabbatical               # = APP_DATA_DIR
TS=<UTC timestamp in the archive name, e.g. 20261112T031500Z>

# 1) verify and unpack the archive (archives live in $DATA/backups and are root-only, hence sudo)
cd "$DATA/backups"
sudo sha256sum -c "intimate-sabbatical-backup-$TS.tar.gz.sha256"      # must end in: ...tar.gz: OK
RESTORE_DIR="$(mktemp -d)"
sudo tar -xzf "intimate-sabbatical-backup-$TS.tar.gz" -C "$RESTORE_DIR"   # -> data.db and cms-uploads/

# 2) swap the data in (only the cms container is stopped)
cd /opt/intimate-sabbatical                                              # your project directory
docker compose -p intimate-sabbatical stop cms
sudo cp "$DATA/database/data.db" "$DATA/backups/pre-restore-data.db"    # safety copy of the CURRENT database
sudo rm -f "$DATA/database/data.db-wal" "$DATA/database/data.db-shm"
sudo cp "$RESTORE_DIR/data.db" "$DATA/database/data.db"
sudo rsync -a --delete "$RESTORE_DIR/cms-uploads/" "$DATA/cms-uploads/"  # needs rsync (sudo apt-get install rsync if missing)
sudo chown -R 1000:1000 "$DATA/database" "$DATA/cms-uploads"

# 3) start the CMS again and clean up
docker compose -p intimate-sabbatical start cms
sudo rm -rf "${RESTORE_DIR:?}"
```

Check the site and the Strapi admin, and keep `pre-restore-data.db` until you are sure the restore is right.

---

## 16. Day-to-day: restart, update, roll back (project-scoped only)

```bash
docker compose -p intimate-sabbatical ps
docker compose -p intimate-sabbatical logs --tail 100 -f web        # Ctrl-C stops following the logs only
docker compose -p intimate-sabbatical restart web                   # or: cms
```

**Release a new version** — build off-server with a new tag (§4), load it (§5), then:

```bash
sudo bash deploy/backup.sh                                          # always back up first
# edit .env:  IMAGE_TAG=<new tag>
docker compose -p intimate-sabbatical up -d --no-build --pull never --no-deps cms   # SQLite = single writer: one cms at a time, brief gap
docker compose -p intimate-sabbatical up -d --no-build --pull never --no-deps web
```

**Roll back:** set `IMAGE_TAG` back to the previous tag in `.env` and run the same two `up -d ... --no-deps` commands
(the previous images are still on the host). If the data changed incompatibly, restore the pre-release backup (§15).

**Stop this project only:** `docker compose -p intimate-sabbatical down` (removes only this project's containers and
network; the data directories are untouched). Add nothing else — no `-v`, no prune.

---

## 17. Security notes worth knowing

- Admin sessions are HMAC-signed with a random ID and a 12-hour server-validated expiry; sign-out revokes the
  session; five failed passwords from one IP within 15 minutes lock that IP out (in-memory, single replica).
  Changing `ADMIN_PANEL_PASSWORD` or `ADMIN_SESSION_SECRET` signs everyone out.
- Every admin Server Action, loader, page and route handler re-checks the session; `proxy.ts` is only a redirect.
- The admin can no longer make the server fetch a URL (remote-URL upload was removed). Video links must be
  YouTube/Vimeo, or an uploaded video.
- Rotate `STRAPI_API_TOKEN` before it expires: create a new token, update `.env`,
  `docker compose -p intimate-sabbatical up -d --no-build --pull never --no-deps web`, then delete the old token.
- Keep exactly **one** `cms` replica (SQLite) and exactly one `web` replica (in-memory login lockout).
