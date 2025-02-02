<template>
    <div class="content_box py-6">
        <div
                class="content_box__header flex justify-between items-center mb-3 px-4 relative z-2">
            <h2 class="title_block mb-0">Спортсмены</h2>
            
            <EditAthleteModal>
                <Button type="button" variant="primary" size="lg" class="rounded-full">Добавить<Icon name="ri:add-fill" /></Button>
            </EditAthleteModal>

        </div>
        <DataTable
                stripedRows
                :value="athleteStore.userAthletes"
                size="lg"
        >
            <Column field="name" header="Имя" sortable>
                <template #body="{data}">
                    <div class="flex items-center text-main">
                        <Avatar :class="'me-2'" :name="data.name" :src="data.avatar"/>
                        <span class="font-bold text-sm">{{ data.name }}</span>
                    </div>
                </template>
            </Column>
            <Column field="category" header="Разряд" sortable >
                <template #body="{data}"><Badge variant="secondary" class="text-white">{{data.category}}</Badge></template>
            </Column>
            <Column field="nation" header="Гражданство" sortable>
                <template #body="{data}">
                    <div class="flex items-center text-main">
                        <Icon :name="`circle-flags:${getFlagName(data.nation)}`" class="me-2" />
                        <span class="">{{ data.nation }}</span>
                    </div>
                </template>
            </Column>
            <Column class="w-24 !text-end">
                <template #body="{ data }">
                    <div class="table_actions flex items-center justify-content-end">
                        <EditAthleteModal :selected_athlete="data">
                            <Button variant="ghost" class="rounded-full" size="icon">
                                <Icon name="ri:pencil-line" />
                            </Button>
                        </EditAthleteModal>
                        <EditAthleteModal v-if="globalStore.athlete_documents.length" :selected_athlete="data" selected-mode="documents" :required-documents="globalStore.athlete_documents" >
                            <Button variant="ghost" class="rounded-full" size="icon">
                                <Icon name="ri:file-copy-2-line" />
                            </Button>
                        </EditAthleteModal>
                        <Button variant="ghost" @click.prevent="deleteAthlete(data.id)" class="rounded-full text-destructive" size="icon">
                            <Icon name="ri:delete-bin-5-line" />
                        </Button>
                    </div>
                </template>
            </Column>
            <template #empty>
                <div class="table__no_content text-center py-4 text-sub">
                    <img src="/img/table_no_content.svg" class="mx-auto">
                    <div class="font-oswald text-4xl">Еще нет созданных атлетов</div>
                </div>
            </template>
        </DataTable>
    </div>
</template>

<script setup>
import {useToast} from "~/components/shadcn/ui/toast";
import {Button} from "~/components/shadcn/ui/button";
import EditAthleteModal from "~/components/offcanvases/EditAthleteModal.vue";
import DataTable from 'primevue/datatable';
import Column from "primevue/column";
import Avatar from "~/components/UI/Avatar.vue";
import {Badge} from "~/components/shadcn/ui/badge";

const {toast} = useToast()
const athleteStore = useAthleteStore()
const globalStore = useGlobalStore()
const {$swal} = useNuxtApp()

const deleteAthlete = async (id) => {
    const result = await $swal.fire({
        title: "Вы уверены, что хотите удалить этого атлета?",
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: "Удалить",
        confirmButtonColor: "#dc3545",
        cancelButtonText: "Отмена",
    })

    if (result.isConfirmed) {
        await athleteStore.deleteAthlete(id).then(() => {
            toast({
                title: 'Атлет успешно удалён',
                variant: 'success',
            })
        })
    }
}

function getFlagName(nation){
    if(nation === 'RUS') return 'ru'
    if(nation === 'KAZ') return 'kz'
    if(nation === 'BEL') return 'by'
    return null
}
</script>