<template>
    <div class="event_results_links content_box p-6 mb-3">
        <div class="grid lg:grid-cols-12 gap-4">
            <div class="lg:col-span-2 flex items-center">
                <p class="title_block text-sub mb-0">{{dates}}</p>
            </div>
            <div class="lg:col-span-5 flex items-center">
                <NuxtLink :to="{ name: 'event', params: { slug: item.slug }}" class="me-2 flex-shrink-0">
                    <img v-if="item.competition_icon"
                        :src="item.competition_icon"
                        class="championship__logo"
                    />
                </NuxtLink>
                <div class="font-bold">
                    <p class="text-lg mb-1">{{item.name}}</p>
                    <p class="text-sub">{{item.city}}</p>
                </div>
            </div>
            <div class="lg:col-span-5">
                <div class="flex flex-wrap gap-2 h-full items-center lg:justify-end w-full">
                    <Button
                            v-if="item?.summary_protokol"
                            variant="outline"
                            class="rounded-full text-sm py-3 h-auto w-full md:w-fit"
                            as-child
                    >
                        <NuxtLink :to="item?.summary_protokol" external target="_blank">
                            <Icon name="ri:download-cloud-2-line" class="text-primary-500" />
                            <span>Итоговый протокол</span>
                        </NuxtLink>
                    </Button>
                    <Button
                            v-if="item?.result_link"
                            variant="outline"
                            class="rounded-full text-sm py-3 h-auto w-full md:w-fit"
                            as-child
                    >
                        <NuxtLink :to="item?.result_link" external target="_blank">
                            <Icon name="ri:link" class="text-primary-500" />
                            <span>Результаты</span>
                        </NuxtLink>
                    </Button>
                    <Button
                            v-if="item?.lenex_file"
                            variant="outline"
                            class="rounded-full text-sm py-3 h-auto w-full md:w-fit"
                            as-child
                    >
                        <NuxtLink :to="item?.lenex_file" external target="_blank">
                            <Icon name="ri:download-cloud-2-line" class="text-primary-500" />
                            <span>Файл-Lenex</span>
                        </NuxtLink>
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {computed} from "vue";
import {datesRange} from "~/services/dates.js";
import {Button} from "~/components/shadcn/ui/button";

const props = defineProps({
    item: {
        type: Object,
        required: true,
    }
})

const dates = computed(() => {
    return datesRange(props.item.start_event_date, props.item.end_event_date)
})
</script>

<style>
</style>