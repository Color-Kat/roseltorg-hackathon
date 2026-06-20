import Link from "next/link";

import { ROUTES } from "@/shared/consts";
import { Logo } from "@/shared/ui/Logo";
import { AuthStatus } from "./AuthStatus";
import { ItemsDemo } from "./ItemsDemo";

const STACK = [
    "Next.js (App Router)",
    "React + TypeScript",
    "MobX",
    "React Query",
    "Tailwind CSS + SCSS",
    "HeroUI",
    "FastAPI + SQLAlchemy + Postgres",
];

/**
 * Template landing page. It exists to show the stack is wired end-to-end —
 * replace it with your own home page.
 */
export const HomePage = () => {
    return (
        <main className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center gap-8 px-4 py-12">
            <header className="flex flex-col items-center gap-3 text-center">
                <Logo className="size-16" />
                <h1 className="text-3xl font-extrabold font-nunito">Hackathon Template</h1>
                <p className="text-default-500">
                    Frontend and backend are wired and ready. Start building.
                </p>
            </header>

            <Link
                href={ROUTES.SIMULATOR}
                className="group relative w-full overflow-hidden rounded-2xl border border-primary-green/30 bg-gradient-to-br from-[#0b1422] to-[#10203a] p-6 text-left transition hover:border-primary-green/60"
            >
                <span className="mb-2 inline-block rounded-full border border-primary-green/40 bg-primary-green/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8bc249]">
                    SMolensk Dynamics · Флагман
                </span>
                <h2 className="text-2xl font-extrabold text-white font-nunito">
                    Симулятор закупщика 44-ФЗ
                </h2>
                <p className="mt-1 text-sm text-white/60">
                    Ассессмент грейда через визуальную новеллу: три рабочих дня, нелинейный
                    сюжет, ачивки и отчёт для HR. Не тест, а симулятор работы.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#8bc249] transition group-hover:gap-2">
                    Запустить ассессмент →
                </span>
            </Link>

            <Link
                href={ROUTES.CABINET}
                className="-mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-default-500 transition hover:text-primary-green"
            >
                Кабинет работодателя — результаты ассессментов →
            </Link>

            <section className="flex flex-wrap justify-center gap-2">
                {STACK.map((tech) => (
                    <span
                        key={tech}
                        className="rounded-full bg-default-100 px-3 py-1 text-xs text-default-600"
                    >
                        {tech}
                    </span>
                ))}
            </section>

            <AuthStatus />
            <ItemsDemo />

            <footer className="text-center text-xs text-default-400">
                API docs:{" "}
                <a
                    className="underline"
                    href={`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}/docs`}
                    target="_blank"
                    rel="noreferrer"
                >
                    Swagger UI
                </a>
            </footer>
        </main>
    );
};
