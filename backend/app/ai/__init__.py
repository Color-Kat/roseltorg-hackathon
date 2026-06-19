"""AI package: OpenRouter-backed LLM service (chat completions, with proxy)."""

from app.ai.service import AIService, get_ai_service

__all__ = ["AIService", "get_ai_service"]
