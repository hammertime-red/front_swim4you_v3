<!-- components/UI/CustomAlert.vue -->
<script setup lang="ts">
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
    AlertDialogAction,
} from '~/components/shadcn/ui/alert-dialog'
import { ref } from 'vue'

const isOpen = ref(false)
const options = ref({
    title: '',
    text: '',
    icon: '',
    showCancelButton: false,
    confirmButtonText: 'OK',
    confirmButtonColor: '',
    cancelButtonText: 'Отмена',
    isLoading: false
})

const iconMap = {
    success: 'line-md:circle-twotone-to-confirm-circle-transition',
    error: 'line-md:close-circle',
    warning: 'line-md:alert-circle',
    info: 'line-md:alert-circle',
    loading: 'line-md:loading-twotone-loop'
}

let resolvePromise: (value: any) => void

const showAlert = (newOptions: any) => {
    options.value = { ...options.value, ...newOptions }
    isOpen.value = true
    return new Promise((resolve) => {
        resolvePromise = resolve
    })
}

const closeAlert = () => {
    isOpen.value = false
    options.value = {
        title: '',
        text: '',
        icon: '',
        showCancelButton: false,
        confirmButtonText: 'OK',
        confirmButtonColor: '',
        cancelButtonText: 'Отмена',
        isLoading: false
    }
}

const handleConfirm = () => {
    isOpen.value = false
    resolvePromise({ isConfirmed: true, isDismissed: false })
}

const handleCancel = () => {
    isOpen.value = false
    resolvePromise({ isConfirmed: false, isDismissed: true })
}

defineExpose({ showAlert, closeAlert })
</script>

<template>
    <AlertDialog :open="isOpen" @update:open="isOpen = $event">
        <AlertDialogContent class="sm:max-w-[425px] text-center">
            <AlertDialogHeader>
                <div v-if="options.icon" class="flex justify-center mb-4">
                    <Icon
                            :name="iconMap[options.icon]"
                            class="w-16 h-16"
                            :style="{
                            color: options.icon === 'error' ? '#dc3545' :
                                  options.icon === 'success' ? '#198754' :
                                  options.icon === 'warning' ? '#ffc107' : '#0d6efd'
                        }"
                    />
                </div>
                <AlertDialogTitle class="text-center">{{ options.title }}</AlertDialogTitle>
                <AlertDialogDescription v-if="options.text" class="text-center">
                    {{ options.text }}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter class="flex !justify-center space-x-2" v-if="!options.isLoading">
                <AlertDialogCancel
                        v-if="options.showCancelButton"
                        @click="handleCancel"
                >
                    {{ options.cancelButtonText }}
                </AlertDialogCancel>
                <AlertDialogAction
                        @click="handleConfirm"
                        :class="options.confirmButtonColor ? `bg-[${options.confirmButtonColor}]` : ''"
                >
                    {{ options.confirmButtonText }}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>