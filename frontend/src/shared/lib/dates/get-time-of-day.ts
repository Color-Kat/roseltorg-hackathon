export type TimeOfDay =
    | 'night'
    | 'morning'
    | 'day'
    | 'evening';

export function getTimeOfDay(date: Date = new Date()): TimeOfDay {
    const hour = date.getHours();

    if (hour >= 5 && hour < 11) {
        return 'morning';
    }

    if (hour >= 11 && hour < 17) {
        return 'day';
    }

    if (hour >= 17 && hour < 23) {
        return 'evening';
    }

    return 'night';
}
