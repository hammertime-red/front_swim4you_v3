export const fetchData = async <T>(url: string, options: any = {}) => {
    const config = useRuntimeConfig()

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
                'Content-Type': 'application/json'
            },
            ...options,
            immediate: true,
            watch: false,
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

        throw error
    }
}