// Today date
import { formatDate } from "@/shared/lib/dates/format-date";

const today = new Date();
today.setHours(0, 0, 0, 0);

// Today string in format d-m-yyyy
const todayString = formatDate(today, 'd-m-Y');

// Tomorrow date
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

// Tomorrow string in format d-m-yyyy
const tomorrowString = formatDate(tomorrow, 'd-m-Y');

// Yesterday date
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

// Yesterday string in format d-m-yyyy
const yesterdayString = formatDate(yesterday, 'd-m-Y');

// Midnight (start of next day)
const midnight = new Date();
midnight.setHours(24, 0, 0, 0);

// Current year
const currentYear = new Date().getFullYear();

// Add days to today date
const addDays = (date: Date, days: number) => {
    date.setDate(date.getDate() + days);

    return date;
}

// Add months to today date
const addMonths = (months: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + months);

    return date;
}

export {
    today,
    todayString,
    tomorrow,
    tomorrowString,
    yesterday,
    yesterdayString,
    midnight,
    currentYear,

    addDays,
    addMonths
};
