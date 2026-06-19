"""AIService — async wrapper around OpenRouter's OpenAI-compatible API.

Uses the same transport as the proven prod OCR service: the official ``openai``
async SDK with an ``httpx.AsyncClient`` that routes through ``PROXY_URL`` when set
(``proxy=`` supports both ``http://`` and ``socks5://`` proxies). This is the
behaviour that works in prod, so we don't reinvent the HTTP/proxy layer.

Everything important is printed to stdout with an ``[AI]`` prefix so the backend
console shows exactly what happens — the key (masked), the proxy (password
masked), the target, timing, the HTTP status, and the full error on failure.
Nothing is swallowed.

Configuration comes from settings (see app/config.py), read from env vars:
  OPENROUTER_API_KEY  — required for real requests
  OPENROUTER_BASE_URL — defaults to https://openrouter.ai/api/v1
  AI_MODEL            — model slug (a free OpenRouter model by default)
  PROXY_URL           — optional proxy, e.g. "http://user:pass@host:8080"
                        or "socks5://user:pass@host:1080"
"""

import time
import traceback
from functools import lru_cache
from urllib.parse import urlsplit

import httpx
import openai

from app.ai.prompts import CHAT_SYSTEM_PROMPT
from app.config import settings

# Overall timeout for the OpenRouter call (seconds).
REQUEST_TIMEOUT = 60.0


def _log(msg: str) -> None:
    """Print a diagnostic line to the backend console (always flushed)."""
    print(f"[AI] {msg}", flush=True)


def _mask_secret(value: str, keep_start: int = 6, keep_end: int = 4) -> str:
    """Mask a secret for logging: show only the head and tail."""
    if not value:
        return "<empty>"
    if len(value) <= keep_start + keep_end:
        return "*" * len(value)
    return f"{value[:keep_start]}…{value[-keep_end:]} (len {len(value)})"


def _mask_proxy(url: str) -> str:
    """Render a proxy URL with its password masked."""
    if not url:
        return "none (direct connection)"
    p = urlsplit(url)
    cred = ""
    if p.username:
        cred = f"{p.username}:{'*' * len(p.password or '')}@"
    return f"{p.scheme}://{cred}{p.hostname}:{p.port}"


class AIError(Exception):
    """Raised when the upstream OpenRouter request fails."""


class AIService:
    def __init__(self) -> None:
#         self.model = settings.AI_MODEL
        self.model = 'google/gemma-4-31b-it:free'
        self.base_url = settings.OPENROUTER_BASE_URL.rstrip("/")
        self.api_key = settings.OPENROUTER_API_KEY
        self.proxy_url = settings.PROXY_URL or None

        # Route OpenRouter traffic through the proxy when configured — exactly
        # like the prod OCR service. httpx handles http(s):// and socks5://.
        http_client = (
            httpx.AsyncClient(proxy=self.proxy_url, timeout=REQUEST_TIMEOUT)
            if self.proxy_url
            else None
        )
        self.client = openai.AsyncOpenAI(
            base_url=self.base_url,
            api_key=self.api_key,
            http_client=http_client,
            default_headers={
                "HTTP-Referer": settings.OPENROUTER_REFERER,
                "X-Title": settings.OPENROUTER_TITLE,
            },
        )

        self._log_config()

    def _log_config(self) -> None:
        _log("──────── AIService configuration ────────")
        _log(f"  model       : {self.model}")
        _log(f"  base_url    : {self.base_url}")
        if self.api_key:
            _log(f"  api_key     : SET  {_mask_secret(self.api_key)}")
        else:
            _log("  api_key     : *** MISSING *** (set OPENROUTER_API_KEY in .env)")
        _log(f"  proxy       : {_mask_proxy(self.proxy_url or '')}")
        _log(f"  transport   : openai SDK + httpx (timeout={REQUEST_TIMEOUT:.0f}s)")
        _log("─────────────────────────────────────────")

    async def chat(
        self,
        messages: list[dict],
        *,
        system_prompt: str | None = None,
        model: str | None = None,
    ) -> str:
        """Send a chat conversation to the model and return the reply text.

        `messages` is a list of {"role": "user"|"assistant", "content": str}.
        A system prompt is prepended unless the caller already supplied one.
        """
        if not self.api_key:
            _log("✗ refusing to call OpenRouter: OPENROUTER_API_KEY is not set.")
            raise RuntimeError(
                "OPENROUTER_API_KEY is not set — add it to your .env file."
            )

        full_messages: list[dict] = []
        if not messages or messages[0].get("role") != "system":
            full_messages.append(
                {"role": "system", "content": system_prompt or CHAT_SYSTEM_PROMPT}
            )
        full_messages.extend(messages)

        use_model = model or self.model
        route = (
            f"via proxy {_mask_proxy(self.proxy_url)}" if self.proxy_url else "directly"
        )
        _log(
            f"→ POST {self.base_url}/chat/completions {route} "
            f"| model={use_model} messages={len(full_messages)} "
            f"| timeout={REQUEST_TIMEOUT:.0f}s"
        )

        started = time.monotonic()
        try:
            response = await self.client.chat.completions.create(
                model=use_model,
                messages=full_messages,
                timeout=REQUEST_TIMEOUT,
            )
        except openai.APIStatusError as exc:
            elapsed = time.monotonic() - started
            body = getattr(exc, "response", None)
            text = body.text[:1000] if body is not None else str(exc)
            _log(f"← {exc.status_code} error in {elapsed:.1f}s: {text}")
            raise AIError(f"OpenRouter returned {exc.status_code}: {text}") from exc
        except openai.APITimeoutError as exc:
            elapsed = time.monotonic() - started
            _log(
                f"✗ TIMEOUT after {elapsed:.1f}s — no response. "
                f"proxy={_mask_proxy(self.proxy_url or '')}"
            )
            _log(
                "  hint: proxy reachable at TCP level but not forwarding to "
                "OpenRouter (wrong creds / wrong type / blocked), or OpenRouter "
                "unreachable from this proxy."
            )
            raise AIError(f"timed out after {elapsed:.1f}s") from exc
        except openai.APIConnectionError as exc:
            elapsed = time.monotonic() - started
            _log(f"✗ connection error after {elapsed:.1f}s: {exc.__cause__ or exc}")
            _log(f"  proxy={_mask_proxy(self.proxy_url or '')}")
            traceback.print_exc()
            raise AIError(f"connection failed: {exc.__cause__ or exc}") from exc
        except Exception as exc:  # noqa: BLE001 — surface anything else verbatim
            elapsed = time.monotonic() - started
            _log(f"✗ unexpected error after {elapsed:.1f}s: {type(exc).__name__}: {exc}")
            traceback.print_exc()
            raise AIError(f"{type(exc).__name__}: {exc}") from exc

        elapsed = time.monotonic() - started
        try:
            reply = response.choices[0].message.content or ""
        except (AttributeError, IndexError, TypeError) as exc:
            _log(f"✗ unexpected response shape: {response}")
            raise AIError(f"Unexpected OpenRouter response: {response}") from exc

        _log(f"← 200 OK in {elapsed:.1f}s — reply received ({len(reply)} chars)")
        return reply


@lru_cache
def get_ai_service() -> AIService:
    """Cached singleton — reused across requests."""
    return AIService()
