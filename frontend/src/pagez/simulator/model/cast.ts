import { SpeakerId, SpritePose } from "./types";

export const BACKGROUNDS = {
    office: "/simulator/office.jpg",
} as const;

export const SPRITES: Record<SpritePose, string> = {
    krotov: "/simulator/krotov.png",
    krotov_task: "/simulator/krotov_task.png",
    krotov_angry: "/simulator/krotov_angry.png",
    tolik: "/simulator/tolik.png",
    tolik_panic: "/simulator/tolik_panic.png",
    eduard: "/simulator/eduard.png",
};

export interface SpeakerMeta {
    name: string;
    /** Цвет имени — акцент бренда / роль. */
    color: string;
}

export const SPEAKERS: Record<SpeakerId, SpeakerMeta> = {
    player: { name: "Вы", color: "#69a93f" },
    narrator: { name: "", color: "#9fb0c3" },
    alla: { name: "Алла · HR", color: "#c79bff" },
    krotov: { name: "Геннадий Семёнович", color: "#e84c3d" },
    tolik: { name: "Толик", color: "#f5a524" },
    eduard: { name: "Эдуард Рустамович", color: "#4aa0e0" },
};
