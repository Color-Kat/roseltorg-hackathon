"use client";

import { FC } from "react";

import { ACHIEVEMENTS } from "../model/achievements";
import { computeDayCommit } from "../model/engine";
import { GRADE_LABEL, reportBars } from "../model/grading";
import { RunState } from "../model/types";
import { DecisionTree } from "./DecisionTree";

const FLAVOR: Record<number, Record<string, { quote: string; head: string }>> = {
    1: {
        clean: { head: "Грейд «Джуниор» подтверждён", quote: "«Не идеально, но голова варит. Завтра дам что посложнее.»" },
        ok: { head: "Прошли с недочётами", quote: "«Сойдёт. Пока. Но ещё раз так лопухнёшься — будешь котельные считать.»" },
        fired: { head: "Вы уволены", quote: "«Не, не моё. Не сработаемся мы с тобой.»" },
    },
    2: {
        clean: { head: "Грейд «Мидл» подтверждён", quote: "«А ты растёшь. На Эдуарда не повёлся. Завтра будет настоящая мясорубка — ФАС.»" },
        ok: { head: "Прошли с недочётами", quote: "«Ну, тянешь. Местами сыро, но контракт живой.»" },
        fired: { head: "Вы уволены", quote: "«Я думал, у тебя стержень есть. Ошибся. Свободен.»" },
    },
    3: {
        clean: { head: "Грейд «Сеньор» подтверждён", quote: "«За тридцать лет таких, как ты, по пальцам. Добро пожаловать в команду по-настоящему.»" },
        ok: { head: "Мидл с плюсом", quote: "«По закону — не подкопаешься. Но дорога нужна была людям сейчас.»" },
        fired: { head: "Контракт расторгнут", quote: "«Это уже не выговор. Это статья. Мы расстаёмся.»" },
    },
};

const VERDICT_COLOR: Record<string, string> = { clean: "#69a93f", ok: "#f5a524", fired: "#e84c3d" };

export const DayResult: FC<{ state: RunState; day: number; onContinue: () => void }> = ({ state, day, onContinue }) => {
    const { verdict, newGrade } = computeDayCommit(state, day);
    const flavor = FLAVOR[day][verdict];
    const color = VERDICT_COLOR[verdict];
    const dayDecisions = state.decisions.filter((d) => d.day === day);
    const bars = reportBars(state.stats);
    const isEnd = verdict === "fired" || day === 3;

    return (
        <div className="vn-root h-full w-full overflow-y-auto bg-gradient-to-br from-[#0b1422] to-[#10203a]">
            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
                <div className="vn-fade-up mb-6 text-center">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Итог дня {day}</div>
                    <h2 className="mt-1 text-3xl font-extrabold font-nunito" style={{ color }}>{flavor.head}</h2>
                    <p className="mx-auto mt-2 max-w-xl text-sm italic text-white/65">{flavor.quote}</p>
                </div>

                <div className="mb-6 flex items-center justify-center gap-3">
                    <div className="rounded-2xl border px-6 py-3 text-center" style={{ borderColor: `${color}66`, background: `${color}14` }}>
                        <div className="text-[10px] uppercase tracking-wider text-white/45">Текущий грейд</div>
                        <div className="text-xl font-extrabold" style={{ color }}>{GRADE_LABEL[newGrade]}</div>
                    </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    {/* Профиль */}
                    <div className="rounded-2xl border border-white/10 bg-[#0c1422]/70 p-4">
                        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-white/55">Характеристики</h3>
                        <div className="flex flex-col gap-2.5">
                            {bars.map((b) => (
                                <div key={b.key}>
                                    <div className="mb-1 flex justify-between text-xs">
                                        <span className="text-white/65">{b.label}</span>
                                        <span className="font-bold tabular-nums text-white/80">{b.value}</span>
                                    </div>
                                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                                        <div className="vn-bar-fill h-full rounded-full" style={{ width: `${b.value}%`, background: b.value >= 65 ? "#6faf3e" : b.value >= 40 ? "#fac540" : "#ed573f" }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Дерево решений */}
                    <div className="rounded-2xl border border-white/10 bg-[#0c1422]/70 p-4">
                        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-white/55">Дерево решений</h3>
                        <DecisionTree decisions={dayDecisions} />
                    </div>
                </div>

                {/* Ачивки */}
                {state.unlocked.length > 0 && (
                    <div className="mt-5 rounded-2xl border border-white/10 bg-[#0c1422]/70 p-4">
                        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-white/55">Собранные ачивки</h3>
                        <div className="flex flex-wrap gap-2">
                            {state.unlocked.map((id) => {
                                const a = ACHIEVEMENTS[id];
                                const good = a.tone === "good";
                                return (
                                    <span key={id} className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold"
                                        style={{ borderColor: good ? "rgba(105,169,63,0.4)" : "rgba(232,76,61,0.4)", color: good ? "#8bc249" : "#ff7a6e", background: good ? "rgba(105,169,63,0.08)" : "rgba(232,76,61,0.08)" }}>
                                        {good ? "🏆" : "⚠️"} {a.title}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                )}

                <button onClick={onContinue} className="mt-7 w-full rounded-xl bg-[#69a93f] py-3.5 text-sm font-bold text-white transition hover:bg-[#5d9737]">
                    {isEnd ? "Итоговый отчёт для HR →" : `Перейти к Дню ${day + 1} →`}
                </button>
            </div>
        </div>
    );
};
