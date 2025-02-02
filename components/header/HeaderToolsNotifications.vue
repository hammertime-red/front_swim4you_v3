<template>
    <Popover>
        <PopoverTrigger as-child>
            <Button class="relative rounded-full" size="icon" variant="ghost">
                <Icon name="ri:notification-3-line" size="18px"/>
                <span
                    v-if="notifications.length"
                    class="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] leading-4 text-white flex items-center justify-center"
                >
                  {{ notifications.length }}
                </span>
            </Button>
        </PopoverTrigger>

        <PopoverContent class="w-80">
            <div class="flex items-center justify-between mb-4">
                <h4 class="font-medium">Уведомления</h4>
                <Button
                    v-if="notifications.length"
                    class="text-sm"
                    size="sm"
                    variant="ghost"
                    @click="clearNotifications"
                >
                    Очистить
                </Button>
            </div>

            <div class="space-y-2">
                <p
                    v-if="!notifications.length"
                    class="text-center text-sm text-gray-500"
                >
                    У вас нет никаких уведомлений
                </p>
                <NuxtLink
                    v-for="notification in notifications"
                    v-else
                    :key="notification.id"
                    to="/"
                    class="block p-3 bg-slate-50 hover:bg-slate-100 transition-all rounded-lg text-sm"
                >
                    {{ notification.text }}
                </NuxtLink>
            </div>
        </PopoverContent>
    </Popover>
</template>

<script setup>
import {ref} from 'vue'
import {Popover, PopoverContent, PopoverTrigger} from '~/components/shadcn/ui/popover'
import {Button} from '~/components/shadcn/ui/button'

const notifications = ref([
    {id: 1, text: 'Тестовое уведомление'},
    {id: 2, text: 'Тестовое уведомление 2'},
    {id: 3, text: 'Тестовое уведомление 3'}
])

const clearNotifications = () => {
    notifications.value = []
}
</script>