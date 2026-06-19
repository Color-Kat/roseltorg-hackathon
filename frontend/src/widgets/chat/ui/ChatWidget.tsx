'use client';

import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    ScrollShadow,
    Spinner,
    Textarea,
} from "@heroui/react";
import { FormEvent, useEffect, useRef, useState } from "react";

import { ChatMessage, useSendMessage } from "@/entities/chat";

const WELCOME: ChatMessage = {
    role: "assistant",
    content:
        "Привет! Я ИИ-ассистент по госзакупкам. Спросите о 44-ФЗ, 223-ФЗ, " +
        "этапах процедур или типичных ошибках — помогу разобраться.",
};

/**
 * Floating AI chat. A round button in the bottom-right corner opens a panel
 * with a running conversation backed by `POST /ai/chat` (OpenRouter).
 */
export const ChatWidget = () => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
    const send = useSendMessage();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Keep the latest message in view.
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    }, [messages, send.isPending, open]);

    const handleSubmit = (e?: FormEvent) => {
        e?.preventDefault();
        const text = input.trim();
        if (!text || send.isPending) return;

        const history: ChatMessage[] = [...messages, { role: "user", content: text }];
        setMessages(history);
        setInput("");

        // Send the conversation without the synthetic welcome message.
        send.mutate(history.filter((m) => m !== WELCOME), {
            onSuccess: (reply) =>
                setMessages((prev) => [...prev, { role: "assistant", content: reply }]),
            onError: () =>
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content:
                            "Не удалось получить ответ. Проверьте, что задан OPENROUTER_API_KEY, и попробуйте ещё раз.",
                    },
                ]),
        });
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <>
            {/* Toggle button */}
            <Button
                isIconOnly
                color="primary"
                radius="full"
                size="lg"
                aria-label={open ? "Закрыть чат" : "Открыть чат с ИИ"}
                onPress={() => setOpen((v) => !v)}
                className="fixed bottom-5 right-5 z-50 size-14 shadow-lg"
            >
                {open ? <CloseIcon /> : <ChatIcon />}
            </Button>

            {/* Chat panel */}
            {open && (
                <Card className="fixed bottom-24 right-5 z-50 flex h-[32rem] max-h-[calc(100dvh-8rem)] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col shadow-2xl">
                    <CardHeader className="flex flex-col items-start gap-0.5 border-b border-default-100">
                        <h3 className="text-base font-semibold">ИИ-ассистент</h3>
                        <span className="text-xs text-default-400">Госзакупки · OpenRouter</span>
                    </CardHeader>

                    <CardBody className="p-0">
                        <ScrollShadow ref={scrollRef} className="flex h-full flex-col gap-3 p-4">
                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    className={
                                        m.role === "user"
                                            ? "self-end max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
                                            : "self-start max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-default-100 px-3 py-2 text-sm text-foreground"
                                    }
                                >
                                    {m.content}
                                </div>
                            ))}

                            {send.isPending && (
                                <div className="self-start rounded-2xl rounded-bl-sm bg-default-100 px-3 py-2">
                                    <Spinner size="sm" />
                                </div>
                            )}
                        </ScrollShadow>
                    </CardBody>

                    <CardFooter className="border-t border-default-100">
                        <form onSubmit={handleSubmit} className="flex w-full items-end gap-2">
                            <Textarea
                                value={input}
                                onValueChange={setInput}
                                onKeyDown={onKeyDown}
                                placeholder="Спросите что-нибудь…"
                                minRows={1}
                                maxRows={4}
                                variant="bordered"
                                className="flex-1"
                            />
                            <Button
                                type="submit"
                                isIconOnly
                                color="primary"
                                radius="full"
                                isDisabled={!input.trim() || send.isPending}
                                aria-label="Отправить"
                            >
                                <SendIcon />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}
        </>
    );
};

/* — inline icons (no extra deps) — */

const ChatIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18M6 6l12 12" />
    </svg>
);

const SendIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
    </svg>
);
