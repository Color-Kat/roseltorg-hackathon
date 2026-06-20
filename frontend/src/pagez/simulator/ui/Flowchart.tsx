"use client";

import { FC, Fragment, useMemo } from "react";
import { twMerge } from "tailwind-merge";

import { SCENE_LIST } from "../model/content";
import { dayOf } from "../model/engine";
import { DecisionRecord } from "../model/types";
import { IconCheck, IconLock, IconNext } from "./icons";

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
            prompt: (last?.text ?? "Развилка").replace(/^[«»()]/, "").slice(0, 80),
            options: (n.choices ?? []).map((c) => ({ text: c.text, tone: c.tone ?? "neutral" })),
        };
    });
}

/**
 * Горизонтальная карта ветвлений в стиле Detroit: Become Human. Развилки идут
 * слева направо со скроллом; в каждой колонке — все варианты, выбранный
 * подсвечен, остальные «закрыты». Колонки соединены коннекторами.
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
        <div>
            <div className="overflow-x-auto pb-2 [scrollbar-width:thin]">
                <div className="flex min-w-max items-stretch py-2">
                    {points.map((p, idx) => {
                        const chosen = chosenByNode.get(p.nodeId);
                        return (
                            <Fragment key={p.nodeId}>
                                {idx > 0 && (
                                    <div className="flex w-8 shrink-0 items-center justify-center self-center">
                                        <span className="flex size-6 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/30">
                                            <IconNext size={14} />
                                        </span>
                                    </div>
                                )}
                                <div className="flex w-[220px] shrink-0 flex-col">
                                    <div className="mb-2 flex items-center gap-1.5">
                                        <span className="flex size-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white/60">{idx + 1}</span>
                                        <span className="line-clamp-2 text-[11px] leading-tight text-white/45">{p.prompt}</span>
                                    </div>
                                    <div className="flex flex-1 flex-col justify-center gap-1.5">
                                        {p.options.map((o, i) => {
                                            const isChosen = chosen === o.text;
                                            const color = TONE_COLOR[o.tone];
                                            return (
                                                <div
                                                    key={i}
                                                    className={twMerge(
                                                        "flex items-start gap-1.5 rounded-lg border px-2.5 py-2 text-[11px] leading-snug transition",
                                                        isChosen ? "text-white shadow-sm" : "border-white/8 text-white/35",
                                                    )}
                                                    style={isChosen ? { borderColor: `${color}99`, background: `${color}1f` } : undefined}
                                                >
                                                    {isChosen
                                                        ? <IconCheck size={13} className="mt-0.5 shrink-0" style={{ color }} />
                                                        : <IconLock size={11} className="mt-0.5 shrink-0 text-white/25" />}
                                                    <span className={twMerge("line-clamp-3", isChosen && "font-semibold")}>{o.text}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </Fragment>
                        );
                    })}
                </div>
            </div>

            {/* легенда */}
            <div className="mt-1 flex flex-wrap items-center gap-3 text-[10px] text-white/45">
                <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full" style={{ background: TONE_COLOR.good }} /> Верно</span>
                <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full" style={{ background: TONE_COLOR.neutral }} /> Спорно</span>
                <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full" style={{ background: TONE_COLOR.bad }} /> Риск</span>
                <span className="inline-flex items-center gap-1"><IconLock size={10} /> не выбрано</span>
            </div>
        </div>
    );
};
