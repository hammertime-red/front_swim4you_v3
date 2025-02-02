<script setup>

import {CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle} from "@coreui/vue";
import ExpiredStatus from "@/components/UI/ExpiredStatus.vue";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import OrderStatusBadge from "@/components/UI/OrderStatusBadge.vue";
import SwalButton from "@/components/SwalButton.vue";
import {ref} from "vue";

const tableData = ref([])
const perPage = ref(10)
const currentPage = ref(1)
const total = ref(0)
const isLoading = ref(true)


</script>

<template>
    <DataTable
        :value="tableData"
        size="lg"
        paginator
        :rows="perPage"
        :rowsPerPageOptions="[10, 20, 50, 100]"
        :total-records="total"
        sortField="created_at"
        :sortOrder="-1"
        lazy
        loading
        @page="event => changePage(event)"
        @update:rows="event => changeRows(event)"
    >
        <Column field="id" header="ID" sortable class="text-sub text-sm"></Column>
        <Column field="event_name" header="Название" sortable >
            <template #body="{ data }">
                <NuxtLink
                    :to="{name: 'events_order', params: {id: data.id}}"
                    class="font-bold text-decoration-none minw-200"
                >{{ data.event_name }}</NuxtLink
                >
                <ExpiredStatus
                    v-if="data.expiration_time && !checkExpired(data) && data.status === 'draft'"
                    title="Бронь дистанций: "
                    class="small text-sub"
                    :time="data.expiration_time" />
            </template>
        </Column>
        <Column field="status" header="Статус" sortable >
            <template #body="{data}"><OrderStatusBadge :status="data.status" /></template>
        </Column>
        <Column field="created_at" header="Дата" sortable class="text-sub">

        </Column>
        <Column class="w-24 !text-end">
            <template #body="{ data }">
                <div class="table_actions flex items-center justify-content-end">
                    <CDropdown direction="dropstart">
                        <CDropdownToggle class="btn-circle text-primary">
                            <vue-feather type="more-vertical"></vue-feather>
                        </CDropdownToggle>
                        <CDropdownMenu>
                            <CDropdownItem v-if="data.allow_edit" class="small">
                                <NuxtLink :to="{name: 'order_edit', params: {id: data.id}}">Редактировать</NuxtLink>
                            </CDropdownItem>
                            <CDropdownItem v-if="data.status == 'pending_payment'" class="small">
                                <a href="#" @click.prevent="toPayment(data.id)">К оплате</a>
                            </CDropdownItem>
                            <CDropdownItem class="small">
                                <SwalButton
                                    class="text-red-500"
                                    title="Вы действительно хотите удалить эту заявку?"
                                    text="После этого заявку уже нельзя будет восстановить и все действия, связанные с ней, прекратятся"
                                    icon="warning"
                                    confirmButtonText="Удалить"
                                    confirmButtonColor="#EA5455"
                                    @callback="deleteOrder"
                                    :callbackData="data.id">
                                    Удалить
                                </SwalButton>
                            </CDropdownItem>
                        </CDropdownMenu>
                    </CDropdown>
                    <NuxtLink :to="'/order/' + data.id" class="btn-circle text-primary">
                        <vue-feather type="eye"></vue-feather>
                    </NuxtLink>
                </div>
            </template>
        </Column>
        <template #empty>
            <div v-if="isLoading" class="table__no_content text-center fs-3 py-3 text-sub">
                <div>Загрузка данных</div>
            </div>
            <div v-if="!isLoading" class="table__no_content text-center fs-3 py-3 text-sub">
                <img src="/img/table_no_content.svg">
                <div>Еще нет созданных заявок</div>
            </div>

        </template>
    </DataTable>
</template>

<style scoped>

</style>