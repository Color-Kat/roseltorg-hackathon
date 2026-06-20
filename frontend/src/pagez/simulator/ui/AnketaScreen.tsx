"use client";

import { FC, useMemo, useState } from "react";
import { profileFromAnketa } from "../model/grading";
import { CandidateProfile } from "../model/types";

const EDU = ["Юридическое", "Экономическое / в сфере закупок", "Техническое", "Иное / среднее"];
const EXP = ["Нет опыта", "До 1 года", "1–3 года", "Более 3 лет"];
const YESNO = ["Нет", "Да"];

const field = "w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#69a93f]/60 [&>option]:bg-[#0c1422]";
const label = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/45";

export const AnketaScreen: FC<{ onSubmit: (p: CandidateProfile) => void }> = ({ onSubmit }) => {
    const [step, setStep] = useState<"form" | "score">("form");
    const [name, setName] = useState("");
    const [gender, setGender] = useState("Мужской");
    const [age, setAge] = useState("");
    const [edu, setEdu] = useState(EDU[3]);
    const [exp, setExp] = useState(EXP[0]);
    const [cert, setCert] = useState("Нет");
    const [record, setRecord] = useState("Нет");

    const profile = useMemo(
        () => profileFromAnketa({ name: name || "Кандидат", gender, age: age || "—", edu, exp, cert, record }),
        [name, gender, age, edu, exp, cert, record],
    );

    const valid = name.trim().length > 0 && /^\d{1,2}$/.test(age);

    const tone = (v: number) => (v >= 60 ? "#6faf3e" : v >= 40 ? "#fac540" : "#ed573f");

    return (
        <div className="vn-root flex h-full w-full items-center justify-center overflow-y-auto bg-gradient-to-br from-[#0b1422] to-[#10203a] p-4">
            <div className="vn-fade-up w-full max-w-lg rounded-2xl border border-white/10 bg-[#0c1422]/85 p-6 backdrop-blur-md sm:p-8">
                {step === "form" ? (
                    <>
                        <div className="mb-1 text-xs font-bold uppercase tracking-wider text-[#8bc249]">День 0 · Оформление</div>
                        <h2 className="mb-1 text-2xl font-extrabold text-white font-nunito">Анкета кандидата</h2>
                        <p className="mb-6 text-sm text-white/55">Отвечайте честно — это часть оценки. На основе анкеты система рассчитает стартовый уровень доверия.</p>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className={label}>ФИО</label>
                                <input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Иванов Иван Иванович" />
                            </div>
                            <div>
                                <label className={label}>Пол</label>
                                <select className={field} value={gender} onChange={(e) => setGender(e.target.value)}>
                                    <option>Мужской</option><option>Женский</option>
                                </select>
                            </div>
                            <div>
                                <label className={label}>Возраст</label>
                                <input className={field} value={age} onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 2))} placeholder="28" inputMode="numeric" />
                            </div>
                            <div className="sm:col-span-2">
                                <label className={label}>Образование</label>
                                <select className={field} value={edu} onChange={(e) => setEdu(e.target.value)}>
                                    {EDU.map((o) => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                            <div className="sm:col-span-2">
                                <label className={label}>Опыт в госзакупках</label>
                                <select className={field} value={exp} onChange={(e) => setExp(e.target.value)}>
                                    {EXP.map((o) => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={label}>Сертификат по 44-ФЗ</label>
                                <select className={field} value={cert} onChange={(e) => setCert(e.target.value)}>
                                    {YESNO.map((o) => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={label}>Была ли судимость</label>
                                <select className={field} value={record} onChange={(e) => setRecord(e.target.value)}>
                                    {YESNO.map((o) => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                        </div>

                        <button
                            disabled={!valid}
                            onClick={() => setStep("score")}
                            className="mt-6 w-full rounded-xl bg-[#69a93f] py-3 text-sm font-bold text-white transition hover:bg-[#5d9737] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Подтвердить анкету
                        </button>
                    </>
                ) : (
                    <>
                        <div className="mb-1 text-xs font-bold uppercase tracking-wider text-[#8bc249]">Скоринг доверия</div>
                        <h2 className="mb-4 text-2xl font-extrabold text-white font-nunito">Стартовый профиль</h2>

                        <div className="mb-5 flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                            <div className="relative flex size-20 shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(${tone(profile.trustScore)} ${profile.trustScore * 3.6}deg, rgba(255,255,255,0.08) 0deg)` }}>
                                <div className="flex size-16 flex-col items-center justify-center rounded-full bg-[#0c1422]">
                                    <span className="text-xl font-extrabold tabular-nums text-white">{profile.trustScore}</span>
                                    <span className="text-[9px] uppercase tracking-wider text-white/40">доверие</span>
                                </div>
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-base font-bold text-white">{profile.name}</p>
                                <p className="text-xs text-white/50">{profile.edu} · {profile.exp}</p>
                                <p className="mt-1 text-xs text-white/40">Судимость не помеха, если перекрыта образованием и опытом.</p>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            {profile.trustBreakdown.length === 0 && (
                                <p className="text-sm text-white/50">Базовый уровень доверия без модификаторов.</p>
                            )}
                            {profile.trustBreakdown.map((b, i) => (
                                <div key={i} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-sm">
                                    <span className="text-white/75">{b.label}</span>
                                    <span className="font-bold tabular-nums" style={{ color: b.delta >= 0 ? "#6faf3e" : "#ed573f" }}>
                                        {b.delta >= 0 ? "+" : ""}{b.delta}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex gap-2">
                            <button onClick={() => setStep("form")} className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/5">
                                Назад
                            </button>
                            <button onClick={() => onSubmit(profile)} className="flex-1 rounded-xl bg-[#69a93f] py-3 text-sm font-bold text-white transition hover:bg-[#5d9737]">
                                Первый рабочий день →
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
