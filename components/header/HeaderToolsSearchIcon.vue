# SearchModal.vue
<template>
    <Dialog>
        <DialogTrigger as-child>
            <Button variant="ghost" size="icon" class="rounded-full">
                <Icon name="ri:search-2-line" size="18px" />
            </Button>
        </DialogTrigger>

        <DialogContent class="sm:max-w-2xl">
            <div class="relative">
                <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                    <Icon name="ri:search-2-line" size="20px" class="text-sub" />
                </span>
                <Input
                        v-model="searchQuery"
                        class="h-12 pl-11"
                        placeholder="Поиск по сайту..."
                />
            </div>

            <div v-if="searchResults.length" class="max-h-[500px] overflow-y-auto">
                <div v-for="(group, category) in groupedResults" :key="category" class="py-2">
                    <h4 class="py-1.5 text-sm font-semibold">{{ category }}</h4>
                    <div class="grid gap-1">
                        <NuxtLink
                                v-for="result in group"
                                :key="result.id"
                                to="/"
                                class="block py-2 px-3 rounded bg-slate-50 hover:bg-slate-100 transition-all">
                            <p class="font-medium">{{ result.title }}</p>
                            <p class="text-sm text-sub">{{ result.description }}</p>
                        </NuxtLink>
                    </div>
                </div>
            </div>

            <div v-else-if="searchQuery" class="p-6 text-center text-sub">
                Нет результатов по запросу
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Button } from '~/components/shadcn/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '~/components/shadcn/ui/dialog'
import { Input } from '~/components/shadcn/ui/input'

const searchQuery = ref('')

const searchData = [
    { id: 1, category: 'Components', title: 'Button', description: 'Interactive button component' },
    { id: 2, category: 'Components', title: 'Modal', description: 'Dialog and overlay component' },
    { id: 3, category: 'Hooks', title: 'useQuery', description: 'Data fetching hook' },
    { id: 4, category: 'Hooks', title: 'useState', description: 'State management hook' },
    { id: 5, category: 'Guides', title: 'Getting Started', description: 'Quick start guide' },
]

const searchResults = computed(() => {
    if (!searchQuery.value) return []
    return searchData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})

const groupedResults = computed(() => {
    return searchResults.value.reduce((groups, item) => {
        if (!groups[item.category]) {
            groups[item.category] = []
        }
        groups[item.category].push(item)
        return groups
    }, {})
})

const selectResult = (result) => {
    console.log('Selected:', result)
}
</script>