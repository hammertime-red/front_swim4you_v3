<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { differenceInSeconds, parseISO, parse, addSeconds } from 'date-fns'

const props = defineProps({
    endDate: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['timeEnd'])

const globalStore = useGlobalStore()
const timeLeft = ref('')
const timer = ref(null)
const isVisible = ref(false)
const secondsPassed = ref(0)

const calculateTimeLeft = () => {
    // Парсим даты
    const end = parseISO(props.endDate)
    const current = parse(globalStore.server_time, 'yyyy-MM-dd HH:mm:ss', new Date())

    // Добавляем прошедшие секунды к текущему серверному времени
    const currentWithOffset = addSeconds(current, secondsPassed.value)

    // Проверяем валидность даты окончания
    if (!end) {
        clearTimer()
        return
    }
    
    if (end <= currentWithOffset) {
        clearTimer()
        emit('timeEnd')
        return
    }
    const diff = differenceInSeconds(end, currentWithOffset)
    // Рассчитываем оставшееся время
    const days = Math.floor(diff / (60 * 60 * 24))
    const hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60))
    const minutes = Math.floor((diff % (60 * 60)) / 60)
    const seconds = diff % 60

    // Форматируем вывод
    const parts = []
    if (days > 0) parts.push(`${days}д`)
    if (hours > 0) parts.push(`${hours}ч`)
    if (minutes > 0) parts.push(`${minutes}м`)
    parts.push(`${seconds}с`)

    timeLeft.value = parts.join(' ')
    isVisible.value = true
}

const clearTimer = () => {
    if (timer.value) {
        clearInterval(timer.value)
        timer.value = null
    }
    timeLeft.value = ''
    isVisible.value = false
    secondsPassed.value = 0
}

onMounted(() => {
    calculateTimeLeft()
    if (isVisible.value) {
        timer.value = setInterval(() => {
            secondsPassed.value++
            calculateTimeLeft()
        }, 1000)
    }
})

onBeforeUnmount(() => {
    clearTimer()
})

watch(() => props.endDate, (newDate) => {
    clearTimer()
    if (!newDate) {
        return
    }
    calculateTimeLeft()
    if (isVisible.value) {
        timer.value = setInterval(() => {
            secondsPassed.value++
            calculateTimeLeft()
        }, 1000)
    }
})
</script>

<template>
    <div v-if="isVisible" class="countdown">
        {{ timeLeft }}
    </div>
</template>