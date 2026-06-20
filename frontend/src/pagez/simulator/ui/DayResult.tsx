"use client";

import { FC } from "react";

import { ACHIEVEMENTS } from "../model/achievements";
import { computeDayCommit } from "../model/engine";
import { GRADE_LABEL, reportBars } from "../model/grading";
import { RunState } from "../model/types";
import { Flowchart } from "./Flowchart";
import { IconArrow, IconBad, IconFail, IconGood, IconPass } from "./icons";

const FLAVOR: Record<number, Record<string, { quote: string; head: string }>> = {
    1: {
        clean: { head: "Грейд «Джуниор» подтверждён", quote: "«Не идеально, но голова варит. Завтра дам что посложнее.»" },
        ok: { head: "Прошли с недочётами", quote: "«Сойдёт. Пока. Но ещё раз так лопухнёшься — будешь котельные считать.»" },
        fired: { head: "Вы уволены", quote: "«Не, не моё. Не сработаемся мы с тобой.»" },
    },
    2: {
        clean: { head: "Грейд «Мидл» подтверждён", quote: "«А ты растёшь. На Эдуарда не повёлся. Завтра — ФАС.»" },
        ok: { head: "Прошли с недочётами", quote: "«Ну, тянешь. Местами сыро, но контракт живой.»" },
        fired: { head: "Вы уволены", quote: "«Я думал, у тебя стержень есть. Ошибся. Свободен.»" },
    },
    3: {
        clean: { head: "Грейд «Сеньор» подтверждён", quote: "«За тридцать лет таких по пальцам. Добро пожаловать в команду.»" },
        ok: { head: "Мидл с плюсом", quote: "«По закону — не подкопаешься. Но дорога нужна была людям сейчас.»" },
        fired: { head: "Контракт расторгнут", quote: "«Это уже не выговор. Это статья. Мы расстаёмся.»" },
    },
};

const VERDICT_COLOR: Record<string, string> = { clean: "#69a93f", ok: "#f5a524", fired: "#e84c3d" };

export const DayResult: FC<{ state: RunState; day: number; onContinue: () => void }> = ({ state, day, onContinue }) => {
    const { verdict, newGrade } = computeDayCommit(state, day);
    const flavor = FLAVOR[day][verdict];
    const color = VERDICT_COLOR[verdict];
    const bars = reportBars(state.stats);
    const isEnd = verdict === "fired" || day === 3;
    const Mark = verdict === "fired" ? IconFail : IconPass;

    return (
        <div className="vn-root h-full w-full overflow-y-auto bg-gradient-to-br from-[#0b1422] to-[#10203a]">
            <div className="mx-auto max-w-4xl px-4 py-7 sm:px-6">
                <div className="vn-fade-up mb-5 text-center">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Итог дня {day}</div>
                    <div className="mt-2 inline-flex items-center gap-2">
                        <Mark size={26} style={{ color }} />
                        <h2 className="text-2xl font-extrabold font-nunito sm:text-3xl" style={{ color }}>{flavor.head}</h2>
                    </div>
                    <p className="mx-auto mt-2 max-w-xl text-sm italic text-white/65">{flavor.quote}</p>
                    <div className="mt-3 inline-block rounded-xl border px-5 py-2" style={{ borderColor: `${color}66`, background: `${color}14` }}>
                        <span className="text-[10px] uppercase tracking-wider text-white/45">Грейд: </span>
                        <span className="text-base font-extrabold" style={{ color }}>{GRADE_LABEL[newGrade]}</span>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
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

                    <div className="rounded-2xl border border-white/10 bg-[#0c1422]/70 p-4">
                        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-white/55">Карта решений дня</h3>
                        <Flowchart day={day} decisions={state.decisions} />
                    </div>
                </div>

                {state.unlocked.length > 0 && (
                    <div className="mt-4 rounded-2xl border border-white/10 bg-[#0c1422]/70 p-4">
                        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-white/55">Собранные ачивки</h3>
                        <div className="flex flex-wrap gap-2">
                            {state.unlocked.map((id) => {
                                const a = ACHIEVEMENTS[id];
                                const good = a.tone === "good";
                                return (
                                    <span key={id} className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold"
                                        style={{ borderColor: good ? "rgba(105,169,63,0.4)" : "rgba(232,76,61,0.4)", color: good ? "#8bc249" : "#ff7a6e", background: good ? "rgba(105,169,63,0.08)" : "rgba(232,76,61,0.08)" }}>
                                        {good ? <IconGood size={13} /> : <IconBad size={13} />} {a.title}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                )}

                <button onClick={onContinue} className="mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#69a93f] py-3.5 text-sm font-bold text-white transition hover:bg-[#5d9737]">
                    {isEnd ? "Итоговый отчёт для HR" : `Перейти к Дню ${day + 1}`} <IconArrow size={16} />
                </button>
            </div>
        </div>
    );
};
