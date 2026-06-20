"use client";

import Link from "next/link";
import { FC, useEffect, useMemo, useRef } from "react";

import { useCreateAssessment } from "@/entities/assessment";
import { ROUTES } from "@/shared/consts";

import { ACHIEVEMENTS } from "../model/achievements";
import { finalScore, GRADE_LABEL, GRADE_SUB } from "../model/grading";
import { Citation, RunState } from "../model/types";
import { Flowchart } from "./Flowchart";
import { IconArrow, IconBad, IconCabinet, IconCheck, IconFlag, IconGood, IconLaw, IconTrend } from "./icons";

const RADAR = [
    { key: "knowledge", label: "Знание" },
    { key: "application", label: "Эффект." },
    { key: "integrity", label: "Честность" },
    { key: "soft", label: "Софт" },
    { key: "resilience", label: "Стресс" },
] as const;

function radarPoints(values: number[], R: number, cx: number, cy: number) {
    return values.map((v, i) => {
        const ang = (-90 + i * (360 / values.length)) * (Math.PI / 180);
        const r = (Math.max(4, v) / 100) * R;
        return [cx + r * Math.cos(ang), cy + r * Math.sin(ang)];
    });
}

export const FinalReport: FC<{ state: RunState; onRestart: () => void }> = ({ state, onRestart }) => {
    const { stats, grade } = state;
    const { resilience, avg } = finalScore(stats);
    const values = [stats.knowledge, stats.application, stats.integrity, stats.soft, resilience];

    const R = 90, cx = 120, cy = 110;
    const dataPts = radarPoints(values, R, cx, cy);
    const axisPts = radarPoints([100, 100, 100, 100, 100], R, cx, cy);

    const goodAch = state.unlocked.filter((id) => ACHIEVEMENTS[id]?.tone === "good");
    const badAch = state.unlocked.filter((id) => ACHIEVEMENTS[id]?.tone === "bad");
    const compliance = state.flags.compliance ?? 0;

    const strengths = RADAR.filter((_, i) => values[i] >= 70).map((r) => r.label);
    const growth = RADAR.filter((_, i) => values[i] < 50).map((r) => r.label);

    const citations = useMemo(() => {
        const seen = new Map<string, Citation>();
        for (const d of state.decisions) if (d.cite) seen.set(`${d.cite.law} ${d.cite.ref}`, d.cite);
        return [...seen.values()];
    }, [state.decisions]);

    const quality = avg >= 80 ? "уверенный" : avg >= 60 ? "стабильный" : "с оговорками";

    // ---- автосохранение результата в кабинет работодателя ----
    const saver = useCreateAssessment();
    const saved = useRef(false);
    useEffect(() => {
        if (saved.current) return;
        saved.current = true;
        saver.mutate({
            candidate_name: state.profile.name || "Кандидат",
            grade,
            grade_label: GRADE_LABEL[grade],
            avg,
            compliance,
            stats,
            decisions: state.decisions.map((d) => ({ day: d.day, question: d.question, choice: d.choice, tone: d.tone, cite: d.cite })),
            achievements: state.unlocked.map((id) => ({ id, title: ACHIEVEMENTS[id].title, tone: ACHIEVEMENTS[id].tone, desc: ACHIEVEMENTS[id].desc })),
            profile: { ...state.profile },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="vn-root h-full w-full overflow-y-auto bg-gradient-to-br from-[#0b1422] to-[#10203a]">
            <div className="mx-auto max-w-4xl px-4 py-7 sm:px-6">
                <div className="vn-fade-up mb-5 text-center">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8bc249]">Итоговый отчёт для HR</div>
                    <h2 className="mt-1 text-2xl font-extrabold text-white font-nunito sm:text-3xl">Профиль кандидата</h2>
                    <p className="mt-1 text-sm text-white/55">{state.profile.name || "Кандидат"} · {state.profile.edu} · {state.profile.exp}</p>
                    <div className="mt-2 text-xs text-white/40">
                        {saver.isPending && "Сохранение в кабинет работодателя…"}
                        {saver.isSuccess && "Результат сохранён в кабинет работодателя."}
                        {saver.isError && "Не удалось сохранить (бэкенд недоступен) — отчёт виден локально."}
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_240px]">
                    <div className="rounded-2xl border border-white/10 bg-[#0c1422]/70 p-5">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <div className="text-[10px] uppercase tracking-wider text-white/40">Подтверждённый грейд</div>
                                <div className="text-4xl font-extrabold text-[#8bc249] font-nunito">{GRADE_LABEL[grade]}</div>
                                <div className="text-sm text-white/50">{GRADE_SUB[grade]} · профиль {quality}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] uppercase tracking-wider text-white/40">Сводный балл</div>
                                <div className="text-4xl font-extrabold tabular-nums text-white">{avg}</div>
                            </div>
                        </div>

                        <div className="mt-4 space-y-3">
                            {strengths.length > 0 && (
                                <div>
                                    <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-white/45">Сильные стороны</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {strengths.map((s) => <span key={s} className="inline-flex items-center gap-1 rounded-md bg-[#69a93f]/12 px-2 py-1 text-xs font-semibold text-[#8bc249]"><IconCheck size={12} /> {s}</span>)}
                                    </div>
                                </div>
                            )}
                            {growth.length > 0 && (
                                <div>
                                    <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-white/45">Точки роста</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {growth.map((s) => <span key={s} className="inline-flex items-center gap-1 rounded-md bg-[#f5a524]/12 px-2 py-1 text-xs font-semibold text-[#f5b54a]"><IconTrend size={12} /> {s}</span>)}
                                    </div>
                                </div>
                            )}
                            {compliance > 0 && (
                                <div className="flex items-center gap-2 rounded-lg border border-[#e84c3d]/40 bg-[#e84c3d]/10 px-3 py-2 text-xs text-[#ff7a6e]">
                                    <IconFlag size={14} className="shrink-0" /> Комплаенс-риск: зафиксировано нарушений — {compliance}. Требует внимания HR независимо от грейда.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0c1422]/70 p-4">
                        <svg viewBox="0 0 240 220" className="w-full max-w-[240px]">
                            {[0.25, 0.5, 0.75, 1].map((f) => (
                                <polygon key={f} points={radarPoints([100, 100, 100, 100, 100], R * f, cx, cy).map((p) => p.join(",")).join(" ")} fill="none" stroke="rgba(255,255,255,0.08)" />
                            ))}
                            {axisPts.map((p, i) => <line key={i} x1={cx} y1={cy} x2={p[0]} y2={p[1]} stroke="rgba(255,255,255,0.08)" />)}
                            <polygon points={dataPts.map((p) => p.join(",")).join(" ")} fill="rgba(105,169,63,0.28)" stroke="#69a93f" strokeWidth={2} />
                            {dataPts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={2.5} fill="#8bc249" />)}
                            {axisPts.map((p, i) => {
                                const lx = cx + (p[0] - cx) * 1.16, ly = cy + (p[1] - cy) * 1.16;
                                return <text key={i} x={lx} y={ly} fontSize={9} fill="rgba(255,255,255,0.55)" textAnchor="middle" dominantBaseline="middle">{RADAR[i].label}</text>;
                            })}
                        </svg>
                    </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-[#0c1422]/70 p-4">
                        <h3 className="mb-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#8bc249]"><IconGood size={16} /> Сильные сигналы ({goodAch.length})</h3>
                        <div className="flex flex-col gap-2">
                            {goodAch.length === 0 && <p className="text-sm text-white/40">Нет.</p>}
                            {goodAch.map((id) => (
                                <div key={id} className="rounded-lg border border-[#69a93f]/25 bg-[#69a93f]/[0.06] p-2.5">
                                    <p className="text-sm font-bold text-white">{ACHIEVEMENTS[id].title}</p>
                                    <p className="text-xs text-white/55">{ACHIEVEMENTS[id].desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[#0c1422]/70 p-4">
                        <h3 className="mb-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#ff7a6e]"><IconBad size={16} /> Сигналы внимания ({badAch.length})</h3>
                        <div className="flex flex-col gap-2">
                            {badAch.length === 0 && <p className="text-sm text-white/40">Нет. Чистое прохождение.</p>}
                            {badAch.map((id) => (
                                <div key={id} className="rounded-lg border border-[#e84c3d]/25 bg-[#e84c3d]/[0.06] p-2.5">
                                    <p className="text-sm font-bold text-white">{ACHIEVEMENTS[id].title}</p>
                                    <p className="text-xs text-white/55">{ACHIEVEMENTS[id].desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-4 space-y-3">
                    {[1, 2, 3].map((day) => {
                        const has = state.decisions.some((d) => d.day === day);
                        if (!has) return null;
                        const o = state.outcomes.find((x) => x.day === day);
                        return (
                            <Flowchart
                                key={day}
                                day={day}
                                decisions={state.decisions}
                                outcome={o ? { verdict: o.verdict, label: GRADE_LABEL[o.gradeReached] } : undefined}
                            />
                        );
                    })}
                </div>

                {citations.length > 0 && (
                    <div className="mt-4 rounded-2xl border border-white/10 bg-[#0c1422]/70 p-4">
                        <h3 className="mb-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/55"><IconLaw size={16} /> Затронутая нормативная база</h3>
                        <div className="flex flex-wrap gap-2">
                            {citations.map((c, i) => (
                                <span key={i} className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white/75" title={c.note}>
                                    <b className="text-[#8bc249]">{c.law}</b> {c.ref}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                    <Link href={ROUTES.CABINET} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#69a93f] py-3.5 text-sm font-bold text-white transition hover:bg-[#5d9737]">
                        <IconCabinet size={16} /> Кабинет работодателя
                    </Link>
                    <button onClick={onRestart} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-bold text-white/80 transition hover:bg-white/5">
                        <IconArrow size={16} /> Пройти заново
                    </button>
                </div>
            </div>
        </div>
    );
};
