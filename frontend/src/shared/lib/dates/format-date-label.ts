import { today, yesterday } from "./dates";

/**
 * Format date for display: "Сегодня", "Вчера", "16 октября", "10 сентября 2024"
 */
export const formatDateLabel = (date: Date): string => {
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    if (target.getTime() === today.getTime()) {
        return "Сегодня";
    }

    if (target.getTime() === yesterday.getTime()) {
        return "Вчера";
    }

    const months = [
        "января", "февраля", "марта", "апреля", "мая", "июня",
        "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];

    const day = target.getDate();
    const month = months[target.getMonth()];
    const year = target.getFullYear();
    const currentYear = new Date().getFullYear();

    return year === currentYear
        ? `${day} ${month}`
        : `${day} ${month} ${year}`;
};