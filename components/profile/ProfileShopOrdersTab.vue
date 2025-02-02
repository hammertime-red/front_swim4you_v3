<template>
	<div class="content_box py-6">
        <div class="content_box__header flex justify-between items-center mb-3 px-4 relative z-2">
            <h2 class="title_block mb-0">Мои заказы</h2>
        </div>

        <DataTable
                stripedRows
                :value="table_data"
                size="lg"
                paginator
                :rows="pageSize"
                :rowsPerPageOptions="[10, 20, 50, 100]"
                :total-records="total"
                :sortField="sortBy"
                :sortOrder="sortDirComputed"
                lazy
                :loading="isLoading"
                @rowClick="event => navigateTo({name: 'shop_order', params: {id: event.data.id}})"
                @page="event => changePage(event)"
                @sort="event => sortRows(event)"
                selectionMode="single"
        >
            <Column field="id" header="ID" sortable>
                <template #body="{data}"><span class="text-sub">#{{ data.id }}</span></template>
            </Column>
            <Column field="event_name" header="Название" sortable >
                <template #body="{ data }">
                    <span class="font-bold text-primary-500">Заказ в интернет-магазине</span>
                </template>
            </Column>
            <Column field="status" header="Статус" sortable >
                <template #body="{data}"><ShopOrderStatusBadge :status="data.status" /></template>
            </Column>
            <Column field="created_at" header="Дата" sortable>
                <template #body="{data}"><span class="text-sub">{{ formatDate(data.created_at) }}</span></template>
            </Column>
            <Column class="w-24 !text-end">
                <template #body="{ data }">
                    <div class="table_actions flex items-center justify-content-end">
                        <Button variant="ghost" size="icon" class="rounded-full" as-child>
                            <NuxtLink :to="{name: 'shop_order', params: {id: data.id}}" class="btn-circle text-primary">
                                <Icon name="ri:eye-line" />
                            </NuxtLink>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger as-child>
                                <Button variant="ghost" size="icon" class="rounded-full">
                                    <Icon name="ri:more-2-fill" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem v-if="data.status === 'pending_payment'">
                                    <Button @click.prevent="toPayment(data.id)" variant="link" class="text-main">
                                        <Icon name="ri:bank-card-line" />
                                        К оплате
                                    </Button>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Button @click.prevent="deleteOrder(data.id)" variant="link" class="text-destructive">
                                        <Icon name="ri:delete-bin-5-line" />
                                        Удалить
                                    </Button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </template>
            </Column>
            <template #empty>
                <div v-if="isLoading" class="table__no_content text-center fs-3 py-3 text-sub">
                    <div>Загрузка данных</div>
                </div>
                <div v-if="!isLoading" class="table__no_content text-center py-4 text-sub">
                    <img src="/img/table_no_content.svg" class="mx-auto">
                    <div class="font-oswald text-4xl">Еще нет созданных заказов</div>
                </div>
            </template>
        </DataTable>


	</div>
</template>

<script setup>
import moment from 'moment'
import {computed, onMounted, ref} from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {Button} from "~/components/shadcn/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/shadcn/ui/dropdown-menu'
import {useToast} from "~/components/shadcn/ui/toast";
import ShopOrderStatusBadge from "~/components/UI/ShopOrderStatusBadge.vue";

const { $swal } = useNuxtApp()
const {toast} = useToast()
const userStore = useUserStore()

const table_data = ref([])
const sortBy = ref('updated_at')
const sortDir = ref('desc')
const sortDirComputed = computed(() => {
    return sortDir !== 'desc' ? 1 : -1;
})
const pageSize = ref(10)
const currentPage = ref(1)
const total = ref(0)
const isLoading = ref(true)

function isExpired(item){
    return moment(item.expiration_time) < moment()
}

function changePage(event) {
    currentPage.value = event.page + 1
    pageSize.value = event.rows
    fetchOrders()
}

function sortRows(event){
    sortBy.value = event?.sortField ?? null
    sortDir.value = event.sortOrder === 1 ? 'asc' : 'desc';
    fetchOrders()
}

async function deleteOrder(id){
    const result = await $swal.fire({
        title: "Вы уверены, что хотите удалить эт заявку?",
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: "Удалить",
        confirmButtonColor: "#dc3545",
        cancelButtonText: "Отмена",
    })

    if (result.isConfirmed) {
        await fetchAuth(`/order/${id}`, {
            method: "DELETE",
        }).then(() => {
            table_data.value = table_data.value.filter(function (e) {
                return e.id !== id
            })
            toast({
                title: 'Заказ успешно удалён',
                variant: 'success',
            })
        }).catch((e) => {
            console.error(e)
        })
    }
}

async function toPayment(order_id){
    const loading  = await $swal.loading(
        'Перенаправление на форму оплаты',
        'Пожалуйста, не закрывайте страницу')

    fetchAuth(`/shop/order/${order_id}/toPayment`, {
        method: "POST",
    }).then((response) => {
        if(response?.payment_url){
            navigateTo(response.payment_url, {
                external: true
            })
        }
    }).catch((e) => {
        loading.close()
        if(e.data?.message){
            $swal.error(e.data?.message)
        } else {
            $swal.error('Возникла неизвестная ошибка, пожалуйста, попробуйте ещё раз')
        }
        console.log(e.data)
    })
}

async function fetchOrders() {
    isLoading.value = true
    return await fetchAuth('/shop/orders', {
        method: 'GET',
        query: {
            page: currentPage.value,
            perPage: pageSize.value,
            sortBy: sortBy.value,
            sortDir: sortDir.value
        }
    })
        .then((response) => {
            table_data.value = response.data
            total.value = response.total
        }).catch((e) => {
            console.error(e)
        }).finally(() => {
            isLoading.value = false
        })
}

onMounted(async () => {
    if(table_data.value.length) return
    await fetchOrders()
})
</script>