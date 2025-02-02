<template>
    <div class="container mt-12">
        <div class="flex justify-between gap-7 mb-12">
            <h1 class="font-oswald text-4xl uppercase">Мой аккаунт</h1>
            <AppBreadcrumbs class="hidden lg:block" />
        </div>
        <Tabs default-value="event_orders" class="" orientation="vertical">
            <TabsList class="bg-slate-200 mb-3 grid grid-cols-1 md:inline-flex" >
                <TabsTrigger value="event_orders" class="px-5">
                    Заявки
                </TabsTrigger>
                <TabsTrigger value="shop_orders" class="px-5">
                    Заказы
                </TabsTrigger>
                <TabsTrigger value="extra_orders" class="px-5">
                    Доп. услуги
                </TabsTrigger>
                <TabsTrigger value="athletes" class="px-5">
                    Спортсмены
                </TabsTrigger>
                <TabsTrigger value="clubs" class="px-5">
                    Клубы
                </TabsTrigger>
                <TabsTrigger value="photo" class="px-5">
                    Фото
                </TabsTrigger>
                <TabsTrigger value="account" class="px-5">
                    Учетные данные
                </TabsTrigger>
            </TabsList>
            <TabsContent value="event_orders">
                <ProfileMyRequestsTab />
            </TabsContent>
            <TabsContent value="shop_orders">
                <ProfileShopOrdersTab />
            </TabsContent>
            <TabsContent value="athletes">
                <ProfileAthletesTab />
            </TabsContent>
            <TabsContent value="clubs">
                <ProfileClubsTab />
            </TabsContent>
        </Tabs>
<!--        <div class="container mb-4">
            <div class="row gx-3">
                <div v-for="tab in tabs" :key="tab.id" class="col-auto mb-3 mb-md-0">

                    <a
                    :class="[
                    'btn btn-white btn-rounded px-3 px-md-4',
                    { active: isActiveTab(tab) }
                    ]"
                    href="#"
                    @click.prevent="changeTab(tab.name)"
                    >
                    <span class="text-primary">
                            <vue-feather :type="tab.icon"/>
                        </span>
                    {{ tab.name }}
                    </a>
                </div>
            </div>
        </div>-->

<!--        <div class="container">
            <component
                    :is="currentTabComponent"
                    v-if="currentTabComponent"
                    :key="tabKeys[route.query.tab || 'Заявки']"
                    @changeData="incrementTabKey(route.query.tab)"
            />

            <template v-if="isAccountTab">
                <div class="row g-4">
                    <div class="col-lg-4">
                        <ProfileChangeAvatar/>
                    </div>
                    <div class="col-lg-4">
                        <ProfileChangeAccountData/>
                    </div>
                    <div class="col-lg-4">
                        <ProfileChangePassword/>
                    </div>
                </div>

                <div class="mt-4 text-end">
                    <SwalButton
                            :callback="deleteProfile"
                            class="small text-red-500"
                            confirmButtonColor="#EA5455"
                            confirmButtonText="Удалить"
                            icon="warning"
                            successText="Аккаунт удален"
                            text="Это действие нельзя будет отменить"
                            title="Вы действительно хотите удалить свой аккаунт?"
                    >
                        Удалить аккаунт
                    </SwalButton>
                </div>
            </template>
        </div>-->
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGlobalStore } from '@/store/globalStore'
import api from '@/store/api'
import ProfileExtraServicesTab from '../components/profile/ProfileExtraServicesTab.vue'
import ProfileShopOrdersTab from '~/components/profile/ProfileShopOrdersTab'
import ProfilePhotobankTab from '../components/profile/ProfilePhotobankTab'
import ProfileChangePassword from '@/components/profile/ProfileChangePassword'
import ProfileChangeAccountData from '@/components/profile/ProfileChangeAccountData'
import ProfileChangeAvatar from '@/components/profile/ProfileChangeAvatar'
import ProfileClubsTab from '@/components/profile/ProfileClubsTab'
import ProfileAthletesTab from '@/components/profile/ProfileAthletesTab'
import ProfileMyRequestsTab from '@/components/profile/ProfileMyRequestsTab'
import SwalButton from '../components/SwalButton'
import PageTitle from '../components/PageTitle.vue'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/shadcn/ui/tabs'
import AppBreadcrumbs from "~/components/layout/AppBreadcrumbs.vue";

definePageMeta({
    name: 'profile',
    breadcrumb: 'Мой аккаунт'
})
const { setSegments } = useBreadcrumbs()
setSegments([
    {
        name: 'Мой аккаунт',
        path: null,
        current: true
    }
])

const router = useRouter()
const route = useRoute()
const globalStore = useGlobalStore()

const tabKeys = ref({
    'Заявки': 0,
    'Заказы': 0,
    'Доп. услуги': 0,
    'Спортсмены': 0,
    'Клубы': 0,
    'Фото': 0
})

const tabs = [
    { id: 0, name: 'Заявки', icon: 'list' },
    { id: 1, name: 'Заказы', icon: 'shopping-cart' },
    { id: 2, name: 'Доп. услуги', icon: 'shopping-cart' },
    { id: 3, name: 'Спортсмены', icon: 'user' },
    { id: 4, name: 'Клубы', icon: 'bookmark' },
    { id: 5, name: 'Фото', icon: 'camera' },
    { id: 6, name: 'Учетные данные', icon: 'lock' }
]

const tabComponents = {
    'Заявки': ProfileMyRequestsTab,
    /*'Заказы': ProfileShopOrdersTab,
    'Доп. услуги': ProfileExtraServicesTab,
    'Спортсмены': ProfileAthletesTab,
    'Клубы': ProfileClubsTab,
    'Фото': ProfilePhotobankTab*/
}

const currentTabComponent = computed(() => {
    const tabName = route.query.tab || 'Заявки'
    return tabComponents[tabName]
})

const isAccountTab = computed(() => route.query.tab === 'Учетные данные')

const isActiveTab = (tab) => {
    return (!route.query.tab && tab.id === 0) || route.query.tab === tab.name
}

const changeTab = (tabName) => {
    router.push({ query: { tab: tabName } })
}

const incrementTabKey = (tabName) => {
    if (tabName in tabKeys.value) {
        tabKeys.value[tabName]++
    }
}

const deleteProfile = async () => {
    try {
        const response = await api.delete(`${process.env.VUE_APP_BASE_URL}account/delete`)
        if (response?.data?.success) {
            localStorage.removeItem('access_token')
            router.push({ name: 'login' })
        } else {
            globalStore.showAlert('Неизвестная ошибка', 'warning')
        }
    } catch (error) {
        console.error(error)
        globalStore.showAlert(error.response?.data?.message || 'Произошла ошибка', 'danger')
    }
}
</script>

<style scoped>
.dropdown-menu {
    min-width: 150px;
}

.dropdown-toggle:after,
.dropdown-toggle:before {
    display: none;
}

.dropdown-menu a {
    text-decoration: none;
    color: #071031;
}
</style>