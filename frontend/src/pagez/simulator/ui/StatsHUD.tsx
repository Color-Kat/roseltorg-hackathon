"use client";

import { FC } from "react";
import { GRADE_LABEL } from "../model/grading";
import { Grade, Stats } from "../model/types";

const PILLS: { key: keyof Stats | "resilience"; label: string; short: string }[] = [
    { key: "trust", label: "Доверие", short: "ДОВ" },
    { key: "knowledge", label: "Знание базы", short: "ЗНАН" },
    { key: "application", label: "Эффективность", short: "ЭФФ" },
    { key: "integrity", label: "Честность", short: "ЧЕСТ" },
    { key: "soft", label: "Софт-скиллы", short: "СОФТ" },
    { key: "resilience", label: "Стрессоустойчивость", short: "СТРЕСС" },
];

const tone = (v: number) => (v >= 65 ? "#6faf3e" : v >= 40 ? "#fac540" : "#ed573f");

export const StatsHUD: FC<{ stats: Stats; grade: Grade; day: number }> = ({ stats, grade, day }) => {
    const val = (k: string) => (k === "resilience" ? 100 - stats.stress : stats[k as keyof Stats]);

    return (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4">
            <div className="pointer-events-auto flex items-center gap-2 rounded-xl border border-white/10 bg-[#0c1422]/80 px-3 py-2 backdrop-blur-md">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                    {day === 0 ? "Оформление" : `День ${day}`}
                </span>
                <span className="h-3 w-px bg-white/15" />
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#8bc249" }}>
                    Грейд: {GRADE_LABEL[grade]}
                </span>
            </div>

            <div className="pointer-events-auto flex flex-wrap gap-1.5 rounded-xl border border-white/10 bg-[#0c1422]/80 p-1.5 backdrop-blur-md">
                {PILLS.map((p) => {
                    const v = val(p.key);
                    return (
                        <div key={p.key} className="flex w-[68px] flex-col gap-1 px-1.5 py-1" title={`${p.label}: ${v}`}>
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-bold tracking-wide text-white/45">{p.short}</span>
                                <span className="text-[10px] font-bold tabular-nums" style={{ color: tone(v) }}>{v}</span>
                            </div>
                            <div className="h-1 overflow-hidden rounded-full bg-white/10">
                                <div className="vn-bar-fill h-full rounded-full" style={{ width: `${v}%`, background: tone(v) }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
