"use client";

import { FC, useMemo } from "react";

import { SCENE_LIST } from "../model/content";
import { dayOf } from "../model/engine";
import { DecisionRecord } from "../model/types";

interface BranchPoint {
    nodeId: string;
    options: { text: string; tone: string }[];
}

export interface FlowOutcome {
    verdict: "clean" | "ok" | "fired";
    label: string;
}

// — палитра как в референсе —
const C = {
    path: "#3b6dfb",
    pathBg: "linear-gradient(180deg,#3b74ff,#2f5fe6)",
    good: "#2ea84f",
    goodBg: "linear-gradient(180deg,#33b657,#239145)",
    fail: "#e84c3d",
    failBg: "linear-gradient(180deg,#ec5a4b,#cf3b2c)",
    line: "rgba(255,255,255,0.13)",
    ghostBg: "rgba(255,255,255,0.025)",
    ghostBorder: "rgba(255,255,255,0.09)",
};

const ROLE: Record<number, string> = { 1: "ДЖУНИОР", 2: "МИДЛ", 3: "СЕНЬОР" };
const TITLE: Record<string, string> = {
    clean: "Уверенное прохождение",
    ok: "Прошёл с недочётами",
    fired: "Сорванный день",
};

// геометрия графа
const COLW = 196, BOXW = 150, BOXH = 54, ROWH = 88, PADX = 56, PADTOP = 16, PADBOT = 8;
const BRANCH_OFFSETS = [1, -1, 2, -2, 3, -3];

function branchPoints(day: number): BranchPoint[] {
    return SCENE_LIST.filter((n) => dayOf(n.id) === day && n.choices?.some((c) => c.tone)).map((n) => ({
        nodeId: n.id,
        options: (n.choices ?? []).map((c) => ({ text: c.text, tone: c.tone ?? "neutral" })),
    }));
}

interface GNode { key: string; col: number; off: number; text: string; chosen: boolean; bad: boolean; kind: "choice" | "outcome"; }

export const Flowchart: FC<{ day: number; decisions: DecisionRecord[]; outcome?: FlowOutcome }> = ({ day, decisions, outcome }) => {
    const points = useMemo(() => branchPoints(day), [day]);
    const chosenByNode = useMemo(() => {
        const m = new Map<string, string>();
        for (const d of decisions) if (d.day === day) m.set(d.nodeId, d.choice);
        return m;
    }, [decisions, day]);

    const layout = useMemo(() => {
        const nodes: GNode[] = [];
        points.forEach((p, c) => {
            const chosenText = chosenByNode.get(p.nodeId);
            const chosenOpt = p.options.find((o) => o.text === chosenText);
            const others = p.options.filter((o) => o.text !== chosenText);
            if (chosenOpt) {
                nodes.push({ key: `${c}-c`, col: c, off: 0, text: chosenOpt.text, chosen: true, bad: chosenOpt.tone === "bad", kind: "choice" });
            }
            others.forEach((o, i) => {
                const off = chosenOpt ? BRANCH_OFFSETS[i] : (i === 0 ? 0 : BRANCH_OFFSETS[i - 1]);
                nodes.push({ key: `${c}-${i}`, col: c, off, text: o.text, chosen: false, bad: false, kind: "choice" });
            });
        });
        const outCol = points.length;
        if (outcome) {
            nodes.push({ key: "outcome", col: outCol, off: 1, text: outcome.label, chosen: outcome.verdict !== "fired", bad: false, kind: "outcome" });
        }

        const maxUp = Math.max(1, ...nodes.map((n) => n.off));
        const maxDown = Math.max(1, ...nodes.map((n) => -n.off));
        const lastCol = outcome ? outCol : points.length - 1;

        const x = (col: number) => PADX + col * COLW;
        const yTop = (off: number) => PADTOP + (maxUp - off) * ROWH;
        const yMid = (off: number) => yTop(off) + BOXH / 2;

        // соединители (ортогональные)
        const paths: { d: string; color: string; w: number }[] = [];
        const spineY = yMid(0);
        for (let c = 0; c < points.length; c++) {
            const cx = x(c);
            const prevRight = c === 0 ? cx - 34 : x(c - 1) + BOXW;
            // спина: горизонталь к выбранному узлу
            paths.push({ d: `M ${prevRight} ${spineY} H ${cx}`, color: C.path, w: 2.5 });
            // ветви к невыбранным
            const fx = cx - 22;
            nodes.filter((n) => n.col === c && n.off !== 0).forEach((n) => {
                paths.push({ d: `M ${fx} ${spineY} V ${yMid(n.off)} H ${cx}`, color: C.line, w: 2 });
            });
        }
        if (outcome) {
            const prevRight = x(points.length - 1) + BOXW;
            const ox = x(outCol);
            const color = outcome.verdict === "fired" ? C.fail : C.good;
            paths.push({ d: `M ${prevRight} ${spineY} H ${ox - 22} V ${yMid(1)} H ${ox}`, color, w: 2.5 });
        }

        const width = x(lastCol) + BOXW + PADX;
        const height = PADTOP + (maxUp + maxDown) * ROWH + BOXH + PADBOT;
        return { nodes, paths, width, height, x, yTop };
    }, [points, chosenByNode, outcome]);

    const taken = layout.nodes.filter((n) => n.chosen).length;
    const total = layout.nodes.length;
    const title = outcome ? TITLE[outcome.verdict] : "Карта решений";

    if (points.length === 0) return <p className="text-sm text-white/40">Развилок не зафиксировано.</p>;

    return (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a1120] to-[#0c1626]">
            {/* шапка */}
            <div className="flex items-start justify-between gap-3 px-5 pb-1 pt-4">
                <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                        Дерево решений · День {day} — {ROLE[day] ?? ""}
                    </div>
                    <div className="text-lg font-extrabold text-white font-nunito">{title}</div>
                </div>
                <div className="shrink-0 text-right">
                    <div className="text-[10px] uppercase tracking-wider text-white/40">Принято решений</div>
                    <div className="text-xl font-extrabold tabular-nums text-white">{taken}<span className="text-sm font-bold text-white/35"> / {total} узлов</span></div>
                </div>
            </div>

            {/* граф со скроллом */}
            <div className="overflow-x-auto px-3 pb-2 [scrollbar-width:thin]">
                <div className="relative" style={{ width: layout.width, height: layout.height }}>
                    {/* водяной знак */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <span className="select-none text-[88px] font-extrabold tracking-[0.2em] text-white/[0.03]">
                            ДЕНЬ_0{day}
                        </span>
                    </div>

                    {/* линии */}
                    <svg className="absolute inset-0" width={layout.width} height={layout.height} fill="none">
                        {layout.paths.map((p, i) => (
                            <path key={i} d={p.d} stroke={p.color} strokeWidth={p.w} strokeLinejoin="round" />
                        ))}
                    </svg>

                    {/* узлы */}
                    {layout.nodes.map((n) => {
                        const isGood = n.kind === "outcome" && n.chosen;
                        const isFail = n.kind === "outcome" && !n.chosen;
                        const bg = isGood ? C.goodBg : isFail ? C.failBg : n.chosen ? C.pathBg : C.ghostBg;
                        const border = isGood ? C.good : isFail ? C.fail : n.chosen ? "rgba(255,255,255,0.35)" : C.ghostBorder;
                        return (
                            <div
                                key={n.key}
                                title={n.text}
                                className="absolute flex items-center justify-center rounded-xl border px-2.5 text-center"
                                style={{
                                    left: layout.x(n.col), top: layout.yTop(n.off), width: BOXW, height: BOXH,
                                    background: bg, borderColor: border,
                                    boxShadow: n.chosen ? "0 6px 16px rgba(0,0,0,0.35)" : "none",
                                }}
                            >
                                {n.bad && <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#ffb4ab]" />}
                                <span className={`line-clamp-2 text-[10px] font-semibold leading-tight ${n.chosen ? "text-white" : "text-white/35"}`}>
                                    {n.text}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* легенда */}
            <div className="flex flex-wrap items-center gap-4 border-t border-white/8 px-5 py-2.5 text-[11px] text-white/55">
                <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm" style={{ background: C.path }} /> Ваш путь</span>
                <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm" style={{ background: C.good }} /> Удачная концовка</span>
                <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm" style={{ background: C.fail }} /> Провал</span>
                <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm border border-white/15" style={{ background: C.ghostBg }} /> Не выбрано</span>
            </div>
        </div>
    );
};
