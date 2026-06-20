"use client";

import { FC, useMemo } from "react";
import { twMerge } from "tailwind-merge";

import { SCENE_LIST } from "../model/content";
import { dayOf } from "../model/engine";
import { DecisionRecord } from "../model/types";
import { IconCheck, IconLock } from "./icons";

interface BranchPoint {
    nodeId: string;
    prompt: string;
    options: { text: string; tone: string }[];
}

const TONE_COLOR: Record<string, string> = { good: "#69a93f", bad: "#e84c3d", neutral: "#fac540" };

function branchPoints(day: number): BranchPoint[] {
    return SCENE_LIST.filter((n) => dayOf(n.id) === day && n.choices?.some((c) => c.tone)).map((n) => {
        const lines = n.lines ?? [];
        const last = lines[lines.length - 1];
        return {
            nodeId: n.id,
            prompt: (last?.text ?? "Развилка").replace(/^[«»()]/, "").slice(0, 90),
            options: (n.choices ?? []).map((c) => ({ text: c.text, tone: c.tone ?? "neutral" })),
        };
    });
}

/**
 * Карта ветвлений в стиле Detroit: Become Human — показывает ВСЕ ответвления
 * сюжета за день, подсвечивает выбранный путь, а нереализованные ветки
 * остаются «закрытыми». Так видна полная картина решений.
 */
export const Flowchart: FC<{ day: number; decisions: DecisionRecord[] }> = ({ day, decisions }) => {
    const points = useMemo(() => branchPoints(day), [day]);
    const chosenByNode = useMemo(() => {
        const m = new Map<string, string>();
        for (const d of decisions) if (d.day === day) m.set(d.nodeId, d.choice);
        return m;
    }, [decisions, day]);

    if (points.length === 0) return <p className="text-sm text-white/40">Развилок не зафиксировано.</p>;

    return (
        <div className="relative pl-5">
            <div className="absolute bottom-3 left-[5px] top-3 w-0.5 bg-white/12" />
            <div className="flex flex-col gap-4">
                {points.map((p) => {
                    const chosen = chosenByNode.get(p.nodeId);
                    return (
                        <div key={p.nodeId} className="relative">
                            <span className="absolute -left-[19px] top-1 size-3 rounded-full border-2 border-[#0c1422] bg-white/40" />
                            <p className="mb-2 text-xs text-white/45">{p.prompt}</p>
                            <div className="flex flex-col gap-1.5">
                                {p.options.map((o, i) => {
                                    const isChosen = chosen === o.text;
                                    const color = TONE_COLOR[o.tone];
                                    return (
                                        <div
                                            key={i}
                                            className={twMerge(
                                                "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition",
                                                isChosen ? "text-white" : "border-white/8 text-white/35",
                                            )}
                                            style={isChosen ? { borderColor: `${color}88`, background: `${color}18` } : undefined}
                                        >
                                            {isChosen
                                                ? <IconCheck size={13} className="shrink-0" style={{ color }} />
                                                : <IconLock size={12} className="shrink-0 text-white/25" />}
                                            <span className={twMerge(isChosen && "font-semibold")}>{o.text}</span>
                                            {isChosen && (
                                                <span className="ml-auto rounded px-1.5 py-0.5 text-[9px] font-bold uppercase" style={{ background: `${color}22`, color }}>
                                                    ваш выбор
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
