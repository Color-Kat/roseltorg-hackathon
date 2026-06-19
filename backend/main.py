"""Entry point: `python main.py` runs the API with uvicorn.

Reload is enabled in development (NODE_ENV != "production").
"""

import os

import uvicorn

from app.config import settings

if __name__ == "__main__":
    node_env = os.getenv("NODE_ENV", "development")
    reload = node_env != "production"
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.BACKEND_PORT,
        reload=reload,
    )
