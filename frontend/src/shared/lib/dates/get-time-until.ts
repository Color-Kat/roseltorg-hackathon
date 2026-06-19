/**
 * Форматирует время до указанной даты в человеко-понятном виде
 *
 * @param targetDate - целевая дата
 * @param maxUnits - максимальное количество единиц времени (по умолчанию 2)
 * @returns строка вида "3ч 25м" или "2д 5ч"
 *
 * @example
 * getTimeUntil(midnight) // "3ч 25м"
 * getTimeUntil(deadline, 3) // "5д 3ч 25м"
 */
export function getTimeUntil(targetDate: Date | string | number, maxUnits: number = 2): string {
    const target = typeof targetDate === 'string' || typeof targetDate === 'number'
        ? new Date(targetDate)
        : targetDate;

    const now = new Date();
    const diffMs = target.getTime() - now.getTime();

    if (diffMs < 0) return 'прошло';
    if (diffMs < 60000) return 'менее 1м';

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    const parts: string[] = [];

    if (years > 0 && parts.length < maxUnits) parts.push(`${years}г`);
    if (months % 12 > 0 && parts.length < maxUnits) parts.push(`${months % 12}мес`);
    if (days % 30 > 0 && parts.length < maxUnits) parts.push(`${days % 30}д`);
    if (hours % 24 > 0 && parts.length < maxUnits) parts.push(`${hours % 24}ч`);
    if (minutes % 60 > 0 && parts.length < maxUnits) parts.push(`${minutes % 60}м`);

    return parts.length > 0 ? parts.join(' ') : 'менее 1м';
}