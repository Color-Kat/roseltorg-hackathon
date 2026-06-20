"use client";

import { FC } from "react";

import { ACHIEVEMENTS } from "../model/achievements";
import { IconArrow, IconBad, IconGood } from "./icons";

/**
 * Модальное «вручение» ачивки за ключевое решение — показывается ДО перехода
 * к следующему слайду, чтобы и кандидат, и работодатель увидели сигнал.
 * Зелёные — «HR похвалила», красные — «начальство заметило».
 */
export const AchievementReveal: FC<{ ids: string[]; onClose: () => void }> = ({ ids, onClose }) => {
    const items = ids.map((id) => ACHIEVEMENTS[id]).filter(Boolean);
    if (items.length === 0) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="vn-fade-up w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col gap-2">
                    {items.map((a) => {
                        const good = a.tone === "good";
                        return (
                            <div
                                key={a.id}
                                className="overflow-hidden rounded-2xl border bg-[#0c1422]"
                                style={{ borderColor: good ? "rgba(105,169,63,0.5)" : "rgba(232,76,61,0.5)" }}
                            >
                                <div className="flex items-start gap-3 p-4">
                                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl"
                                        style={{ background: good ? "rgba(105,169,63,0.16)" : "rgba(232,76,61,0.16)", color: good ? "#8bc249" : "#ff7a6e" }}>
                                        {good ? <IconGood size={22} /> : <IconBad size={22} />}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: good ? "#8bc249" : "#ff7a6e" }}>
                                            {good ? "Ачивка получена" : "Замечание зафиксировано"}
                                        </div>
                                        <p className="text-base font-bold text-white">{a.title}</p>
                                        <p className="mt-0.5 text-sm text-white/65">{a.push}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <button onClick={onClose} className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-white/10 py-3 text-sm font-bold text-white transition hover:bg-white/15">
                    Продолжить <IconArrow size={16} />
                </button>
            </div>
        </div>
    );
};
