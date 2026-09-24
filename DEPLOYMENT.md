# PRMS Full-Stack Deployment Guide

**Stack:** Spring Boot backend → Railway | Keycloak → Railway | PostgreSQL → Supabase | Next.js frontend → Vercel

---

## Prerequisites

| Tool | Purpose | Install |
|------|---------|---------|
| `railway` CLI | Deploy & manage Railway services | `npm i -g @railway/cli` |
| `vercel` CLI | Deploy frontend | `npm i -g vercel` |
| Git | Version control | already installed |

Make sure your repo is pushed to GitHub — both Railway and Vercel connect via GitHub.

```bash
git add -A
git commit -m "chore: add deployment configs"
git push origin main
```

---

## PHASE 1 — Supabase (PostgreSQL)

> ~5 minutes. You get two databases: one for the app, one for Keycloak.

### 1.1 Create PRMS database

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Name it `prms-db`, choose a region close to your users, set a strong password → **Create project**
3. Once ready: **Settings → Database → Connection string**
4. Copy the **Transaction pooler** URI (port `6543`) — looks like:
   ```
   postgresql://postgres:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
5. Note down these values (you'll need them for Railway):
   - `POSTGRES_HOST` = the host part (e.g. `aws-0-us-east-1.pooler.supabase.com`)
   - `POSTGRES_PORT` = `6543`
   - `POSTGRES_DB`   = `postgres`
   - `POSTGRES_USER` = `postgres`
   - `POSTGRES_PASSWORD` = your project password

### 1.2 Create Keycloak database

1. Create a **second** Supabase project named `prms-keycloak-db`
2. Repeat the steps above — note the same 5 values for the Keycloak service

> **Why two projects?** Free tier gives one database per project; Keycloak needs its own schema.
> Alternatively, use a single project and create a `keycloak` schema, but separate projects are simpler.

---

## PHASE 2 — Railway: Keycloak

> Deploy Keycloak first because the backend needs its URL.

### 2.1 Create Railway project

1. Go to [railway.app](https://railway.app) → **New Project → Empty project**
2. Name it `prms`

### 2.2 Add Keycloak service

1. Inside the project → **New Service → Docker Image**
2. Image: `quay.io/keycloak/keycloak:24.0.4`
3. Go to service **Settings → Networking** → **Generate Domain** — note this URL:
   ```
   YOUR_KEYCLOAK_RAILWAY_DOMAIN = prms-keycloak-xxxx.up.railway.app
   ```

### 2.3 Set Keycloak environment variables

In the service → **Variables** tab, add everything from `keycloak/.env.railway`, replacing placeholders:

```
KEYCLOAK_ADMIN              = admin
KEYCLOAK_ADMIN_PASSWORD     = <strong password>
KC_DB                       = postgres
KC_DB_URL                   = jdbc:postgresql://<SUPABASE_KC_HOST>:5432/postgres
KC_DB_USERNAME              = postgres
KC_DB_PASSWORD              = <supabase keycloak project password>
KC_HOSTNAME                 = <your railway domain WITHOUT https://>
KC_HOSTNAME_STRICT          = false
KC_HOSTNAME_STRICT_HTTPS    = false
KC_HTTP_ENABLED             = true
KC_HTTP_PORT                = 8080
KC_PROXY                    = edge
```

Also set the **Start Command** in Settings → Deploy:
```
start-dev --import-realm
```

### 2.4 Mount the realm file

Railway doesn't support volume mounts from your repo directly for Docker image services.
**Two options:**

**Option A (recommended for demo/dev)** — Import realm via Admin UI after first boot:
1. Skip the `--import-realm` flag for now (remove it from start command)
2. Wait for Keycloak to boot → open `https://YOUR_KEYCLOAK_RAILWAY_DOMAIN`
3. Log in with `KEYCLOAK_ADMIN` / `KEYCLOAK_ADMIN_PASSWORD`
4. Go to **Realm → Import** → upload `keycloak/realms/prms-realm.json`
5. Done — realm, roles, clients, and seed users are all imported.

**Option B** — Build a custom Keycloak image that bakes in the realm:
```dockerfile
# keycloak/Dockerfile
FROM quay.io/keycloak/keycloak:24.0.4
COPY realms/prms-realm.json /opt/keycloak/data/import/prms-realm.json
```
Then use **New Service → GitHub Repo**, point root directory to `keycloak/`, and set start command to `start-dev --import-realm`.

### 2.5 Update realm redirect URIs

Once Keycloak is running, open Admin UI → **Realm prms → Clients → prms-frontend**:
- Add to **Valid redirect URIs**: `https://YOUR_VERCEL_DOMAIN/*`
- Add to **Web origins**: `https://YOUR_VERCEL_DOMAIN`

Do the same for `prms-swagger` pointing to your backend Railway domain.

---

## PHASE 3 — Railway: Backend (Spring Boot)

### 3.1 Add backend service

1. In the same Railway project → **New Service → GitHub Repo**
2. Select your repo, set **Root Directory** to `backend`
3. Railway detects the `Dockerfile` automatically and uses `railway.toml` for health check config

### 3.2 Set backend environment variables

In the service → **Variables** tab, add everything from `backend/.env.railway`:

```
POSTGRES_HOST        = <supabase prms-db host>
POSTGRES_PORT        = 6543
POSTGRES_DB          = postgres
POSTGRES_USER        = postgres
POSTGRES_PASSWORD    = <supabase prms-db password>
POSTGRES_SSL_MODE    = require

JWT_ISSUER_URI       = https://YOUR_KEYCLOAK_RAILWAY_DOMAIN/realms/prms

CORS_ALLOWED_ORIGINS = https://YOUR_VERCEL_DOMAIN

JPA_DDL_AUTO         = update
FLYWAY_ENABLED       = false

LOG_LEVEL            = INFO
APP_LOG_LEVEL        = INFO
```

> **Redis & RabbitMQ:** If you don't need caching or async messaging for your demo,
> add these two env vars to disable auto-configuration at startup:
> ```
> SPRING_AUTOCONFIGURE_EXCLUDE=org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration,org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration
> ```
> Or add a **Redis** add-on inside Railway (1-click) and a free **CloudAMQP** account.

### 3.3 Generate backend domain

Settings → Networking → **Generate Domain**. Note it:
```
YOUR_BACKEND_RAILWAY_DOMAIN = prms-backend-xxxx.up.railway.app
```

### 3.4 Watch the deploy logs

Railway → service → **Deployments → View Logs**

A successful start shows:
```
Started PrmsApplication in XX.XXX seconds
```

Health check: `https://YOUR_BACKEND_RAILWAY_DOMAIN/actuator/health` → `{"status":"UP"}`

---

## PHASE 4 — Vercel: Frontend (Next.js)

### 4.1 Update vercel.json

Open `prms-frontend/vercel.json` and replace the placeholder in the rewrite rule:
```json
"destination": "https://YOUR_BACKEND_RAILWAY_DOMAIN/api/v1/:path*"
```

Commit and push this change.

### 4.2 Deploy to Vercel

```bash
cd prms-frontend
vercel
```

Follow the prompts:
- Link to existing project or create new → name it `prms-frontend`
- Framework: **Next.js** (auto-detected)
- Root directory: `./` (you're already inside `prms-frontend`)

### 4.3 Set environment variables

Either via the CLI or the Vercel dashboard (**Project → Settings → Environment Variables**):

```
NEXT_PUBLIC_API_BASE_URL      = https://YOUR_BACKEND_RAILWAY_DOMAIN/api/v1
NEXT_PUBLIC_KEYCLOAK_URL      = https://YOUR_KEYCLOAK_RAILWAY_DOMAIN
NEXT_PUBLIC_KEYCLOAK_REALM    = prms
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID = prms-frontend
```

Set environment to **Production** (and **Preview** if you want branch deploys to work too).

### 4.4 Redeploy to pick up env vars

```bash
vercel --prod
```

Or in the dashboard: **Deployments → Redeploy**.

Note your Vercel domain:
```
YOUR_VERCEL_DOMAIN = prms-frontend-xxxx.vercel.app
```

---

## PHASE 5 — Wire everything together

Now that all three platforms are deployed, go back and fill in the remaining placeholders.

### 5.1 Update Keycloak realm (if using Option A import)

Admin UI → **prms → Clients → prms-frontend → Settings**:
- Valid redirect URIs: add `https://YOUR_VERCEL_DOMAIN/*`
- Web origins: add `https://YOUR_VERCEL_DOMAIN`

### 5.2 Update backend CORS

Railway → backend service → Variables:
```
CORS_ALLOWED_ORIGINS = https://YOUR_VERCEL_DOMAIN
```
Click **Deploy** to restart.

### 5.3 Update JWT issuer check

If Keycloak is behind Railway's proxy, the token issuer claim will be the Railway domain.
Make sure `JWT_ISSUER_URI` exactly matches what Keycloak puts in the `iss` claim.
You can verify this by decoding a token at [jwt.io](https://jwt.io) after logging in.

---

## PHASE 6 — Smoke test

| Check | URL | Expected |
|-------|-----|---------|
| Keycloak health | `https://YOUR_KEYCLOAK_RAILWAY_DOMAIN/realms/prms/.well-known/openid-configuration` | JSON with endpoints |
| Backend health | `https://YOUR_BACKEND_RAILWAY_DOMAIN/actuator/health` | `{"status":"UP"}` |
| Swagger UI | `https://YOUR_BACKEND_RAILWAY_DOMAIN/swagger-ui.html` | Swagger page loads |
| Frontend | `https://YOUR_VERCEL_DOMAIN` | Login page loads |
| Login | Username `procurement_admin` / `admin123` | Dashboard visible |

---

## Quick reference — all placeholder values

Once deployed, fill in this table and keep it somewhere safe:

| Placeholder | Real value |
|-------------|-----------|
| `YOUR_SUPABASE_HOST` | _(from Supabase → Settings → Database)_ |
| `YOUR_SUPABASE_DB_PASSWORD` | _(set during Supabase project creation)_ |
| `YOUR_KC_POSTGRES_HOST` | _(from Supabase keycloak project)_ |
| `YOUR_KC_DB_PASSWORD` | _(set during Supabase keycloak project creation)_ |
| `YOUR_KEYCLOAK_RAILWAY_DOMAIN` | _(Railway → Keycloak service → Networking)_ |
| `YOUR_BACKEND_RAILWAY_DOMAIN` | _(Railway → backend service → Networking)_ |
| `YOUR_VERCEL_DOMAIN` | _(Vercel → Project → Domains)_ |

---

## Common issues

**`PKIX path building failed` on backend startup**
Supabase uses a certificate signed by a well-known CA — this usually resolves itself.
If it persists, set `POSTGRES_SSL_MODE=disable` temporarily to confirm it's SSL-related,
then add the Supabase CA cert to the JRE truststore.

**Keycloak `Invalid parameter: redirect_uri`**
The Vercel domain is not in the client's redirect URIs. Fix in Keycloak Admin UI → clients → prms-frontend.

**`401 Unauthorized` on API calls**
The `iss` claim in the JWT doesn't match `JWT_ISSUER_URI`. Decode the token at jwt.io,
copy the exact `iss` value, and set that as `JWT_ISSUER_URI` in Railway.

**Backend fails to start — RabbitMQ/Redis connection refused**
Add `SPRING_AUTOCONFIGURE_EXCLUDE` (see Phase 3.2) if you're not using those services.

**Vercel build fails — `NEXT_PUBLIC_*` vars missing**
Environment variables must be set *before* the build runs. Set them in the Vercel dashboard
under Settings → Environment Variables, then trigger a fresh deploy.
