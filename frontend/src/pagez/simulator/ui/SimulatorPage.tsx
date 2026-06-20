"use client";

import { ReactNode, useEffect, useMemo, useReducer, useState } from "react";

import "./simulator.scss";

import { SCENES } from "../model/content";
import { DOCUMENTS } from "../model/documents";
import { Action, initialState, reduce } from "../model/engine";
import { Choice, Citation, RunState, SpriteSlot } from "../model/types";

import { AchievementToasts } from "./AchievementToast";
import { AnketaScreen } from "./AnketaScreen";
import { DayResult } from "./DayResult";
import { DocumentReview } from "./DocumentReview";
import { FinalReport } from "./FinalReport";
import { IntroScreen } from "./IntroScreen";
import { StatsHUD } from "./StatsHUD";
import { VNStage } from "./VNStage";

interface RootState {
    run: RunState;
    toast: string[];
}

function rootReducer(s: RootState, action: Action): RootState {
    const [run, unlocked] = reduce(s.run, action);
    return { run, toast: unlocked };
}

/** Эффективная сцена: последняя заданная композиция спрайтов до текущей реплики. */
function stageUpTo(nodeId: string, lineIndex: number): SpriteSlot[] {
    const lines = SCENES[nodeId]?.lines ?? [];
    let stage: SpriteSlot[] = [];
    for (let i = 0; i <= Math.min(lineIndex, lines.length - 1); i++) {
        if (lines[i]?.stage) stage = lines[i].stage!;
    }
    return stage;
}

export const SimulatorPage = () => {
    const [{ run, toast }, dispatch] = useReducer(rootReducer, undefined, () => ({
        run: initialState(),
        toast: [],
    }));

    const [lineIndex, setLineIndex] = useState(0);
    const [pendingCite, setPendingCite] = useState<{ choice: Choice; cite: Citation } | null>(null);

    const node = SCENES[run.nodeId];
    const lines = node?.lines ?? [];
    const isVN = !node?.kind || node.kind === "dialogue" || node.kind === "intro";

    // сброс шага реплик при смене сцены
    useEffect(() => {
        setLineIndex(0);
        setPendingCite(null);
    }, [run.nodeId]);

    // авто-переход для повествовательных узлов без выбора
    useEffect(() => {
        if (!isVN) return;
        if (lineIndex >= lines.length && !node?.choices && node?.goto) {
            const goto = node.goto;
            const t = setTimeout(() => dispatch({ type: "choose", choice: { text: "", goto } }), 0);
            return () => clearTimeout(t);
        }
    }, [isVN, lineIndex, lines.length, node]);

    const stage = useMemo(() => stageUpTo(run.nodeId, lineIndex), [run.nodeId, lineIndex]);

    // --- спец-экраны ---
    if (run.screen === "intro") {
        return (
            <Frame>
                <IntroScreen onStart={() => dispatch({ type: "start" })} />
            </Frame>
        );
    }

    if (node?.kind === "anketa") {
        return (
            <Frame>
                <AnketaScreen onSubmit={(profile) => dispatch({ type: "anketaSubmit", profile })} />
            </Frame>
        );
    }

    if (node?.kind === "document") {
        return (
            <Frame>
                <StatsHUD stats={run.stats} grade={run.grade} day={run.day} />
                <DocumentReview
                    doc={DOCUMENTS[node.payload ?? "machines"]}
                    onComplete={(effects) => dispatch({ type: "documentDone", effects })}
                />
                <AchievementToasts queue={toast} />
            </Frame>
        );
    }

    if (node?.kind === "dayResult") {
        const day = Number(node.payload);
        return (
            <Frame>
                <DayResult state={run} day={day} onContinue={() => dispatch({ type: "dayContinue", day })} />
            </Frame>
        );
    }

    if (node?.kind === "final") {
        return (
            <Frame>
                <FinalReport state={run} onRestart={() => dispatch({ type: "restart" })} />
            </Frame>
        );
    }

    // --- обычная сцена ВН ---
    const showChoices = lineIndex >= lines.length && !!node?.choices;
    const currentLine = lineIndex < lines.length ? lines[lineIndex] : lines[lines.length - 1] ?? null;
    const canAdvance = lineIndex < lines.length;

    const onChoose = (c: Choice) => {
        if (c.cite) setPendingCite({ choice: c, cite: c.cite });
        else dispatch({ type: "choose", choice: c });
    };

    return (
        <Frame>
            <StatsHUD stats={run.stats} grade={run.grade} day={run.day} />
            <VNStage
                bg={node?.bg ?? "office"}
                stage={stage}
                line={currentLine}
                showChoices={showChoices}
                choices={node?.choices ?? []}
                canAdvance={canAdvance}
                onAdvance={() => setLineIndex((i) => i + 1)}
                onChoose={onChoose}
            />
            <AchievementToasts queue={toast} />

            {pendingCite && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => { dispatch({ type: "choose", choice: pendingCite.choice }); setPendingCite(null); }}>
                    <div className="vn-fade-up w-full max-w-md rounded-2xl border border-[#69a93f]/40 bg-[#0c1422] p-5" onClick={(e) => e.stopPropagation()}>
                        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#8bc249]">
                            📖 {pendingCite.cite.law} {pendingCite.cite.ref}
                        </div>
                        <p className="text-sm text-white/80">{pendingCite.cite.note}</p>
                        <button
                            onClick={() => { dispatch({ type: "choose", choice: pendingCite.choice }); setPendingCite(null); }}
                            className="mt-4 w-full rounded-xl bg-[#69a93f] py-2.5 text-sm font-bold text-white transition hover:bg-[#5d9737]"
                        >
                            Дальше →
                        </button>
                    </div>
                </div>
            )}
        </Frame>
    );
};

/** Полноэкранная рамка симулятора (кинематографичный 16:9 на десктопе). */
const Frame = ({ children }: { children: ReactNode }) => (
    <main className="flex min-h-dvh w-full items-center justify-center bg-[#070d18] p-0 sm:p-4">
        <div className="relative aspect-auto h-dvh w-full overflow-hidden bg-[#0b1422] sm:aspect-video sm:h-auto sm:max-h-[92dvh] sm:max-w-[1180px] sm:rounded-2xl sm:border sm:border-white/10 sm:shadow-2xl">
            {children}
        </div>
    </main>
);
