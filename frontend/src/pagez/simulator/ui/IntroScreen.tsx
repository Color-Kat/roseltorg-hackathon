"use client";

import Image from "next/image";
import { FC } from "react";

import { BACKGROUNDS } from "../model/cast";
import { IconCalc, IconCabinet, IconLaw, IconPlay, IconTarget } from "./icons";

const FEATURES = [
    { Icon: IconCalc, title: "Расчёты, а не тест", desc: "НМЦК, обеспечение, шаг аукциона, пени — кандидат считает сам." },
    { Icon: IconLaw, title: "Всё со ссылкой на ФЗ", desc: "Каждое решение раскрывает конкретную норму 44-ФЗ." },
    { Icon: IconTarget, title: "Нелинейный сюжет", desc: "Решения меняют характеристики и итоговый грейд." },
    { Icon: IconCabinet, title: "Отчёт для HR", desc: "Поведенческий портрет и карта решений работодателю." },
];

const DEMO = [
    { day: 1, label: "День 1", grade: "Джуниор" },
    { day: 2, label: "День 2", grade: "Мидл" },
    { day: 3, label: "День 3", grade: "Сеньор" },
];

export const IntroScreen: FC<{ onStart: () => void; onStartAt: (day: number) => void }> = ({ onStart, onStartAt }) => (
    <div className="vn-root relative h-full w-full overflow-y-auto bg-[#0b1422]">
        <Image src={BACKGROUNDS.office} alt="" fill priority className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1422]/70 via-[#0b1422]/88 to-[#0b1422]" />

        <div className="relative mx-auto flex min-h-full max-w-2xl flex-col items-center justify-center px-5 py-10 text-center">
            <span className="mb-4 rounded-full border border-[#69a93f]/40 bg-[#69a93f]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#8bc249]">
                Smolensk Dynamics · Ассессмент-симулятор
            </span>
            <h1 className="text-3xl font-extrabold leading-tight text-white font-nunito sm:text-5xl">
                Симулятор специалиста по гос. закупкам
            </h1>
            <p className="mt-3 max-w-lg text-sm text-white/65 sm:text-base">
                Три рабочих дня — три грейда. Здесь нельзя «списать»: мы проверяем знание
                44-ФЗ, расчёты бюджета и обоснование решений нормой, а не заученную теорию.
            </p>

            <div className="mt-7 grid w-full grid-cols-2 gap-3 text-left">
                {FEATURES.map(({ Icon, title, desc }) => (
                    <div key={title} className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-sm">
                        <Icon className="mb-1.5 text-[#8bc249]" size={22} />
                        <div className="text-sm font-bold text-white">{title}</div>
                        <div className="text-xs text-white/55">{desc}</div>
                    </div>
                ))}
            </div>

            <button
                onClick={onStart}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#69a93f] px-10 py-3.5 text-base font-bold text-white shadow-lg shadow-[#69a93f]/20 transition hover:bg-[#5d9737]"
            >
                <IconPlay size={18} /> Начать с оформления (День 0)
            </button>

            {/* быстрый старт с любого дня — для демонстрации */}
            <div className="mt-6 w-full rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                    Демо: начать сразу с грейда
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {DEMO.map((d) => (
                        <button
                            key={d.day}
                            onClick={() => onStartAt(d.day)}
                            className="rounded-lg border border-white/12 bg-white/[0.04] px-2 py-2 text-center transition hover:border-[#69a93f]/50 hover:bg-[#69a93f]/10"
                        >
                            <div className="text-sm font-bold text-white">{d.label}</div>
                            <div className="text-[11px] text-[#8bc249]">{d.grade}</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
);
