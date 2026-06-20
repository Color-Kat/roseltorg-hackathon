import Link from "next/link";

import { ROUTES } from "@/shared/consts";
import { Logo } from "@/shared/ui/Logo";
import { IconArrow, IconCabinet, IconCalc, IconLaw, IconPlay, IconTarget } from "@/pagez/simulator/ui/icons";

const FEATURES = [
    { Icon: IconCalc, text: "Расчёты НМЦК, обеспечения, пеней" },
    { Icon: IconLaw, text: "Каждое решение — со ссылкой на 44-ФЗ" },
    { Icon: IconTarget, text: "Нелинейный сюжет и грейд по итогу" },
];

export const HomePage = () => {
    return (
        <main className="relative min-h-dvh overflow-hidden bg-[#0b1422]">
            <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(105,169,63,0.16),transparent_55%)]" />

            <div className="relative mx-auto flex min-h-dvh max-w-4xl flex-col items-center justify-center px-5 py-12">
                <header className="flex flex-col items-center gap-3 text-center">
                    <Logo className="size-14" />
                    <span className="rounded-full border border-[#69a93f]/40 bg-[#69a93f]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#8bc249]">
                        Smolensk Dynamics
                    </span>
                    <h1 className="max-w-2xl text-3xl font-extrabold leading-tight text-white font-nunito sm:text-5xl">
                        Ассессмент специалистов по госзакупкам
                    </h1>
                    <p className="max-w-xl text-sm text-white/60 sm:text-base">
                        Симулятор рабочего процесса вместо теста: проверяем знание 44-ФЗ,
                        расчёты бюджета и поведение в сложных ситуациях.
                    </p>
                </header>

                <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
                    {/* Кандидат — симулятор */}
                    <Link
                        href={ROUTES.SIMULATOR}
                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#69a93f]/40 bg-gradient-to-br from-[#69a93f]/[0.12] to-[#10203a] p-6 text-left transition hover:border-[#69a93f]/70"
                    >
                        <span className="flex size-12 items-center justify-center rounded-xl bg-[#69a93f]/20 text-[#8bc249]">
                            <IconPlay size={26} />
                        </span>
                        <div className="mt-4 text-[11px] font-bold uppercase tracking-wider text-white/40">Для кандидата</div>
                        <h2 className="text-2xl font-extrabold text-white font-nunito">Пройти ассессмент</h2>
                        <p className="mt-1 flex-1 text-sm text-white/60">
                            Три рабочих дня — три грейда. Нелинейный сюжет, ачивки и отчёт для HR.
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#8bc249] transition group-hover:gap-2.5">
                            Начать <IconArrow size={16} />
                        </span>
                    </Link>

                    {/* HR — кабинет */}
                    <Link
                        href={ROUTES.CABINET}
                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-br from-white/[0.06] to-[#10203a] p-6 text-left transition hover:border-white/30"
                    >
                        <span className="flex size-12 items-center justify-center rounded-xl bg-white/10 text-white/80">
                            <IconCabinet size={24} />
                        </span>
                        <div className="mt-4 text-[11px] font-bold uppercase tracking-wider text-white/40">Для работодателя</div>
                        <h2 className="text-2xl font-extrabold text-white font-nunito">Кабинет работодателя</h2>
                        <p className="mt-1 flex-1 text-sm text-white/60">
                            Результаты ассессментов: грейд, профиль компетенций, карта решений, комплаенс-риски.
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-white/80 transition group-hover:gap-2.5">
                            Открыть <IconArrow size={16} />
                        </span>
                    </Link>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                    {FEATURES.map(({ Icon, text }) => (
                        <span key={text} className="inline-flex items-center gap-2 text-xs text-white/45">
                            <Icon size={15} className="text-[#8bc249]" /> {text}
                        </span>
                    ))}
                </div>
            </div>
        </main>
    );
};
