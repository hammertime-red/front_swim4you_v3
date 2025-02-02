import { useGlobalStore } from '@/store/globalStore';
import type { ApiResponse, ApiErrorResponse, ErrorData } from '~/types/api';
import { useRuntimeConfig } from '#imports';

export function useApi() {
    const runtimeConfig = useRuntimeConfig();
    const globalStore = useGlobalStore();

    const apiFetch = $fetch.create({
        baseURL: runtimeConfig.public.baseURL,
        // Параметр хуков — any, чтобы избежать ошибок с типизацией контекста
        onResponse(context: any) {
            const { response } = context;
            const serverTime = response.headers.get('x-server-time');
            if (serverTime) {
                globalStore.setServerTime(serverTime);
            }

            const data = response._data as ApiResponse<unknown>;
            if (!data) {
                throw { message: 'Неизвестный формат ответа' } as ErrorData;
            }

            if (!data.success) {
                throw { message: data.message, errors: data.errors } as ErrorData;
            }

            response._data = data.data;
        },
        onResponseError(context: any) {
            const { response } = context;
            console.error('Ошибка ответа:', response?._data || 'Нет данных');
            const data = response?._data as ApiErrorResponse | undefined;
            throw { message: data?.message, errors: data?.errors } as ErrorData;
        },
        onRequestError(context: any) {
            console.error('Ошибка запроса:', context.error);
            throw { message: context.error?.message } as ErrorData;
        },
    });

    function get<T>(url: string, params: Record<string, any> = {}): Promise<T> {
        return apiFetch<T>(url, { method: 'GET', query: params });
    }

    function post<T>(url: string, body: Record<string, any> = {}): Promise<T> {
        return apiFetch<T>(url, { method: 'POST', body });
    }

    function put<T>(url: string, body: Record<string, any> = {}): Promise<T> {
        return apiFetch<T>(url, { method: 'PUT', body });
    }

    function del<T>(url: string, params: Record<string, any> = {}): Promise<T> {
        return apiFetch<T>(url, { method: 'DELETE', query: params });
    }

    return {
        get,
        post,
        put,
        del,
        apiFetch,
    };
}
