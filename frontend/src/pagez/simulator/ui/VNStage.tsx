"use client";

import Image from "next/image";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

import { BACKGROUNDS, SPEAKERS, SPRITES } from "../model/cast";
import { Choice, Line, SpriteSlot } from "../model/types";

const POS_CLASS: Record<string, string> = {
    left: "left-[2%] sm:left-[8%]",
    center: "left-1/2 -translate-x-1/2",
    right: "right-[2%] sm:right-[8%]",
};

const toneStyle: Record<string, string> = {
    good: "hover:border-[#69a93f]/70 hover:bg-[#69a93f]/10",
    bad: "hover:border-[#e84c3d]/70 hover:bg-[#e84c3d]/10",
    neutral: "hover:border-white/40 hover:bg-white/5",
};

interface Props {
    bg: string;
    stage: SpriteSlot[];
    line: Line | null;
    showChoices: boolean;
    choices: Choice[];
    onAdvance: () => void;
    onChoose: (c: Choice) => void;
    canAdvance: boolean;
}

export const VNStage: FC<Props> = ({ bg, stage, line, showChoices, choices, onAdvance, onChoose, canAdvance }) => {
    const speaker = line?.speaker ? SPEAKERS[line.speaker] : null;
    const name = line?.nameOverride ?? speaker?.name ?? "";
    const isNarration = !line?.speaker || line.speaker === "narrator";

    return (
        <div className="vn-root relative h-full w-full overflow-hidden bg-[#0b1422] select-none">
            {/* Фон */}
            <Image
                src={BACKGROUNDS[bg as keyof typeof BACKGROUNDS] ?? BACKGROUNDS.office}
                alt=""
                fill
                priority
                className="object-cover"
            />
            <div className="vn-scrim absolute inset-0" />

            {/* Спрайты персонажей */}
            <div className="absolute inset-x-0 bottom-[150px] top-0 sm:bottom-[180px]">
                {stage.map((slot, i) => (
                    <div
                        key={`${slot.pose}-${slot.pos}-${i}`}
                        className={twMerge(
                            "vn-sprite absolute bottom-0 h-[62%] sm:h-[78%]",
                            POS_CLASS[slot.pos],
                            slot.dim && "vn-sprite--dim",
                        )}
                    >
                        <Image
                            src={SPRITES[slot.pose]}
                            alt=""
                            width={420}
                            height={620}
                            className="h-full w-auto object-contain"
                        />
                    </div>
                ))}
            </div>

            {/* Зона клика для продвижения реплик */}
            {!showChoices && canAdvance && (
                <button
                    aria-label="Дальше"
                    onClick={onAdvance}
                    className="absolute inset-0 z-10 cursor-pointer"
                />
            )}

            {/* Диалоговая панель */}
            <div className="absolute inset-x-0 bottom-0 z-20 px-3 pb-3 sm:px-6 sm:pb-6">
                <div className="mx-auto w-full max-w-3xl">
                    {/* Имя говорящего */}
                    {!isNarration && name && (
                        <div
                            className="vn-fade-up mb-[-10px] ml-3 inline-block rounded-t-lg border border-b-0 px-4 py-1.5 text-sm font-bold backdrop-blur-md"
                            style={{
                                color: speaker?.color ?? "#fff",
                                borderColor: "var(--vn-edge)",
                                background: "var(--vn-panel)",
                            }}
                        >
                            {name}
                        </div>
                    )}

                    {/* Текст / выборы */}
                    <div
                        className="rounded-2xl border p-4 backdrop-blur-md sm:p-5"
                        style={{ borderColor: "var(--vn-edge)", background: "var(--vn-panel)" }}
                    >
                        {!showChoices && line && (
                            <p
                                key={line.text}
                                className={twMerge(
                                    "vn-fade-up min-h-[56px] text-[15px] leading-relaxed text-white sm:text-base",
                                    isNarration && "italic text-white/80",
                                )}
                            >
                                {line.text}
                            </p>
                        )}

                        {showChoices && (
                            <div className="flex flex-col gap-2">
                                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/40">
                                    Ваше решение
                                </p>
                                {choices.map((c, i) => (
                                    <button
                                        key={i}
                                        onClick={() => onChoose(c)}
                                        className={twMerge(
                                            "vn-choice group flex items-center gap-3 rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 text-left text-sm text-white/90",
                                            toneStyle[c.tone ?? "neutral"],
                                        )}
                                    >
                                        <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-white/15 text-xs font-bold text-white/50">
                                            {i + 1}
                                        </span>
                                        <span className="leading-snug">{c.text}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {!showChoices && canAdvance && (
                            <div className="mt-2 flex justify-end">
                                <span className="vn-blink text-xs text-white/50">▼ дальше</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
