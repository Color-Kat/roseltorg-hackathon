"""Application settings, loaded from environment variables.

All fields have sensible defaults so the app runs out of the box.
The shared project-root `.env` contains many unrelated keys, so
`extra="ignore"` is essential to avoid validation errors.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # --- Database ---
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "postgres"
    DB_NAME: str = "app"
    # localhost so a locally-run backend reaches the dockerized Postgres
    # exposed on the host; docker-compose overrides this with DB_HOST=db.
    DB_HOST: str = "localhost"
    # 5433 = host-exposed port of the dockerized db; compose overrides to 5432.
    DB_PORT: int = 5433
    # Optional explicit override; if set & non-empty it wins over computed url.
    DATABASE_URL: str | None = None

    # --- Auth / JWT ---
    JWT_SECRET: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days

    # --- Server ---
    BACKEND_PORT: int = 8080

    # --- CORS ---
    CORS_ORIGINS: list[str] = ["http://localhost:8000", "http://localhost:3000"]
    # Regex of allowed origins; reflected back so credentials work. Defaults to
    # any localhost/127.0.0.1/LAN-IP host (handy for WSL & phone PWA testing).
    CORS_ORIGIN_REGEX: str = (
        r"https?://(localhost|127\.0\.0\.1|(\d{1,3}\.){3}\d{1,3})(:\d+)?"
    )

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def database_url(self) -> str:
        """Async SQLAlchemy connection string."""
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return (
            f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )


settings = Settings()
