import { api } from "@/shared/api/api-instanse";
import { ChatMessage, ChatResponse } from "@/entities/chat/model";

/**
 * AI chat endpoint. Matches the FastAPI backend (see backend/app/routers/chat.py).
 */
export const chatApi = {
    send: async (messages: ChatMessage[]): Promise<string> => {
        const { data } = await api.post<ChatResponse>("/ai/chat", { messages });
        return data.reply;
    },
};
