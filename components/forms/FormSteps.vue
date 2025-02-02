<template>
    <div class="relative">
        <!-- Линия прогресса -->
        <div class="absolute top-4 left-0 right-0 md:left-[60px] md:right-[60px] h-[2px] bg-gray-200">
            <div
                    :style="{ width: `${progressWidth}%` }"
                    class="h-full bg-primary-100 transition-all duration-200 ease-in-out"
            ></div>
        </div>

        <!-- Шаги -->
        <div class="relative flex justify-between">
            <div
                    v-for="(step, index) in steps"
                    :key="step.id"
                    class="flex flex-col items-center"
            >
                <!-- Круг с номером -->
                <div
                        class="w-8 h-8 rounded-full flex items-center justify-center mb-2 z-10 transition-colors duration-200 font-oswald font-bold bg-gray-200"
                        :class="{
                            'bg-primary-500 text-white': activeStep === step.id,
                            'bg-primary-100 text-white': isCompleted(index),
                            'text-sub': activeStep != step.id && !isCompleted(index),
                        }"
                >
                    {{ index + 1 }}
                </div>

                <!-- Название шага -->
                <div
                    :class="{
                        'text-primary-500': activeStep === step.id,
                        'text-primary-100': isCompleted(index),
                        'text-sub': activeStep != step.id && !isCompleted(index),
                    }"
                    class="text-sm text-center max-w-[150px] font-oswald font-bold uppercase hidden md:inline"
                >
                    {{ step.name }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
interface Step {
    id: string
    name: string
}

const props = defineProps<{
    steps: Step[]
    activeStep: string
}>()

// Вычисляем ширину прогресса
const progressWidth = computed(() => {
    const currentIndex = props.steps.findIndex(step => step.id === props.activeStep)
    return (currentIndex / (props.steps.length - 1)) * 100
})

// Проверяем завершен ли шаг
const isCompleted = (index: number) => {
    const currentIndex = props.steps.findIndex(step => step.id === props.activeStep)
    return index < currentIndex
}
</script>