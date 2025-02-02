import { useGlobalStore } from '@/store/globalStore';
import { useRouter, useRuntimeConfig } from '#imports';
import type { ApiResponse, ApiErrorResponse, ErrorData } from '~/types/api';

export function useAuthApi() {
    const runtimeConfig = useRuntimeConfig();
    const globalStore = useGlobalStore();
    const router = useRouter();

    const authFetch = $fetch.create({
        baseURL: runtimeConfig.public.baseURL,
        credentials: 'include',
        onRequest(context: any) {
            const token = localStorage.getItem('access_token');
            if (token) {
                const headers = context.options.headers instanceof Headers
                    ? context.options.headers
                    : new Headers(context.options.headers);

                headers.set('Authorization', `Bearer ${token}`);
                context.options.headers = headers;
            }
        },
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
            const status = response.status;
            const data = response._data as ApiErrorResponse | undefined;
            const message = data?.message;

            switch (status) {
                case 400:
                    console.error('Ошибка 400:', message || 'Неверный запрос');
                    break;
                case 401:
                    console.warn('Ошибка 401: Авторизация не пройдена');
                    localStorage.removeItem('access_token');
                    if (router.currentRoute.value?.name !== 'login') {
                        router.push({ name: 'login' });
                    }
                    break;
                case 404:
                    console.warn('Ошибка 404: Страница не найдена');
                    router.push({ name: 'not_found' });
                    break;
                default:
                    console.error(message || 'Произошла ошибка');
            }

            throw { message: data?.message, errors: data?.errors } as ErrorData;
        },
        onRequestError(context: any) {
            console.error('Ошибка запроса:', context.error);
            throw { message: context.error?.message } as ErrorData;
        },
    });

    function get<T>(url: string, params: Record<string, any> = {}): Promise<T> {
        return authFetch<T>(url, { method: 'GET', query: params });
    }

    function post<T>(url: string, body: Record<string, any> = {}): Promise<T> {
        return authFetch<T>(url, { method: 'POST', body });
    }

    function put<T>(url: string, body: Record<string, any> = {}): Promise<T> {
        return authFetch<T>(url, { method: 'PUT', body });
    }

    function del<T>(url: string, params: Record<string, any> = {}): Promise<T> {
        return authFetch<T>(url, { method: 'DELETE', query: params });
    }

    return {
        get,
        post,
        put,
        del,
        authFetch,
    };
}
