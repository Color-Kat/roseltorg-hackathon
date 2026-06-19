# Hackathon Template

A ready-to-hack full-stack starter. Clone, `docker compose up`, start building.

**Frontend:** Next.js (App Router) · React · TypeScript · MobX · React Query · Tailwind CSS + SCSS · HeroUI
**Backend:** FastAPI · async SQLAlchemy 2.0 · PostgreSQL · Alembic · JWT auth

| Service       | URL                            |
|---------------|--------------------------------|
| Frontend      | http://localhost:8000          |
| Backend API   | http://localhost:8080          |
| API docs      | http://localhost:8080/docs     |
| Postgres      | localhost:5433 (user/pass/db: `postgres` / `postgres` / `app`) |

---

## Quick start (Docker — recommended)

Everything runs with one command, with hot reload for both frontend and backend.

```bash
cp .env.example .env          # first time only
docker compose up --build
```

Open http://localhost:8000. Edit files under `frontend/` or `backend/` and changes
reload automatically.

Production build:

```bash
docker compose -f docker-compose.prod.yml up --build
```

---

## Running locally (without Docker)

You still need a Postgres database. The easiest way is to run just the DB in Docker:

```bash
docker compose up db
```

**Backend** (Python 3.12+):

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python main.py                # http://localhost:8080  (auto-reload in dev)
```

By default the backend connects to `localhost:5433` (the dockerized Postgres above).
Override any setting via environment variables — see `backend/app/config.py`.

**Frontend** (Node 20+):

```bash
cd frontend
npm install
npm run dev                   # http://localhost:8000
```

The frontend reads `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8080`).
For a custom value, create `frontend/.env.local`.

---

## Project layout

```
backend/        FastAPI app
  app/
    main.py       create_app(), CORS, routers, startup table creation
    config.py     settings from env (pydantic-settings)
    database.py   async engine + session + Base
    models/       SQLAlchemy models (user, item)
    schemas/      Pydantic schemas
    routers/      auth, items   ← add your endpoints here
    core/         security (JWT, hashing), deps (get_current_user)
  alembic/        migrations
  main.py         entry point (python main.py)

frontend/       Next.js app (Feature-Sliced Design)
  app/            App Router pages (/, /auth/login, /auth/register)
  src/
    app/          providers, global styles (scss), types
    pagez/        page-level UI (home, auth)   ← "pages" is reserved by Next
    entities/     auth, user, item   ← domain models + api + react-query hooks
    features/     (empty — add user actions here)
    widgets/      (empty — add composite UI blocks here)
    shared/       api client, ui kit, lib helpers, consts
```

The frontend follows [Feature-Sliced Design](https://feature-sliced.design/). The
`@/*` import alias maps to `frontend/src/*`.

---

## What's included

- **Auth** — email/password registration & login with JWT. Backend issues a bearer
  token; the frontend stores it (MobX `AuthStore`, persisted to `localStorage`) and
  attaches it to every request. `AuthGuard` protects routes; `/auth/me` restores the
  session on reload.
- **Items CRUD** — an example resource (`/items`) demonstrating the full path:
  SQLAlchemy model → Pydantic schema → FastAPI router → axios → React Query hooks →
  UI. The home page is a live demo of it. Copy this pattern for your own resources.
- **Database** — async SQLAlchemy + Postgres. Tables are auto-created on startup, so
  it works immediately. For real migrations use Alembic:
  ```bash
  cd backend
  alembic revision --autogenerate -m "your change"
  alembic upgrade head
  ```

---

## Monitoring (optional)

A Grafana / Loki / Promtail / Prometheus stack lives in `monitoring/` and is gated
behind a compose profile, so it does **not** start by default:

```bash
docker compose --profile monitoring up
```

Grafana: http://localhost:9000 (login from `GRAFANA_LOGIN` / `GRAFANA_PASSWORD`).

---

## Environment variables

All config lives in `.env` (copied from `.env.example`). See the comments there.
The most relevant: `WEB_PORT`, `BACKEND_PORT`, `DB_*`, `JWT_SECRET`,
`NEXT_PUBLIC_API_URL`.

## Troubleshooting

See [troubleshooting.md](./troubleshooting.md).
