<template>
    <PageLoader v-if="!fetched_data" />
    <default-layout v-if="fetched_data">
        <template #content>
            <page-title
                title="Доп. услуги"
                :breadcrumbs="[{ title: 'Мой аккаунт', link: '/profile' }]" />
            <div class="container">
                <div class="row g-4 mb-5">
                    <div
                        :class="postdata?.athlete_id || postdata?.distance_id ? 'col-md-9' : 'col-12'">
                        <div class="content_box p-4 p-md-5 mb-4 h-full">
                            <div
                                class="content_box__header flex justify-between items-center mb-4 relative z-2">
                                <h2 class="title_block mb-2 fs-3">
                                    {{ postdata.name }} #{{ postdata.id }}
                                </h2>
                            </div>
                            <div class="row g-5">
                                <div
                                    v-if="postdata?.event_stage_id && postdata.event_name"
                                    class="col-auto text-sm">
                                    <p class="text-sub mb-1">Мероприятие</p>
                                    <NuxtLink
                                        :to="`/stage/${postdata.event_stage_id}`"
                                        class="mb-0 font-bold">
                                        {{ postdata.event_name }}
                                    </NuxtLink>
                                </div>

                                <div v-if="postdata?.order_id" class="col-auto text-sm">
                                    <p class="text-sub mb-1">ID заявки</p>
                                    <NuxtLink :to="`/order/${postdata.order_id}`" class="mb-0 font-bold">
                                        #{{ postdata.order_id }}
                                    </NuxtLink>
                                </div>

                                <div v-if="postdata?.status" class="col-auto text-sm">
                                    <p class="text-sub mb-1">Статус</p>
                                    <ExtraItemStatusBadge :status="postdata.status" />
                                </div>

                                <div v-if="postdata.created_at" class="col-auto text-sm">
                                    <p class="text-sub mb-1">Дата заявки</p>
                                    <p class="mb-0">{{ postdata.created_at }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="postdata?.athlete_id || postdata?.distance_id" class="col-md-3">
                        <div class="content_box p-4 p-md-5 mb-4 h-full">
                            <div
                                v-if="postdata?.athlete_id && postdata?.athlete_name"
                                class="col-auto text-sm mb-4">
                                <p class="text-sub mb-1">Атлет</p>
                                <div class="table_name_item flex items-center">
                                    <Avatar
                                        :src="postdata?.athlete_avatar"
                                        :name="postdata.athlete_name"
                                        className="me-2" />
                                    <span class="font-bold">{{ postdata.athlete_name }}</span>
                                </div>
                            </div>
                            <div
                                v-if="postdata?.distance_id && postdata?.distance_name"
                                class="col-auto text-sm">
                                <p class="text-sub mb-1">Дистанция</p>
                                <p class="mb-0">{{ postdata.distance_name }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="postdata?.result_files && postdata?.result_files.length" class="mb-4">
                    <h2 class="title_block mb-3 text-sub">
                        Файлы для скачивания
                    </h2>
                    <DocumentsRow :items="postdata?.result_files" />
                </div>
            </div>

        </template>
    </default-layout>
</template>

<script>
import DocumentsRow from '../components/UI/DocumentsRow.vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import ExtraItemStatusBadge from '../components/UI/ExtraItemStatusBadge.vue'
import PageLoader from '../components/PageLoader'
import OrderResultMessage from '../components/OrderResultMessage.vue'
import OrdersListMasterClass from '../components/request/OrdersListMasterClass.vue'
import AdditionalData from '../components/request/AdditionalData.vue'
import OrdersListCamp from '../components/request/OrdersListCamp.vue'
import Avatar from '../components/UI/Avatar.vue'
import PageTitle from '../components/PageTitle.vue'
import RequestOrderInfo from '../components/RequestOrderInfo.vue'
import OrdersList from '../components/request/OrdersList.vue'
import SportsmensTable from '@/components/request/SportsmensTable.vue'
import RequestSidebarBox from '../components/RequestSidebarBox.vue'
import WithSidebarLayout from '../layouts/WithSidebarLayout.vue'
import { mapActions } from 'vuex'
export default {
    data() {
        return {
            postdata: null,
            fetched_data: false,
        }
    },
    computed: {},
    async mounted() {
        let res = await this.fetchExtraItem(this.$route.params.id)
        this.postdata = res
        this.fetched_data = true
    },
    methods: {
        ...mapActions({
            fetchExtraItem: 'order/fetchSingleExtraItem',
        }),
    },
    components: {
        PageLoader,
        WithSidebarLayout,
        RequestSidebarBox,
        SportsmensTable,
        OrdersList,
        RequestOrderInfo,
        PageTitle,
        Avatar,
        OrdersListCamp,
        AdditionalData,
        OrdersListMasterClass,
        OrderResultMessage,
        ExtraItemStatusBadge,
        DefaultLayout,
        Avatar,
        DocumentsRow
    },
}
</script>

<style></style>
