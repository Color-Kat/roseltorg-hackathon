import { capitalize } from '@/shared/lib/strings';
import { AxiosError, isAxiosError } from 'axios';

/**
 * FastAPI validation error item (422 responses):
 * { detail: [{ loc: ["body", "email"], msg: "...", type: "..." }] }
 */
type FastApiValidationItem = {
    loc: (string | number)[];
    msg: string;
    type: string;
};

/**
 * Map FastAPI validation errors (422) to { field: 'error message' }.
 * The general/non-field error (if any) is placed under the 'general' key.
 */
export function parseValidationErrors(data: any): Record<string, string> {
    const result: Record<string, string> = {};

    try {
        const detail = data?.detail;

        if (Array.isArray(detail)) {
            for (const item of detail as FastApiValidationItem[]) {
                // Last element of `loc` is usually the field name (skip "body"/"query").
                const field = String(item.loc?.[item.loc.length - 1] ?? 'general');
                if (!result[field]) result[field] = capitalize(item.msg);
            }
        } else if (typeof detail === 'string') {
            result['general'] = capitalize(detail);
        }
    } catch {
        console.warn('Cannot parse validation errors', data);
    }

    return result;
}

export interface AppError {
    title: string;
    message: string;
    statusCode?: number;
    details?: Record<string, string>; // validation errors keyed by field
    raw?: any; // for debugging
}

/**
 * Parse a backend or network error and format it into a user-friendly AppError.
 * Understands FastAPI's `{ detail: string | ValidationItem[] }` response shape.
 */
export function getErrorFromResponse(error: any): AppError {
    // Not an Axios error (network failure, thrown JS error, etc.)
    if (!isAxiosError(error)) return {
        title  : 'Что-то пошло не так',
        message: (typeof error?.message === 'string' && error.message) || 'Произошла непредвиденная ошибка :(',
        raw    : error,
    };

    const axiosError = error as AxiosError<any>;
    const status = axiosError.response?.status;
    const data = axiosError.response?.data;

    // FastAPI HTTPException puts a human message in `detail` (string).
    const backendMessage: string | undefined =
        typeof data?.detail === 'string' ? data.detail : undefined;

    switch (status) {
        case 400:
            return {
                title     : 'Некорректный запрос',
                message   : backendMessage || 'Данные введены некорректно',
                statusCode: status,
                raw       : data,
            };
        case 401:
            return {
                title     : 'Войдите в аккаунт',
                message   : backendMessage || 'Чтобы выполнить этот запрос, необходимо авторизоваться',
                statusCode: status,
                raw       : data,
            };
        case 403:
            return {
                title     : 'Недоступно',
                message   : backendMessage || 'Вы не можете выполнить это действие',
                statusCode: status,
                raw       : data,
            };
        case 404:
            return {
                title     : 'Не найдено',
                message   : backendMessage || 'Запрашиваемый ресурс не найден',
                statusCode: status,
                raw       : data,
            };
        case 409:
            return {
                title     : 'Конфликт',
                message   : backendMessage || 'Такая запись уже существует',
                statusCode: status,
                raw       : data,
            };
        case 422: {
            const validationErrors = parseValidationErrors(data);
            return {
                title     : 'Ошибка валидации',
                message   : validationErrors.general || 'Проверьте правильность введённых данных',
                statusCode: status,
                details   : validationErrors,
                raw       : data,
            };
        }
        case 429:
            return {
                title     : 'Слишком много запросов',
                message   : 'Пожалуйста, подождите немного перед повторной попыткой',
                statusCode: status,
                raw       : data,
            };
        case 500:
            return {
                title     : 'Ошибка сервера',
                message   : backendMessage || 'На сервере произошла какая-то ошибка. Попробуйте позже',
                statusCode: status,
                raw       : data,
            };
        case 502:
        case 503:
        case 504:
            return {
                title     : 'Сервис временно недоступен',
                message   : 'Не удалось получить ответ от сервера. Пожалуйста, попробуйте позже',
                statusCode: status,
                raw       : data,
            };
        default:
            return {
                title     : 'Что-то пошло не так',
                message   : backendMessage || 'Произошла неизвестная ошибка. Попробуйте позже',
                statusCode: status,
                raw       : data,
            };
    }
}
