import {parse, format, isSameDay, isSameYear, isSameMonth, parseISO} from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { ru } from 'date-fns/locale'
import { useGlobalStore } from '@/store/globalStore'

// Укажем часовой пояс один раз, чтобы не дублировать
const MOSCOW_TZ = 'Europe/Moscow'

// Функция для парсинга строки вида 'YYYY-MM-DD HH:mm' в московском часовом поясе
function parseMoscowDate(dateString) {
    if (!dateString) return null

    let parsed

    // Проверяем формат даты
    if (dateString.includes('T')) {
        // Для формата ISO (2025-01-25T07:00:00.000000Z)
        parsed = parseISO(dateString)
    } else {
        // Для формата 'YYYY-MM-DD HH:mm'
        parsed = parse(dateString, 'yyyy-MM-dd HH:mm', new Date())
    }
    return toZonedTime(parsed, MOSCOW_TZ)
}

export function datesRange(start_date, end_date) {
    const start = parseMoscowDate(start_date)
    const end = parseMoscowDate(end_date)

    // Если обе даты отсутствуют
    if (!start && !end) return null

    // Только начальная дата
    if (start && !end) {
        return format(start, 'd MMM yyyy', { locale: ru })
    }

    // Только конечная дата
    if (!start && end) {
        return format(end, 'd MMM yyyy', { locale: ru })
    }

    // Если даты совпадают по дню
    if (isSameDay(start, end)) {
        return format(start, 'd MMM yyyy', { locale: ru })
    }

    // Если год одинаковый
    if (isSameYear(start, end)) {
        // Если месяц тоже одинаковый
        if (isSameMonth(start, end)) {
            // Одна и та же месяц и год
            return `${format(start, 'd', { locale: ru })} - ${format(end, 'd MMM yyyy', { locale: ru })}`
        }
        // Разные месяцы, но один год
        return `${format(start, 'd MMM', { locale: ru })} - ${format(end, 'd MMM yyyy', { locale: ru })}`
    }


    // Разные годы
    return `${format(start, 'd MMM yyyy', { locale: ru })} - ${format(end, 'd MMM yyyy', { locale: ru })}`
}

export function inDateRange(start_date, end_date) {
    const globalStore = useGlobalStore()
    if (!start_date || !end_date) return false

    const start = parseMoscowDate(start_date)
    const end = parseMoscowDate(end_date)
    const now = parse(globalStore.server_time, 'yyyy-MM-dd HH:mm:ss', new Date())

    // Проверяем, что now находится строго между start и end
    return start < now && now < end
}
