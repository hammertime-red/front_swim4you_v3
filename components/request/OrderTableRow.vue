<script setup>
import ExpiredStatus from "@/components/UI/ExpiredStatus.vue";
import SwalButton from "@/components/SwalButton.vue";
import OrderStatusBadge from "@/components/UI/OrderStatusBadge.vue";

const props = defineProps({
    item: {
        type: Object,
        required: true,
    }
})
</script>

<template>
    <tr>
        <td class="align-middle text-sub">#{{ item.id }}</td>
        <td class="align-middle">
            <NuxtLink
                :to="{name: 'events_order', params: {id: item.id}}"
                class="font-bold text-decoration-none minw-200"
            >{{ item.event_name }}</NuxtLink
            >
            <ExpiredStatus
                v-if="item.expiration_time && !checkExpired(item) && item.status === 'draft'"
                title="Бронь дистанций: "
                class="small text-sub"
                :time="item.expiration_time" />
        </td>
        <td class="align-middle">
            <OrderStatusBadge :status="item.status" />
        </td>
        <td class="align-middle text-sub">{{ correctDate(item.updated_at) }}</td>
        <td class="align-middle">
            <div class="table_actions flex items-center justify-content-end">
                <CDropdown direction="dropstart">
                    <CDropdownToggle class="btn-circle text-primary">
                        <vue-feather type="more-vertical"></vue-feather>
                    </CDropdownToggle>
                    <CDropdownMenu>
                        <CDropdownItem v-if="item.allow_edit" class="small">
                            <NuxtLink :to="{name: 'order_edit', params: {id: item.id}}">Редактировать</NuxtLink>
                        </CDropdownItem>
                        <CDropdownItem v-if="item.status == 'pending_payment'" class="small">
                            <a href="#" @click.prevent="toPayment(item.id)">К оплате</a>
                        </CDropdownItem>
                        <CDropdownItem class="small">
                            <SwalButton
                                class="text-red-500"
                                title="Вы действительно хотите удалить эту заявку?"
                                text="После этого заявку уже нельзя будет восстановить и все действия, связанные с ней, прекратятся"
                                icon="warning"
                                confirmButtonText="Удалить"
                                confirmButtonColor="#EA5455"
                                @callback="deleteRequest"
                                :callbackData="item.id">
                                Удалить
                            </SwalButton>
                        </CDropdownItem>
                    </CDropdownMenu>
                </CDropdown>
                <NuxtLink :to="'/order/' + item.id" class="btn-circle text-primary">
                    <vue-feather type="eye"></vue-feather>
                </NuxtLink>
            </div>
        </td>
    </tr>
</template>

<style scoped>

</style>