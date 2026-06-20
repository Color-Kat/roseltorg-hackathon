"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

import { Assessment, useAssessmentsQuery } from "@/entities/assessment";
import { ROUTES } from "@/shared/consts";
import {
    IconArrow, IconBad, IconCabinet, IconChart, IconFlag, IconGood,
    IconLaw, IconPlay, IconUser,
} from "@/pagez/simulator/ui/icons";

const GRADE_META: Record<string, { label: string; color: string }> = {
    senior: { label: "Сеньор", color: "#69a93f" },
    middle: { label: "Мидл", color: "#8bc249" },
    junior: { label: "Джуниор", color: "#fac540" },
    none: { label: "Не подтверждён", color: "#e84c3d" },
};

const BARS = [
    { key: "knowledge", label: "Знание базы" },
    { key: "application", label: "Эффективность" },
    { key: "integrity", label: "Честность" },
    { key: "soft", label: "Софт-скиллы" },
    { key: "trust", label: "Доверие" },
];

const toneColor = (v: number) => (v >= 65 ? "#6faf3e" : v >= 40 ? "#d9a528" : "#ed573f");

const fmtDate = (iso: string) => {
    try {
        return new Date(iso).toLocaleString("ru-RU", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
    } catch {
        return iso;
    }
};

export const CabinetPage = () => {
    const { data, isLoading, isError } = useAssessmentsQuery();
    const [selected, setSelected] = useState<number | null>(null);

    const list = data ?? [];
    const stats = useMemo(() => {
        const by: Record<string, number> = { senior: 0, middle: 0, junior: 0, none: 0 };
        for (const a of list) by[a.grade] = (by[a.grade] ?? 0) + 1;
        return by;
    }, [list]);

    const active = list.find((a) => a.id === selected) ?? null;

    return (
        <main className="min-h-dvh bg-[#0b1422] text-white">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                {/* header */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <span className="flex size-11 items-center justify-center rounded-xl bg-[#69a93f]/15 text-[#8bc249]"><IconCabinet size={24} /></span>
                        <div>
                            <h1 className="text-2xl font-extrabold font-nunito">Кабинет работодателя</h1>
                            <p className="text-sm text-white/55">Результаты ассессментов кандидатов · SMolensk Dynamics</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={ROUTES.SIMULATOR} className="inline-flex items-center gap-1.5 rounded-xl bg-[#69a93f] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#5d9737]">
                            <IconPlay size={16} /> Запустить ассессмент
                        </Link>
                        <Link href={ROUTES.HOME} className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/5">
                            На главную
                        </Link>
                    </div>
                </div>

                {/* summary */}
                <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
                    <div className="rounded-xl border border-white/10 bg-[#0c1422] p-4">
                        <div className="text-[10px] uppercase tracking-wider text-white/40">Всего</div>
                        <div className="text-2xl font-extrabold tabular-nums">{list.length}</div>
                    </div>
                    {(["senior", "middle", "junior", "none"] as const).map((g) => (
                        <div key={g} className="rounded-xl border border-white/10 bg-[#0c1422] p-4">
                            <div className="text-[10px] uppercase tracking-wider" style={{ color: GRADE_META[g].color }}>{GRADE_META[g].label}</div>
                            <div className="text-2xl font-extrabold tabular-nums">{stats[g] ?? 0}</div>
                        </div>
                    ))}
                </div>

                {isLoading && <div className="rounded-xl border border-white/10 bg-[#0c1422] p-8 text-center text-white/50">Загрузка результатов…</div>}
                {isError && <div className="rounded-xl border border-[#e84c3d]/30 bg-[#e84c3d]/10 p-8 text-center text-[#ff7a6e]">Бэкенд недоступен. Запустите API, чтобы увидеть сохранённые результаты.</div>}
                {!isLoading && !isError && list.length === 0 && (
                    <div className="rounded-xl border border-white/10 bg-[#0c1422] p-10 text-center">
                        <p className="text-white/60">Пока нет ни одного результата.</p>
                        <Link href={ROUTES.SIMULATOR} className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#8bc249]">
                            Пройти ассессмент <IconArrow size={14} />
                        </Link>
                    </div>
                )}

                {list.length > 0 && (
                    <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
                        {/* список */}
                        <div className="flex flex-col gap-2">
                            {list.map((a) => <Row key={a.id} a={a} active={a.id === selected} onClick={() => setSelected(a.id)} />)}
                        </div>

                        {/* деталь */}
                        <div className="lg:sticky lg:top-6 lg:self-start">
                            {active ? <Detail a={active} /> : (
                                <div className="rounded-2xl border border-dashed border-white/12 p-10 text-center text-white/40">
                                    Выберите кандидата слева, чтобы увидеть детальный профиль.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

function Row({ a, active, onClick }: { a: Assessment; active: boolean; onClick: () => void }) {
    const g = GRADE_META[a.grade] ?? GRADE_META.none;
    const good = a.achievements.filter((x) => x.tone === "good").length;
    const bad = a.achievements.filter((x) => x.tone === "bad").length;
    return (
        <button
            onClick={onClick}
            className={twMerge(
                "flex items-center gap-3 rounded-xl border p-3 text-left transition",
                active ? "border-[#69a93f]/60 bg-[#69a93f]/[0.08]" : "border-white/10 bg-[#0c1422] hover:border-white/25",
            )}
        >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-white/60"><IconUser size={20} /></span>
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <span className="truncate font-bold text-white">{a.candidate_name}</span>
                    <span className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase" style={{ background: `${g.color}22`, color: g.color }}>{g.label}</span>
                </div>
                <div className="mt-0.5 flex items-center gap-3 text-xs text-white/45">
                    <span>{fmtDate(a.created_at)}</span>
                    {good > 0 && <span className="inline-flex items-center gap-0.5 text-[#8bc249]"><IconGood size={12} /> {good}</span>}
                    {bad > 0 && <span className="inline-flex items-center gap-0.5 text-[#ff7a6e]"><IconBad size={12} /> {bad}</span>}
                    {a.compliance > 0 && <span className="inline-flex items-center gap-0.5 text-[#ff7a6e]"><IconFlag size={12} /> {a.compliance}</span>}
                </div>
            </div>
            <div className="shrink-0 text-right">
                <div className="text-[10px] uppercase text-white/35">балл</div>
                <div className="text-xl font-extrabold tabular-nums">{a.avg}</div>
            </div>
        </button>
    );
}

function Detail({ a }: { a: Assessment }) {
    const g = GRADE_META[a.grade] ?? GRADE_META.none;
    const resilience = 100 - (a.stats.stress ?? 0);
    const barVal = (k: string) => (k === "trust" ? a.stats.trust : a.stats[k]) ?? 0;

    return (
        <div className="rounded-2xl border border-white/10 bg-[#0c1422] p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-xl font-extrabold font-nunito">{a.candidate_name}</h2>
                    <p className="text-sm text-white/50">{String(a.profile?.edu ?? "")} · {String(a.profile?.exp ?? "")}</p>
                </div>
                <div className="rounded-xl border px-4 py-2 text-center" style={{ borderColor: `${g.color}66`, background: `${g.color}14` }}>
                    <div className="text-[10px] uppercase tracking-wider text-white/45">грейд</div>
                    <div className="text-base font-extrabold" style={{ color: g.color }}>{g.label}</div>
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
                {BARS.map((b) => {
                    const v = barVal(b.key);
                    return (
                        <div key={b.key}>
                            <div className="mb-1 flex justify-between text-xs">
                                <span className="text-white/65">{b.label}</span>
                                <span className="font-bold tabular-nums text-white/80">{v}</span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                                <div className="h-full rounded-full" style={{ width: `${v}%`, background: toneColor(v) }} />
                            </div>
                        </div>
                    );
                })}
                <div>
                    <div className="mb-1 flex justify-between text-xs">
                        <span className="text-white/65">Стрессоустойчивость</span>
                        <span className="font-bold tabular-nums text-white/80">{resilience}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full" style={{ width: `${resilience}%`, background: toneColor(resilience) }} />
                    </div>
                </div>
            </div>

            {a.compliance > 0 && (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#e84c3d]/40 bg-[#e84c3d]/10 px-3 py-2 text-xs text-[#ff7a6e]">
                    <IconFlag size={14} /> Комплаенс-риск: {a.compliance}. Рекомендуется собеседование по комплаенсу.
                </div>
            )}

            {/* ачивки */}
            {a.achievements.length > 0 && (
                <div className="mt-4">
                    <h3 className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/50"><IconChart size={14} /> Поведенческие сигналы</h3>
                    <div className="flex flex-wrap gap-1.5">
                        {a.achievements.map((x, i) => {
                            const good = x.tone === "good";
                            return (
                                <span key={i} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs"
                                    style={{ borderColor: good ? "rgba(105,169,63,0.35)" : "rgba(232,76,61,0.35)", color: good ? "#8bc249" : "#ff7a6e" }}>
                                    {good ? <IconGood size={12} /> : <IconBad size={12} />} {x.title}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* решения по дням */}
            {a.decisions.length > 0 && (
                <div className="mt-4">
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-white/50">Карта решений</h3>
                    {[1, 2, 3].map((day) => {
                        const dd = a.decisions.filter((d) => d.day === day);
                        if (dd.length === 0) return null;
                        return (
                            <div key={day} className="mb-3">
                                <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#8bc249]">День {day}</div>
                                <div className="flex flex-col gap-1.5">
                                    {dd.map((d, i) => {
                                        const c = d.tone === "good" ? "#69a93f" : d.tone === "bad" ? "#e84c3d" : "#fac540";
                                        return (
                                            <div key={i} className="rounded-lg border border-white/8 bg-white/[0.02] p-2 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <span className="size-2 shrink-0 rounded-full" style={{ background: c }} />
                                                    <span className="text-white/85">{d.choice}</span>
                                                </div>
                                                {d.cite && (
                                                    <div className="ml-4 mt-0.5 inline-flex items-center gap-1 text-[11px] text-[#8bc249]">
                                                        <IconLaw size={11} /> {d.cite.law} {d.cite.ref}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
