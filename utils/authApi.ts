export const fetchAuth = async <T>(url: string, options: any = {}) => {
    const config = useRuntimeConfig()
    const token = useCookie('access_token')

    try {
        const { data, error } = await useFetch<{
            success: boolean
            data?: T
            message?: string
            errors?: any[]
        }>(url, {
            baseURL: config.public.baseURL,
            headers: {
                'Accept': 'application/json',
                'Authorization': token.value ? `Bearer ${token.value}` : ''
            },
            credentials: 'include',
            ...options,
            onResponse({ response }) {
                const serverTime = response.headers.get('x-server-time')
                if (serverTime) {
                    const globalStore = useGlobalStore()
                    globalStore.setServerTime(serverTime)
                }
            }
        })

        if (error.value) {
            throw error.value
        }

        if (data.value?.success === false) {
            throw createError({
                message: data.value?.message || "Неизвестная ошибка",
                statusCode: 400,
                data: data.value?.errors || null
            })
        }

        return data.value?.data
    } catch (error: any) {
        if (error.statusCode === 401) {
            /*const authStore = useAuthStore()
            authStore.logout()*/
            navigateTo({name: 'auth'})
        }

        if (error.statusCode === 404) {
            navigateTo('/not-found')
        }

        throw error
    }
}