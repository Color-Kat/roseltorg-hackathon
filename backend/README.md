# Hackathon Backend

A clean, minimal FastAPI + async SQLAlchemy 2.0 + Postgres template, built to be
extended fast during a hackathon. Ships with JWT auth and a demo CRUD resource.

## Stack
- **FastAPI** with a `create_app()` factory and lifespan startup
- **SQLAlchemy 2.0** async (`asyncpg`)
- **Postgres**
- **Alembic** for migrations (ready, but tables are also auto-created on startup)
- **JWT auth** (python-jose) + **bcrypt** password hashing (passlib)

## Run locally (no docker)
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Start Postgres (e.g. the dockerized db exposed on host port 5433):
docker compose up -d db        # from the project root

python main.py                 # serves on http://localhost:8080
```
The app reaches Postgres using the defaults `DB_HOST=localhost`, `DB_PORT=5433`
(the host-exposed port of the dockerized db). Override any setting via env vars.

Open **http://localhost:8080/docs** for interactive Swagger UI.

## Run in docker
- **Dev** (hot reload via volume mount + `NODE_ENV=development`):
  ```bash
  docker compose up backend
  ```
  Inside compose, Postgres is reached via `DB_HOST=db`, `DB_PORT=5432`.
- **Prod**: build with `Dockerfile.prod` (`NODE_ENV=production`, reload off).

## Configuration
All settings live in `app/config.py` (`pydantic-settings`). They read from
environment variables and have sensible defaults, so the app runs out of the box.
Key vars: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`,
`JWT_SECRET`, `BACKEND_PORT`, `CORS_ORIGINS`, optional `DATABASE_URL` override.

## Endpoints
- `GET /health` -> `{"status": "ok"}`
- **Auth** (`/auth`)
  - `POST /auth/register` `{email, password}` -> `201` `{access_token, token_type, user}`
  - `POST /auth/login` `{email, password}` -> `{access_token, token_type, user}`
  - `GET /auth/me` (Bearer token) -> `{id, email, created_at}`
- **Items** (`/items`, open CRUD demo, no auth)
  - `GET /items`, `POST /items`, `GET /items/{id}`, `PUT /items/{id}`, `DELETE /items/{id}`

## Where to add things
- **Models**: add a file under `app/models/` and import it in `app/models/__init__.py`
  (so Alembic autogenerate and `create_all` see it).
- **Schemas**: add Pydantic models under `app/schemas/`.
- **Routers**: add a router under `app/routers/` and `include_router` it in `app/main.py`.

## Alembic migrations
Tables auto-create on startup, but for real schema management use Alembic:
```bash
alembic revision --autogenerate -m "your message"
alembic upgrade head
```
The DB URL is injected from `app/config.py` in `alembic/env.py` — no need to edit
`alembic.ini`.
