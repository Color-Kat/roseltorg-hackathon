/**
 * Доменная модель симулятора-ассессмента «Контрактный управляющий».
 *
 * Сюжет описан данными (граф сцен), движок — чистый редьюсер. Это позволяет
 * собирать новые сценарии под любую доменную область через конструктор,
 * не трогая UI (ключевая часть B2B-ценности продукта).
 */

/** Измеримые характеристики кандидата. Накапливаются по ходу прохождения. */
export type StatKey =
    | "trust"        // Доверие к человеку
    | "knowledge"    // Знание нормативной базы
    | "application"  // Эффективность / корректность действий
    | "integrity"    // Честность, антикоррупционная устойчивость
    | "soft"         // Софт-скиллы (коммуникация, эмпатия, командность)
    | "stress";      // Накопленный стресс (меньше — лучше; в отчёте инвертируется)

export type Stats = Record<StatKey, number>;

/** Грейды, которые подтверждает прохождение дней. */
export type Grade = "none" | "junior" | "middle" | "senior";

/** Действующие лица и их спрайты. */
export type SpeakerId = "player" | "narrator" | "alla" | "krotov" | "tolik" | "eduard";

export type SpritePose =
    | "krotov"
    | "krotov_task"
    | "krotov_angry"
    | "tolik"
    | "tolik_panic"
    | "eduard";

export type SpritePos = "left" | "center" | "right";

/** Кто стоит на сцене во время реплики. null-элемент убирает позицию. */
export interface SpriteSlot {
    pose: SpritePose;
    pos: SpritePos;
    /** Затемнить (не говорит сейчас). */
    dim?: boolean;
}

/** Один эффект выбора: изменить характеристику, поднять флаг, выдать ачивку. */
export interface Effect {
    stat?: StatKey;
    delta?: number;
    /** Технический флаг (нарушение комплаенса, особый путь сюжета). */
    flag?: string;
    /** Идентификатор ачивки из achievements.ts. */
    achievement?: string;
}

/** Реплика диалога. speaker отсутствует => закадровое повествование. */
export interface Line {
    speaker?: SpeakerId;
    /** Подпись говорящего, если нужно переопределить дефолт (например, «???»). */
    nameOverride?: string;
    text: string;
    /** Состояние сцены на момент реплики. Если не задано — сохраняется прежнее. */
    stage?: SpriteSlot[];
}

/** Вариант выбора игрока. */
export interface Choice {
    text: string;
    goto: string;
    effects?: Effect[];
    /** Короткая правовая сноска, раскрываемая после выбора (статья + суть). */
    cite?: Citation;
    /** Доступен только при выполнении условия (например, юр. образование). */
    requiresFlag?: string;
    /** Помечает выбор как «коррупционный/неверный» для разбора в дереве решений. */
    tone?: "good" | "bad" | "neutral";
}

/** Ссылка на источник — обязательное требование задачи (статья + раздел). */
export interface Citation {
    law: string;   // напр. "44-ФЗ"
    ref: string;   // напр. "ст. 33 ч. 1 п. 1"
    note: string;  // суть нормы человеческим языком
}

export type ScreenKind =
    | "intro"        // титульный экран запуска
    | "anketa"       // День 0 — анкета кандидата
    | "dialogue"     // обычная сцена ВН
    | "document"     // механика «найди нарушения в документе»
    | "dayResult"    // итог дня: дерево решений + грейд
    | "final";       // финальный отчёт для HR

export interface SceneNode {
    id: string;
    kind?: ScreenKind;           // по умолчанию "dialogue"
    bg?: string;                 // ключ фона (см. BACKGROUNDS)
    /** Эффекты, применяемые при входе в сцену. */
    onEnter?: Effect[];
    lines?: Line[];
    choices?: Choice[];
    /** Автопереход (для повествовательных узлов без выбора). */
    goto?: string;
    /** Параметр для спец-экранов (document: id документа; dayResult: номер дня). */
    payload?: string;
}

/** Запись в дереве решений, копится по ходу прохождения. */
export interface DecisionRecord {
    day: number;
    nodeId: string;
    question: string;
    choice: string;
    tone: "good" | "bad" | "neutral";
    cite?: Citation;
}

export interface Achievement {
    id: string;
    title: string;
    desc: string;
    tone: "good" | "bad";
    /** Текст «пуша», как в задаче: похвала HR / «начальство заметило». */
    push: string;
}

export interface DayOutcome {
    day: number;
    verdict: "clean" | "ok" | "fired";
    gradeReached: Grade;
}

/** Полный снимок состояния прохождения. */
export interface RunState {
    screen: "intro" | "playing";
    nodeId: string;
    stats: Stats;
    flags: Record<string, number>;
    grade: Grade;
    day: number;
    decisions: DecisionRecord[];
    unlocked: string[];          // id выданных ачивок (в порядке получения)
    outcomes: DayOutcome[];
    profile: CandidateProfile;
}

export interface CandidateProfile {
    name: string;
    gender: string;
    age: string;
    edu: string;
    exp: string;
    cert: string;
    record: string;
    trustScore: number;          // итог расчёта анкеты (Доверие, стартовое)
    trustBreakdown: { label: string; delta: number }[];
}
