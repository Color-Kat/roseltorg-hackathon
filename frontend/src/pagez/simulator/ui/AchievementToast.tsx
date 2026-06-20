"use client";

import { FC, useEffect, useState } from "react";
import { ACHIEVEMENTS } from "../model/achievements";

interface ToastItem { id: number; achId: string; }

let counter = 0;

/**
 * Очередь «пушей» за ключевые решения: зелёные — похвала HR,
 * красные — «начальство это заметило». Видны и игроку, и работодателю.
 */
export const AchievementToasts: FC<{ queue: string[] }> = ({ queue }) => {
    const [items, setItems] = useState<ToastItem[]>([]);

    useEffect(() => {
        if (queue.length === 0) return;
        const added = queue.map((achId) => ({ id: ++counter, achId }));
        setItems((prev) => [...prev, ...added]);
        const timers = added.map((it) =>
            setTimeout(() => setItems((prev) => prev.filter((p) => p.id !== it.id)), 4600),
        );
        return () => timers.forEach(clearTimeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queue]);

    return (
        <div className="pointer-events-none absolute right-3 top-20 z-40 flex w-[290px] flex-col gap-2 sm:right-4">
            {items.map((it) => {
                const a = ACHIEVEMENTS[it.achId];
                if (!a) return null;
                const good = a.tone === "good";
                return (
                    <div
                        key={it.id}
                        className="vn-toast overflow-hidden rounded-xl border bg-[#0c1422]/95 backdrop-blur-md"
                        style={{ borderColor: good ? "rgba(105,169,63,0.5)" : "rgba(232,76,61,0.5)" }}
                    >
                        <div className="flex items-start gap-3 p-3">
                            <div
                                className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg text-lg"
                                style={{ background: good ? "rgba(105,169,63,0.18)" : "rgba(232,76,61,0.18)" }}
                            >
                                {good ? "🏆" : "⚠️"}
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="text-[10px] font-bold uppercase tracking-wider"
                                        style={{ color: good ? "#8bc249" : "#ff7a6e" }}
                                    >
                                        {good ? "Ачивка" : "Замечание"}
                                    </span>
                                </div>
                                <p className="text-sm font-bold text-white">{a.title}</p>
                                <p className="mt-0.5 text-xs leading-snug text-white/65">{a.push}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
