// composables/useBreadcrumbs.ts
import { ref, reactive, watch } from 'vue'

interface BreadcrumbSegment {
    name: string
    path: string | null | { name: string, params?: Record<string, string> }
    current: boolean
}

// Создаем глобальное состояние для breadcrumbs
const breadcrumbState = ref<BreadcrumbSegment[]>([])

export const useBreadcrumbs = () => {
    const route = useRoute()

    const updateSegmentName = (index: number, newName: string) => {
        if (index >= 0 && index < breadcrumbState.value.length) {
            breadcrumbState.value[index] = {
                ...breadcrumbState.value[index],
                name: newName
            }
        }
    }

    const setSegments = (newSegments: BreadcrumbSegment[]) => {
        breadcrumbState.value = newSegments
    }

    const initSegments = () => {
        const pathSegments = route.path.split('/').filter(segment => segment)

        const defaultSegments = pathSegments.map((segment, index) => {
            const path = '/' + pathSegments.slice(0, index + 1).join('/')
            const matchedRoute = route.matched[index]

            return {
                name: matchedRoute?.meta?.breadcrumb || segment.charAt(0).toUpperCase() + segment.slice(1),
                path,
                current: index === pathSegments.length - 1
            }
        })

        setSegments(defaultSegments)
    }

    // Инициализируем только если сегменты пусты
    if (breadcrumbState.value.length === 0) {
        initSegments()
    }

    // Следим за изменением маршрута
    watch(() => route.path, initSegments)

    return {
        segments: breadcrumbState,
        updateSegmentName,
        setSegments
    }
}