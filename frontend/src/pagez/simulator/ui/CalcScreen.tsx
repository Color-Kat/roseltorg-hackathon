"use client";

import { FC, useState } from "react";
import { twMerge } from "tailwind-merge";

import { CalcTask } from "../model/calc";
import { Effect } from "../model/types";
import { IconArrow, IconCalc, IconCheck, IconFail, IconLaw } from "./icons";

interface Props {
    task: CalcTask;
    onComplete: (effects: Effect[], allCorrect: boolean) => void;
}

export const CalcScreen: FC<Props> = ({ task, onComplete }) => {
    const [stepIndex, setStepIndex] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const [results, setResults] = useState<boolean[]>([]);
    const [numValue, setNumValue] = useState("");
    const [picked, setPicked] = useState<number | null>(null);

    const step = task.steps[stepIndex];
    const isLast = stepIndex === task.steps.length - 1;

    const checkNumber = () => {
        const v = parseFloat(numValue.replace(",", "."));
        if (Number.isNaN(v)) return;
        const ok = Math.abs(v - (step.answer ?? 0)) <= (step.tolerance ?? 0);
        setResults((r) => [...r, ok]);
        setRevealed(true);
    };

    const checkSelect = (i: number) => {
        if (revealed) return;
        setPicked(i);
        const ok = !!step.options?.[i]?.correct;
        setResults((r) => [...r, ok]);
        setRevealed(true);
    };

    const next = () => {
        if (isLast) {
            const correct = results.filter(Boolean).length;
            const wrong = results.length - correct;
            const allCorrect = wrong === 0;
            const effects: Effect[] = [
                { stat: "knowledge", delta: correct * 6 - wrong * 2 },
                { stat: "application", delta: correct * 5 - wrong * 2 },
            ];
            if (wrong > 0) effects.push({ stat: "stress", delta: wrong * 2 });
            if (allCorrect) effects.push({ stat: "trust", delta: 4 });
            onComplete(effects, allCorrect);
            return;
        }
        setStepIndex((i) => i + 1);
        setRevealed(false);
        setNumValue("");
        setPicked(null);
    };

    const lastOk = results[results.length - 1];

    return (
        <div className="vn-root flex h-full w-full flex-col bg-gradient-to-br from-[#0b1422] to-[#10203a]">
            {/* шапка задачи */}
            <div className="border-b border-white/10 px-4 py-3 sm:px-8">
                <div className="mx-auto flex max-w-2xl items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-[#69a93f]/15 text-[#8bc249]"><IconCalc size={18} /></span>
                    <div className="min-w-0 flex-1">
                        <h2 className="truncate text-base font-extrabold text-white font-nunito">{task.title}</h2>
                        <div className="mt-1 flex gap-1">
                            {task.steps.map((_, i) => (
                                <span key={i} className={twMerge("h-1 flex-1 rounded-full", i < stepIndex ? "bg-[#69a93f]" : i === stepIndex ? "bg-white/60" : "bg-white/12")} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col overflow-y-auto px-4 py-4 sm:px-8">
                <p className="mb-3 text-sm text-white/70">{task.brief}</p>

                {/* исходные данные */}
                <div className="mb-4 flex flex-wrap gap-2">
                    {task.given.map((g, i) => (
                        <div key={i} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5">
                            <span className="text-[10px] uppercase tracking-wider text-white/40">{g.label}</span>
                            <div className="text-sm font-bold text-white">{g.value}</div>
                        </div>
                    ))}
                </div>

                {/* вопрос шага */}
                <div className="rounded-2xl border border-white/10 bg-[#0c1422]/70 p-4">
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-white/40">Шаг {stepIndex + 1} из {task.steps.length}</div>
                    <p className="text-[15px] font-semibold text-white">{step.question}</p>
                    {step.formula && <p className="mt-1 font-mono text-xs text-[#8bc249]">{step.formula}</p>}

                    {/* ввод */}
                    {step.kind === "number" ? (
                        <div className="mt-4 flex items-center gap-2">
                            <input
                                value={numValue}
                                onChange={(e) => setNumValue(e.target.value.replace(/[^\d.,-]/g, ""))}
                                disabled={revealed}
                                inputMode="decimal"
                                placeholder="0"
                                className="w-36 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-lg font-bold text-white outline-none focus:border-[#69a93f]/60 disabled:opacity-60"
                                onKeyDown={(e) => e.key === "Enter" && !revealed && checkNumber()}
                            />
                            <span className="text-sm text-white/50">{step.unit}</span>
                            {!revealed && (
                                <button onClick={checkNumber} disabled={!numValue} className="ml-auto rounded-xl bg-[#69a93f] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#5d9737] disabled:opacity-40">
                                    Проверить
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="mt-4 flex flex-col gap-2">
                            {step.options?.map((o, i) => {
                                const state = !revealed ? "idle" : o.correct ? "correct" : picked === i ? "wrong" : "muted";
                                return (
                                    <button
                                        key={i}
                                        onClick={() => checkSelect(i)}
                                        disabled={revealed}
                                        className={twMerge(
                                            "vn-choice flex items-center gap-2 rounded-xl border px-4 py-3 text-left text-sm transition",
                                            state === "idle" && "border-white/12 bg-white/[0.03] text-white/90 hover:border-white/40 hover:bg-white/5",
                                            state === "correct" && "border-[#69a93f]/60 bg-[#69a93f]/12 text-white",
                                            state === "wrong" && "border-[#e84c3d]/60 bg-[#e84c3d]/12 text-white",
                                            state === "muted" && "border-white/8 text-white/40",
                                        )}
                                    >
                                        {state === "correct" && <IconCheck className="shrink-0 text-[#8bc249]" size={16} />}
                                        {state === "wrong" && <IconFail className="shrink-0 text-[#ff7a6e]" size={16} />}
                                        <span>{o.text}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* разбор */}
                    {revealed && (
                        <div className="vn-fade-up mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                            <div className="mb-1 flex items-center gap-2 text-sm font-bold" style={{ color: lastOk ? "#8bc249" : "#ff7a6e" }}>
                                {lastOk ? <IconCheck size={16} /> : <IconFail size={16} />}
                                {lastOk ? "Верно" : "Неверно"}
                            </div>
                            <p className="text-sm text-white/75">{step.explain}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                                <span className="inline-flex items-center gap-1 rounded bg-[#69a93f]/15 px-2 py-0.5 font-bold text-[#8bc249]">
                                    <IconLaw size={12} /> {step.cite.law} {step.cite.ref}
                                </span>
                                <span className="text-white/55">{step.cite.note}</span>
                            </div>
                        </div>
                    )}
                </div>

                {revealed && (
                    <button onClick={next} className="mt-4 inline-flex items-center justify-center gap-1.5 self-end rounded-xl bg-[#69a93f] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#5d9737]">
                        {isLast ? "Завершить расчёт" : "Следующий шаг"} <IconArrow size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};
