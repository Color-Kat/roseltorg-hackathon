"use client";

import { FC, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

import { ReviewDocument } from "../model/documents";
import { Effect } from "../model/types";

interface Props {
    doc: ReviewDocument;
    onComplete: (effects: Effect[], allFound: boolean) => void;
}

export const DocumentReview: FC<Props> = ({ doc, onComplete }) => {
    const [marked, setMarked] = useState<Set<number>>(new Set());
    const [submitted, setSubmitted] = useState(false);

    const violations = useMemo(() => doc.lines.filter((l) => l.violation), [doc]);
    const total = violations.length;

    const result = useMemo(() => {
        const found = violations.filter((l) => marked.has(l.id)).length;
        const missed = total - found;
        const falsePos = doc.lines.filter((l) => l.kind === "item" && !l.violation && marked.has(l.id)).length;
        const allFound = found === total && falsePos === 0;
        const effects: Effect[] = [
            { stat: "knowledge", delta: found * 4 - missed * 3 },
            { stat: "application", delta: found * 3 - falsePos * 3 },
        ];
        if (missed > 0) effects.push({ stat: "stress", delta: missed * 2 });
        if (allFound) effects.push({ achievement: "sharpEye" }, { stat: "trust", delta: 4 });
        return { found, missed, falsePos, allFound, effects };
    }, [marked, violations, total, doc.lines]);

    const toggle = (id: number) => {
        if (submitted) return;
        setMarked((prev) => {
            const n = new Set(prev);
            if (n.has(id)) n.delete(id);
            else n.add(id);
            return n;
        });
    };

    const lineClass = (id: number, isViolation: boolean, kind: string) => {
        if (kind === "header") return "text-[#8bc249] font-bold text-sm pt-3 pb-1";
        const isMarked = marked.has(id);
        if (!submitted) {
            return twMerge(
                "cursor-pointer rounded-lg px-3 py-2 text-sm transition border border-transparent",
                isMarked
                    ? "bg-[#e84c3d]/15 border-[#e84c3d]/50 text-white"
                    : "text-white/80 hover:bg-white/[0.05] hover:border-white/15",
            );
        }
        // режим разбора
        if (isViolation && isMarked) return "rounded-lg px-3 py-2 text-sm border border-[#69a93f]/55 bg-[#69a93f]/12 text-white";
        if (isViolation && !isMarked) return "rounded-lg px-3 py-2 text-sm border border-[#e84c3d]/55 bg-[#e84c3d]/12 text-white";
        if (!isViolation && isMarked) return "rounded-lg px-3 py-2 text-sm border border-[#f5a524]/55 bg-[#f5a524]/12 text-white";
        return "rounded-lg px-3 py-2 text-sm text-white/55";
    };

    return (
        <div className="vn-root flex h-full w-full flex-col bg-gradient-to-br from-[#0b1422] to-[#10203a]">
            <div className="border-b border-white/10 px-4 py-3 sm:px-8 sm:py-4">
                <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
                    <div className="min-w-0">
                        <h2 className="truncate text-lg font-extrabold text-white font-nunito">{doc.title}</h2>
                        <p className="truncate text-xs text-white/50">{doc.subtitle}</p>
                    </div>
                    <div className="shrink-0 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-center">
                        <div className="text-[10px] uppercase tracking-wider text-white/40">Отмечено</div>
                        <div className="text-sm font-bold tabular-nums text-white">{marked.size}</div>
                    </div>
                </div>
            </div>

            <div className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-4 py-4 sm:px-8">
                <p className="mb-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/70">{doc.intro}</p>

                <div className="rounded-xl border border-white/10 bg-[#0c1422]/70 p-3 sm:p-4">
                    {doc.lines.map((l) => (
                        <div key={l.id}>
                            <div className={lineClass(l.id, !!l.violation, l.kind)} onClick={() => l.kind === "item" && toggle(l.id)}>
                                {l.text}
                            </div>
                            {submitted && l.violation && (
                                <div className="mb-1 ml-3 mt-1 flex flex-wrap items-center gap-2 text-xs">
                                    <span className="rounded bg-[#69a93f]/15 px-2 py-0.5 font-bold text-[#8bc249]">
                                        📖 {l.violation.cite.law} {l.violation.cite.ref}
                                    </span>
                                    <span className="text-white/55">{l.violation.cite.note}</span>
                                    <span className="text-white/70">→ {l.violation.fix}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-white/10 px-4 py-3 sm:px-8 sm:py-4">
                <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
                    {!submitted ? (
                        <>
                            <span className="text-xs text-white/45">Кликайте строки с нарушениями. Корректные не трогайте.</span>
                            <button
                                onClick={() => setSubmitted(true)}
                                className="rounded-xl bg-[#69a93f] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#5d9737]"
                            >
                                Сдать на проверку
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="flex flex-wrap gap-3 text-xs">
                                <span className="text-[#8bc249]">Найдено: {result.found}/{total}</span>
                                {result.missed > 0 && <span className="text-[#ff7a6e]">Пропущено: {result.missed}</span>}
                                {result.falsePos > 0 && <span className="text-[#f5a524]">Лишних: {result.falsePos}</span>}
                                {result.allFound && <span className="font-bold text-[#8bc249]">Безупречно!</span>}
                            </div>
                            <button
                                onClick={() => onComplete(result.effects, result.allFound)}
                                className="rounded-xl bg-[#69a93f] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#5d9737]"
                            >
                                Дальше →
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
