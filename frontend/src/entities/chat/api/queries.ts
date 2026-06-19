import { useMutation } from "@tanstack/react-query";

import { chatApi } from "@/entities/chat/api/chat-api";
import { ChatMessage } from "@/entities/chat/model";

/** React Query hook: send the conversation and get the assistant's reply. */
export function useSendMessage() {
    return useMutation({
        mutationFn: (messages: ChatMessage[]) => chatApi.send(messages),
    });
}
