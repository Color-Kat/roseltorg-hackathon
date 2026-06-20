"use client";

import { ReactNode, useEffect, useMemo, useReducer, useState } from "react";

import "./simulator.scss";

import { CALC_TASKS } from "../model/calc";
import { SCENES } from "../model/content";
import { DOCUMENTS } from "../model/documents";
import { Action, initialState, reduce } from "../model/engine";
import { Choice, Citation, RunState, SpriteSlot } from "../model/types";

import { AchievementReveal } from "./AchievementReveal";
import { AnketaScreen } from "./AnketaScreen";
import { CalcScreen } from "./CalcScreen";
import { DayResult } from "./DayResult";
import { DocumentReview } from "./DocumentReview";
import { FinalReport } from "./FinalReport";
import { IconBack, IconLaw, IconPlay } from "./icons";
import { IntroScreen } from "./IntroScreen";
import { StatsHUD } from "./StatsHUD";
import { VNStage } from "./VNStage";

interface RootState {
    run: RunState;
    history: RunState[];
    toast: string[];
}

function rootReducer(s: RootState, action: Action): RootState {
    if (action.type === "back") {
        if (s.history.length === 0) return s;
        return { run: s.history[s.history.length - 1], history: s.history.slice(0, -1), toast: [] };
    }
    const [run, unlocked] = reduce(s.run, action);
    const history = action.type === "restart" ? [] : [...s.history, s.run].slice(-60);
    return { run, history, toast: unlocked };
}

function stageUpTo(nodeId: string, lineIndex: number): SpriteSlot[] {
    const lines = SCENES[nodeId]?.lines ?? [];
    let stage: SpriteSlot[] = [];
    for (let i = 0; i <= Math.min(lineIndex, lines.length - 1); i++) {
        if (lines[i]?.stage) stage = lines[i].stage!;
    }
    return stage;
}

export const SimulatorPage = () => {
    const [{ run, history, toast }, dispatch] = useReducer(rootReducer, undefined, () => ({
        run: initialState(),
        history: [],
        toast: [],
    }));

    const [lineIndex, setLineIndex] = useState(0);
    const [pendingCite, setPendingCite] = useState<{ choice: Choice; cite: Citation } | null>(null);
    const [reveal, setReveal] = useState<string[]>([]);

    const node = SCENES[run.nodeId];
    const lines = node?.lines ?? [];
    const isVN = !node?.kind || node.kind === "dialogue" || node.kind === "intro";
    const modalOpen = !!pendingCite || reveal.length > 0;

    useEffect(() => { setLineIndex(0); setPendingCite(null); }, [run.nodeId]);

    // показать ачивки до перехода к следующему слайду
    useEffect(() => { if (toast.length > 0) setReveal(toast); }, [toast]);

    // авто-переход для повествовательных узлов без выбора
    useEffect(() => {
        if (!isVN || modalOpen) return;
        if (lineIndex >= lines.length && !node?.choices && node?.goto) {
            const goto = node.goto;
            const t = setTimeout(() => dispatch({ type: "choose", choice: { text: "", goto } }), 0);
            return () => clearTimeout(t);
        }
    }, [isVN, modalOpen, lineIndex, lines.length, node]);

    const stage = useMemo(() => stageUpTo(run.nodeId, lineIndex), [run.nodeId, lineIndex]);

    const canBack = run.screen === "playing" && node?.kind !== "final" && (lineIndex > 0 || history.length > 0);
    const onBack = () => {
        if (modalOpen) return;
        if (isVN && lineIndex > 0) setLineIndex((i) => i - 1);
        else dispatch({ type: "back" });
    };

    // ---------- спец-экраны ----------
    if (run.screen === "intro") {
        return <Frame><IntroScreen onStart={() => dispatch({ type: "start" })} onStartAt={(day) => dispatch({ type: "startAt", day })} /></Frame>;
    }

    const controls = (
        <>
            <StatsHUD stats={run.stats} grade={run.grade} day={run.day} />
            {canBack && (
                <button onClick={onBack} className="absolute left-3 top-16 z-30 flex items-center gap-1 rounded-lg border border-white/12 bg-[#0c1422]/80 px-2.5 py-1.5 text-xs font-semibold text-white/70 backdrop-blur-md transition hover:bg-[#0c1422] hover:text-white sm:top-20">
                    <IconBack size={14} /> Назад
                </button>
            )}
            {reveal.length > 0 && <AchievementReveal ids={reveal} onClose={() => setReveal([])} />}
        </>
    );

    if (node?.kind === "anketa") {
        return <Frame><AnketaScreen onSubmit={(profile) => dispatch({ type: "anketaSubmit", profile })} /></Frame>;
    }

    if (node?.kind === "calc") {
        return (
            <Frame>
                {controls}
                <CalcScreen task={CALC_TASKS[node.payload ?? "nmck"]} onComplete={(effects) => dispatch({ type: "documentDone", effects })} />
            </Frame>
        );
    }

    if (node?.kind === "document") {
        return (
            <Frame>
                {controls}
                <DocumentReview doc={DOCUMENTS[node.payload ?? "machines"]} onComplete={(effects) => dispatch({ type: "documentDone", effects })} />
            </Frame>
        );
    }

    if (node?.kind === "dayResult") {
        const day = Number(node.payload);
        return <Frame><DayResult state={run} day={day} onContinue={() => dispatch({ type: "dayContinue", day })} /></Frame>;
    }

    if (node?.kind === "final") {
        return <Frame><FinalReport state={run} onRestart={() => dispatch({ type: "restart" })} /></Frame>;
    }

    // ---------- обычная сцена ВН ----------
    const showChoices = lineIndex >= lines.length && !!node?.choices && !modalOpen;
    const currentLine = lineIndex < lines.length ? lines[lineIndex] : lines[lines.length - 1] ?? null;
    const canAdvance = lineIndex < lines.length && !modalOpen;

    const onChoose = (c: Choice) => {
        if (c.cite) setPendingCite({ choice: c, cite: c.cite });
        else dispatch({ type: "choose", choice: c });
    };

    const confirmCite = () => {
        if (!pendingCite) return;
        dispatch({ type: "choose", choice: pendingCite.choice });
        setPendingCite(null);
    };

    return (
        <Frame>
            {controls}
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

            {pendingCite && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm" onClick={confirmCite}>
                    <div className="vn-fade-up w-full max-w-md rounded-2xl border border-[#69a93f]/40 bg-[#0c1422] p-5" onClick={(e) => e.stopPropagation()}>
                        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#8bc249]">
                            <IconLaw size={16} /> {pendingCite.cite.law} {pendingCite.cite.ref}
                        </div>
                        <p className="text-sm text-white/80">{pendingCite.cite.note}</p>
                        <button onClick={confirmCite} className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#69a93f] py-2.5 text-sm font-bold text-white transition hover:bg-[#5d9737]">
                            <IconPlay size={14} /> Дальше
                        </button>
                    </div>
                </div>
            )}
        </Frame>
    );
};

/** Полноэкранная рамка симулятора — минимум чёрных полей. */
const Frame = ({ children }: { children: ReactNode }) => (
    <main className="h-dvh w-full bg-[#070d18]">
        <div className="relative mx-auto h-full w-full max-w-[1600px] overflow-hidden bg-[#0b1422]">
            {children}
        </div>
    </main>
);
