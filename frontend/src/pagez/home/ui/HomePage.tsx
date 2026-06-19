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
