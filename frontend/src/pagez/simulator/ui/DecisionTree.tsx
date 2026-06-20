"use client";

import { FC } from "react";
import { DecisionRecord } from "../model/types";

const TONE: Record<string, { dot: string; label: string }> = {
    good: { dot: "#69a93f", label: "Верно" },
    bad: { dot: "#e84c3d", label: "Риск" },
    neutral: { dot: "#fac540", label: "Спорно" },
};

export const DecisionTree: FC<{ decisions: DecisionRecord[] }> = ({ decisions }) => {
    if (decisions.length === 0) {
        return <p className="text-sm text-white/40">Ключевых решений не зафиксировано.</p>;
    }
    return (
        <div className="relative pl-6">
            <div className="absolute bottom-2 left-[7px] top-2 w-px bg-white/12" />
            <div className="flex flex-col gap-3">
                {decisions.map((d, i) => {
                    const t = TONE[d.tone];
                    return (
                        <div key={i} className="relative">
                            <span
                                className="absolute -left-[22px] top-1.5 size-3.5 rounded-full border-2 border-[#0c1422]"
                                style={{ background: t.dot }}
                            />
                            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                                <div className="mb-1 flex items-center gap-2">
                                    <span className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ background: `${t.dot}22`, color: t.dot }}>
                                        {t.label}
                                    </span>
                                    {d.cite && (
                                        <span className="text-[10px] font-semibold text-[#8bc249]">
                                            📖 {d.cite.law} {d.cite.ref}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm font-medium text-white/90">{d.choice}</p>
                                {d.cite && <p className="mt-0.5 text-xs text-white/45">{d.cite.note}</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
