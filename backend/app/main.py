"""FastAPI application factory."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import create_all
from app.routers import auth, items


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup so the template works without running Alembic.
    # In real projects you'd rely on Alembic migrations instead.
    await create_all()
    yield


def create_app() -> FastAPI:
    app = FastAPI(title="Hackathon API", lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_origin_regex=settings.CORS_ORIGIN_REGEX,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth.router)
    app.include_router(items.router)

    @app.get("/health", tags=["health"])
    async def health():
        return {"status": "ok"}

    return app


app = create_app()
