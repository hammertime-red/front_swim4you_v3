<template>
	<div class="content_box px-4 py-6">
        <div class="content_box__header flex justify-between items-center mb-3 px-4 relative z-2">
            <h2 class="title_block mb-0">Клубы</h2>

            <AddClubModal>
                <Button type="button" variant="primary" size="lg" class="rounded-full">Добавить<Icon name="ri:add-fill" /></Button>
            </AddClubModal>
        </div>

		<div class="grid gap-4 md:grid-cols-2" :class="{
            'md:grid-cols-3': userStore.clubs.length % 3 === 0,
            'md:grid-cols-2': userStore.clubs.length % 5 === 0,
		}">
			<div v-for="(item, i) in userStore.clubs">
				<ClubCard :item="item" />
			</div>
		</div>
        <div v-if="!userStore.clubs.length" class="table__no_content text-center py-4 text-sub">
            <img src="/img/table_no_content.svg" class="mx-auto">
            <div class="font-oswald text-4xl">Еще нет добавленных клубов</div>
        </div>
	</div>
</template>

<script setup>
import ClubCard from "~/components/cards/ClubCard.vue"
import {Button} from "~/components/shadcn/ui/button";
import AddClubModal from "~/components/offcanvases/AddClubModal.vue";

const userStore = useUserStore()
</script>

<style></style>
