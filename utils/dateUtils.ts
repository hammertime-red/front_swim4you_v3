import {formatInTimeZone} from "date-fns-tz";
import {ru} from "date-fns/locale";
import type {Locale} from "date-fns/locale";
import { format as formatDateFNS } from 'date-fns'
/**
 * Проверяет, истекла ли дата.
 * @param {string} dateString - Дата в формате ISO 8601 (например, 2024-12-14T14:58:27.000000Z).
 * @returns {boolean} - Возвращает true, если дата истекла, иначе false.
 */
export function isDateExpired(dateString: string) {
    if(!dateString) return true;
    // Преобразуем строку даты в объект Date
    const date = new Date(dateString);

    // Получаем текущую дату
    const now = new Date();

    // Сравниваем даты
    return date < now;
}

export function formatDate(
    dateString: string,
    format: string = 'd MMM yyyy HH:mm', // Формат по умолчанию
    locale: Locale = ru // Локаль по умолчанию
): string | null {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        console.error('Invalid date string');
        return null;
    }

    // Получаем часовой пояс пользователя
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Форматируем дату с учетом часового пояса, формата и локали
    return formatInTimeZone(date, userTimeZone, format, { locale });
}

export function formatTimestamp(
    timestamp: number,
    pattern: string = 'd MMM yyyy HH:mm',
    locale: Locale = ru
): string | null {
    const date = new Date(timestamp * 1000);
    return isNaN(date.getTime()) ? null : formatDateFNS(date, pattern, { locale });
}

export function formatSwimtime(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
}