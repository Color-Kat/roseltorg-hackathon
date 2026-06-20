import { CandidateProfile, DecisionRecord, Grade, RunState, Stats } from "./types";

/**
 * Все характеристики живут в шкале 0–100 — так их можно показывать игроку
 * вживую (HUD) и в финальном отчёте без пересчёта. stress инвертируется в
 * «стрессоустойчивость» только при выводе.
 */
export const STAT_LABELS: Record<keyof Stats, string> = {
    trust: "Доверие",
    knowledge: "Знание базы",
    application: "Эффективность",
    integrity: "Честность",
    soft: "Софт-скиллы",
    stress: "Стресс",
};

export const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/** Расчёт стартового доверия и базовых характеристик по анкете (День 0). */
export function profileFromAnketa(raw: Omit<CandidateProfile, "trustScore" | "trustBreakdown">): CandidateProfile {
    const breakdown: { label: string; delta: number }[] = [];
    let trust = 50;
    let knowledge = 28;
    let application = 28;

    const add = (label: string, d: number) => {
        breakdown.push({ label, delta: d });
        trust += d;
    };

    if (raw.edu === "Юридическое") { add("Юридическое образование", 8); knowledge += 14; }
    else if (raw.edu === "Экономическое / в сфере закупок") { add("Профильное образование", 6); knowledge += 10; }
    else if (raw.edu === "Техническое") { add("Техническое образование", 3); knowledge += 4; }

    if (raw.exp === "Более 3 лет") { add("Опыт более 3 лет", 8); application += 18; knowledge += 6; }
    else if (raw.exp === "1–3 года") { add("Опыт 1–3 года", 5); application += 12; knowledge += 3; }
    else if (raw.exp === "До 1 года") { add("Опыт до 1 года", 2); application += 6; }

    if (raw.cert === "Да") { add("Сертификат по 44-ФЗ", 5); knowledge += 8; }
    if (raw.record === "Да") { add("Судимость в анамнезе", -18); }

    return {
        ...raw,
        trustScore: clamp(trust),
        trustBreakdown: breakdown,
        knowledge: clamp(knowledge),
        application: clamp(application),
    } as CandidateProfile & { knowledge: number; application: number };
}

export function initStats(profile: CandidateProfile): Stats {
    // knowledge/application приходят из анкеты (см. profileFromAnketa), но
    // храним их отдельно, чтобы не «протекали» в CandidateProfile-тип.
    const p = profile as CandidateProfile & { knowledge?: number; application?: number };
    return {
        trust: profile.trustScore,
        knowledge: clamp(p.knowledge ?? 28),
        application: clamp(p.application ?? 28),
        integrity: 55,
        soft: 45,
        stress: 12,
    };
}

export type Verdict = "clean" | "ok" | "fired";

const badDecisions = (decisions: DecisionRecord[], day: number) =>
    decisions.filter((d) => d.day === day && d.tone === "bad").length;

/**
 * Вердикт по итогам дня. День 3 решается асфальтовой дилеммой (flag asphalt),
 * остальные дни — порогами характеристик + числом «красных» решений.
 */
export function dayVerdict(state: RunState, day: number): Verdict {
    const { stats, decisions, flags } = state;

    if (day === 3) {
        const a = flags.asphalt ?? 0;
        if (a === 2) return "clean";   // приняли, уложили по регламенту (5 см) → сеньор
        if (a === 3) return "ok";      // отказались, сорвали срок → мидл+
        return "fired";                // уложили заниженным слоем (4 см) → хищение
    }

    const bad = badDecisions(decisions, day);
    if (bad >= 2 || stats.integrity < 30 || stats.trust <= 5) return "fired";
    if (stats.knowledge >= 60 && stats.integrity >= 60 && stats.application >= 55) return "clean";
    if (stats.knowledge >= 45 && stats.integrity >= 45) return "ok";
    return "fired";
}

export const GRADE_BY_DAY: Record<number, Grade> = { 1: "junior", 2: "middle", 3: "senior" };

export const GRADE_LABEL: Record<Grade, string> = {
    none: "Не подтверждён",
    junior: "Джуниор",
    middle: "Мидл",
    senior: "Сеньор",
};

export const GRADE_SUB: Record<Grade, string> = {
    none: "ниже стажёра",
    junior: "стажёр-специалист",
    middle: "самостоятельный специалист",
    senior: "ведущий эксперт",
};

/** Финальная агрегированная оценка (для отчёта HR). */
export function finalScore(stats: Stats) {
    const resilience = 100 - stats.stress;
    const avg = Math.round(
        (stats.knowledge + stats.application + stats.integrity + stats.soft + resilience) / 5,
    );
    return { resilience, avg };
}

export interface ReportBar {
    key: string;
    label: string;
    value: number;
}

export function reportBars(stats: Stats): ReportBar[] {
    return [
        { key: "knowledge", label: "Знание нормативной базы", value: stats.knowledge },
        { key: "application", label: "Эффективность действий", value: stats.application },
        { key: "integrity", label: "Честность / комплаенс", value: stats.integrity },
        { key: "soft", label: "Софт-скиллы", value: stats.soft },
        { key: "resilience", label: "Стрессоустойчивость", value: 100 - stats.stress },
        { key: "trust", label: "Доверие", value: stats.trust },
    ];
}
