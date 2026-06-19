"""AI chat routes — talks to OpenRouter via the AIService.

Open demo endpoint (no auth) so the chat works out of the box. Protect it with
`Depends(get_current_user)` if you want it behind login.
"""

from fastapi import APIRouter, Depends, HTTPException, status

from app.ai import AIService, get_ai_service
from app.schemas.chat import ChatRequest, ChatResponse

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/chat", response_model=ChatResponse)
async def chat(
    body: ChatRequest,
    ai: AIService = Depends(get_ai_service),
):
    messages = [m.model_dump() for m in body.messages]
    print(f"[AI] /ai/chat received {len(messages)} message(s)", flush=True)
    try:
        reply = await ai.chat(messages)
    except RuntimeError as exc:
        # Misconfiguration (e.g. missing API key) — surface as a 503.
        print(f"[AI] /ai/chat → 503 (config): {exc}", flush=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)
        )
    except Exception as exc:  # noqa: BLE001 — upstream/proxy/model failures
        print(f"[AI] /ai/chat → 502 (upstream): {exc}", flush=True)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI request failed: {exc}",
        )
    print("[AI] /ai/chat → 200 OK", flush=True)
    return ChatResponse(reply=reply)
