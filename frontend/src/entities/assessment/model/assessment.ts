/** Результат прохождения симулятора-ассессмента (см. backend assessments). */
export interface AssessmentDecision {
    day: number;
    question: string;
    choice: string;
    tone: "good" | "bad" | "neutral";
    cite?: { law: string; ref: string; note: string };
}

export interface AssessmentAchievement {
    id: string;
    title: string;
    tone: "good" | "bad";
    desc: string;
}

export interface AssessmentCreate {
    candidate_name: string;
    grade: string;
    grade_label: string;
    avg: number;
    compliance: number;
    stats: Record<string, number>;
    decisions: AssessmentDecision[];
    achievements: AssessmentAchievement[];
    profile: Record<string, unknown>;
}

export interface Assessment extends AssessmentCreate {
    id: number;
    created_at: string;
}
