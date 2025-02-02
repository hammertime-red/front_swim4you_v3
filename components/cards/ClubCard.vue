<template>
	<div class="list_box p-4">
		<div
			class="list_box__header flex justify-between items-center">
			<span class="font-bold">{{ item.name }}</span>
			<div class="flex">
                <Button variant="ghost" @click.prevent="deleteClub" class="rounded-full text-destructive" size="icon">
                    <Icon name="ri:delete-bin-5-line" />
                </Button>
<!--				<SwalButton
					class="btn-circle text-sub"
					title="Вы действительно хотите удалить этот клуб?"
					text="После этого данные об этом клубе уже нельзя будет использовать в новых заявках"
					icon="warning"
					confirmButtonText="Удалить"
					confirmButtonColor="#EA5455"
					successText="Клуб удален"
					:callbackData="item.id"
					@callback="(id) => $emit('deleteClub', id)">
					<vue-feather type="trash-2"></vue-feather>
				</SwalButton>-->
			</div>
		</div>
		<div class="grid gap-4 mt-3">
			<div class="flex gap-3" v-if="item.short_name">
				<p class="text-sub">Короткое название:</p>
				<p class="">{{ item.short_name }}</p>
			</div>
			<div class="flex gap-3" v-if="item.country_name">
				<p class="text-sub">Страна:</p>
				<p class="">{{ item.country_name }}</p>
			</div>
			<div class="flex gap-3" v-if="item.city_name">
				<p class="text-sub">Город:</p>
				<p class="">{{ item.city_name }}</p>
			</div>
			<div class="flex gap-3" v-if="item.region_code">
				<p class="text-sub">Код субъекта:</p>
				<p class="">{{ item.region_code }}</p>
			</div>
			<div class="flex gap-3" v-if="item.agent_name">
				<p class="text-sub">Представитель:</p>
				<p class="">{{ item.agent_name }}</p>
			</div>
			<div class="flex gap-3" v-if="item.agent_phone">
				<p class="text-sub">Телефон:</p>
				<p class="">{{ item.agent_phone }}</p>
			</div>
			<div class="flex gap-3" v-if="item.agent_email">
				<p class="text-sub">Email:</p>
				<p class="">{{ item.agent_email }}</p>
			</div>
		</div>
        <AddClubModal :selected_club="item">
            <Button variant="outline" class="mt-6 w-full" size="lg">
                <Icon name="ri:pencil-line" />
                Редактировать
            </Button>
        </AddClubModal>
	</div>
</template>

<script setup>
import AddClubModal from "~/components/offcanvases/AddClubModal.vue";
import {Button} from "~/components/shadcn/ui/button";
import {useToast} from "~/components/shadcn/ui/toast";

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
})

const userStore = useUserStore()
const {$swal} = useNuxtApp()
const {toast} = useToast()

async function deleteClub(){
    const result = await $swal.fire({
        title: "Вы уверены, что хотите удалить этот клуб?",
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: "Удалить",
        confirmButtonColor: "#dc3545",
        cancelButtonText: "Отмена",
    })

    if (result.isConfirmed) {
        userStore.deleteClub(props.item.id).then(() => {
            toast({
                title: 'Клуб успешно удалён',
                variant: 'success',
            })
        })
    }
}
</script>

<style scoped>
.list_box {
	height: 100%;
}
</style>