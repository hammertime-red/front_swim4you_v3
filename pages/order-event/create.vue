<template>
    <div v-if="postData && isRegistrationTime" class="container py-12">
        
        <div class="flex justify-between">
            <div class="">
                <h1 class="font-oswald text-4xl">Форма заявки</h1>
                <p v-if="postData?.name" class="mt-2 max-w-[600px]">{{postData.name}}</p>
            </div>
            
            <AppBreadcrumbs class="hidden lg:block" />
        </div>
        
        <Alert v-if="postData?.alert_message" class="mt-10 flex gap-7">
            <Icon name="ri:error-warning-line" size="34px" class="text-accent" />
            <AlertDescription v-html="postData.alert_message" class="alert_content"></AlertDescription>
        </Alert>
        
        <FormEvent :postData="postData" />
    </div>
</template>

<script setup>
import {computed, onMounted, ref, watch, provide} from 'vue'
import AppBreadcrumbs from "~/components/layout/AppBreadcrumbs.vue";
import {Alert, AlertDescription} from "~/components/shadcn/ui/alert";
import FormEvent from "~/components/forms/event/FormEvent.vue";
import {inDateRange} from "~/services/dates.js";

definePageMeta({
    name: 'order_event_create',
    breadcrumb: 'Форма заявки'
})

const {$swal} = useNuxtApp()
const route = useRoute()
const router = useRouter()
const { setSegments } = useBreadcrumbs()

const postData = ref(null)
const loading = ref(false)

await useAsyncData(
    `order_event_form_post-${route.query.id}`,
    () => fetchPostData(),
    {
        server: true,
    }
)

async function fetchPostData(){
    loading.value = true
    await fetchAuth(`/form/event/${route.query.id}`, {
        method: 'GET',
    }).then((response) => {
        postData.value = response
    }).catch((e) => {
        console.error(e)
    }).finally(() => {
        loading.value = false
    })
}

const isRegistrationTime = computed(() => {
    return inDateRange(postData.value.start_registration_date, postData.value.end_registration_date)
})

watchEffect(async () => {
    if (postData.value) {
        if(!isRegistrationTime.value){
            await $swal.fire({
                title: 'Ошибка',
                text: 'Регистрация на это событие ещё не началась или уже закончилась',
                icon: 'error',
                allowOutsideClick: false,
                showConfirmButton: true,
                confirmButtonText: 'Вернуться назад'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.back()
                }
            })
        }
        
        setSegments([
            {
                name: postData.value.name,
                path: { name: 'event', params: { slug: postData.value.slug } },
                current: false
            },
            {
                name: 'Форма заявки',
                path: null,
                current: true
            }
        ])
    }
})
</script>
