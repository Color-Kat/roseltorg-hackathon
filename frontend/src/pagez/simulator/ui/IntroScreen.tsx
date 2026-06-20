"use client";

import Image from "next/image";
import { FC } from "react";
import { BACKGROUNDS } from "../model/cast";

const FEATURES = [
    { icon: "🎭", title: "Симулятор, а не тест", desc: "Проверяем не заученную теорию, а действия в сложных ситуациях." },
    { icon: "🌿", title: "Нелинейный сюжет", desc: "Каждое решение меняет характеристики и финальный грейд." },
    { icon: "🏆", title: "Ачивки и портрет", desc: "Ключевые решения собирают поведенческий профиль для HR." },
    { icon: "⚖️", title: "Всё со ссылкой на закон", desc: "Ошибки раскрываются с конкретной статьёй 44-ФЗ." },
];

export const IntroScreen: FC<{ onStart: () => void }> = ({ onStart }) => (
    <div className="vn-root relative h-full w-full overflow-y-auto bg-[#0b1422]">
        <Image src={BACKGROUNDS.office} alt="" fill priority className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1422]/70 via-[#0b1422]/85 to-[#0b1422]" />

        <div className="relative mx-auto flex min-h-full max-w-2xl flex-col items-center justify-center px-5 py-12 text-center">
            <span className="mb-4 rounded-full border border-[#69a93f]/40 bg-[#69a93f]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#8bc249]">
                SMolensk Dynamics · Ассессмент-симулятор
            </span>
            <h1 className="text-4xl font-extrabold leading-tight text-white font-nunito sm:text-5xl">
                Контрактный управляющий
            </h1>
            <p className="mt-3 max-w-lg text-base text-white/65">
                Три рабочих дня — три грейда. Пройдёте первый день — джуниор, второй — мидл,
                третий — сеньор. Здесь нельзя «списать»: мы проверяем софт-скиллы и готовность
                отвечать за свои решения.
            </p>

            <div className="mt-8 grid w-full grid-cols-1 gap-3 text-left sm:grid-cols-2">
                {FEATURES.map((f) => (
                    <div key={f.title} className="rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                        <div className="mb-1 text-2xl">{f.icon}</div>
                        <div className="text-sm font-bold text-white">{f.title}</div>
                        <div className="text-xs text-white/55">{f.desc}</div>
                    </div>
                ))}
            </div>

            <button
                onClick={onStart}
                className="mt-9 rounded-xl bg-[#69a93f] px-10 py-3.5 text-base font-bold text-white shadow-lg shadow-[#69a93f]/20 transition hover:bg-[#5d9737]"
            >
                Начать рабочий день
            </button>
            <p className="mt-3 text-xs text-white/35">Прохождение займёт ~10 минут. Отвечайте, как в реальной работе.</p>
        </div>
    </div>
);
