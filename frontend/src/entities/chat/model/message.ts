/** A single chat message in a conversation with the AI assistant. */
export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

/** Request body for `POST /ai/chat`. */
export interface ChatRequest {
    messages: ChatMessage[];
}

/** Response from `POST /ai/chat`. */
export interface ChatResponse {
    reply: string;
}
