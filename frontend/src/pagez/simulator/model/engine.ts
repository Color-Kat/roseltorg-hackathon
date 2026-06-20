import { ACHIEVEMENTS } from "./achievements";
import { DAY_START, SCENES, START_NODE } from "./content";
import { clamp, dayVerdict, demoStats, GRADE_BY_DAY, initStats, Verdict } from "./grading";
import {
    CandidateProfile,
    Choice,
    DecisionRecord,
    Effect,
    Grade,
    RunState,
    Stats,
} from "./types";

export const dayOf = (nodeId: string): number => {
    const m = /^d(\d)/.exec(nodeId);
    return m ? Number(m[1]) : 0;
};

const EMPTY_STATS: Stats = { trust: 50, knowledge: 28, application: 28, integrity: 55, soft: 45, stress: 12 };

export function initialState(): RunState {
    return {
        screen: "intro",
        nodeId: START_NODE,
        stats: { ...EMPTY_STATS },
        flags: {},
        grade: "none",
        day: 0,
        decisions: [],
        unlocked: [],
        outcomes: [],
        profile: {
            name: "", gender: "Мужской", age: "", edu: "Иное / среднее",
            exp: "Нет опыта", cert: "Нет", record: "Нет",
            trustScore: 50, trustBreakdown: [],
        },
    };
}

function applyEffects(state: RunState, effects: Effect[] | undefined): string[] {
    if (!effects) return [];
    const justUnlocked: string[] = [];
    for (const e of effects) {
        if (e.stat && typeof e.delta === "number") {
            state.stats[e.stat] = clamp(state.stats[e.stat] + e.delta);
        }
        if (e.flag) {
            if (e.flag.includes(":")) {
                const [k, v] = e.flag.split(":");
                state.flags[k] = Number(v);
            } else {
                state.flags[e.flag] = (state.flags[e.flag] ?? 0) + 1;
            }
        }
        if (e.achievement && ACHIEVEMENTS[e.achievement] && !state.unlocked.includes(e.achievement)) {
            state.unlocked.push(e.achievement);
            justUnlocked.push(e.achievement);
        }
    }
    return justUnlocked;
}

const promptOf = (nodeId: string): string => {
    const node = SCENES[nodeId];
    const lines = node?.lines ?? [];
    const last = lines[lines.length - 1];
    const t = (last?.text ?? "").replace(/^[«»()]/, "").trim();
    return t.length > 110 ? t.slice(0, 107) + "…" : t;
};

/** Чистый расчёт коммита дня — используется и для отображения, и для перехода. */
export function computeDayCommit(state: RunState, day: number): {
    verdict: Verdict;
    newGrade: Grade;
    next: string;
} {
    const verdict = dayVerdict(state, day);
    let newGrade: Grade = state.grade;
    if (day < 3) {
        if (verdict !== "fired") newGrade = GRADE_BY_DAY[day];
    } else if (verdict === "clean") {
        newGrade = "senior";
    }
    let next: string;
    if (day === 3 || verdict === "fired") next = "final";
    else next = day === 1 ? "d2_start" : "d3_start";
    return { verdict, newGrade, next };
}

export type Action =
    | { type: "start" }
    | { type: "startAt"; day: number }
    | { type: "back" }
    | { type: "restart" }
    | { type: "anketaSubmit"; profile: CandidateProfile }
    | { type: "choose"; choice: Choice }
    | { type: "documentDone"; effects: Effect[] }
    | { type: "dayContinue"; day: number };

const DEMO_GRADE: Record<number, Grade> = { 1: "none", 2: "junior", 3: "middle" };

/** Возвращает [новое состояние, только что выданные ачивки]. */
export function reduce(state: RunState, action: Action): [RunState, string[]] {
    const next: RunState = {
        ...state,
        stats: { ...state.stats },
        flags: { ...state.flags },
        decisions: [...state.decisions],
        unlocked: [...state.unlocked],
        outcomes: [...state.outcomes],
    };

    switch (action.type) {
        case "restart":
            return [initialState(), []];

        case "start": {
            next.screen = "playing";
            next.nodeId = START_NODE;
            next.day = dayOf(START_NODE);
            const u = applyEffects(next, SCENES[START_NODE].onEnter);
            return [next, u];
        }

        case "startAt": {
            // Демо-режим: начать ассессмент с любого дня/грейда.
            const target = DAY_START[action.day] ?? START_NODE;
            next.screen = "playing";
            next.stats = demoStats();
            next.grade = DEMO_GRADE[action.day] ?? "none";
            next.profile = { ...next.profile, name: "Демо-кандидат" };
            next.nodeId = target;
            next.day = action.day;
            const u = applyEffects(next, SCENES[target].onEnter);
            return [next, u];
        }

        case "anketaSubmit": {
            next.profile = action.profile;
            next.stats = initStats(action.profile);
            next.nodeId = "d0_after";
            next.day = 0;
            return [next, []];
        }

        case "choose": {
            const fromId = state.nodeId;
            const u = applyEffects(next, action.choice.effects);
            if (action.choice.tone) {
                const rec: DecisionRecord = {
                    day: dayOf(fromId),
                    nodeId: fromId,
                    question: promptOf(fromId),
                    choice: action.choice.text,
                    tone: action.choice.tone,
                    cite: action.choice.cite,
                };
                next.decisions.push(rec);
            }
            next.nodeId = action.choice.goto;
            next.day = dayOf(action.choice.goto);
            const u2 = applyEffects(next, SCENES[action.choice.goto].onEnter);
            return [next, [...u, ...u2]];
        }

        case "documentDone": {
            const u = applyEffects(next, action.effects);
            const target = SCENES[state.nodeId].goto ?? "final";
            next.nodeId = target;
            next.day = dayOf(target);
            const u2 = applyEffects(next, SCENES[target].onEnter);
            return [next, [...u, ...u2]];
        }

        case "dayContinue": {
            const { verdict, newGrade, next: target } = computeDayCommit(state, action.day);
            next.grade = newGrade;
            next.outcomes.push({ day: action.day, verdict, gradeReached: newGrade });
            next.nodeId = target;
            next.day = dayOf(target);
            const u = applyEffects(next, SCENES[target].onEnter);
            return [next, u];
        }

        default:
            return [next, []];
    }
}
