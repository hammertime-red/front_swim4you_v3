<template>
    <div class="content_box px-4 py-6">
        <div class="content_box__header flex justify-between items-center mb-6 relative z-2">
            <h2 class="title_block">Данные команды</h2>
            <Button variant="secondary" size="sm" @click.prevent="itsMeMario">Представитель - это я</Button>
        </div>
        <div class="grid lg:grid-cols-2 gap-3">
            <div class="flex gap-1">
                <SelectField
                        @change="selectClub"
                        class="w-full"
                        name="club_id"
                        label="Выберите клуб"
                        :options="userStore.clubs.map(item => {
                            return {
                                label: item.name,
                                value: item.id
                            }
                        })"
                        required
                    />
                <AddClubModal v-if="selectedClub" :selected_club="selectedClub">
                    <Button type="button" variant="secondary" size="icon" class="h-10 mt-[25px] shrink-0"><Icon name="ri:edit-2-line" /></Button>
                </AddClubModal>
                <AddClubModal v-else>
                    <Button type="button" variant="secondary" size="icon" class="h-10 mt-[25px] shrink-0"><Icon name="ri:add-fill" /></Button>
                </AddClubModal>
                
            </div>
            
            <TextField
                    class=""
                    name="agent_name"
                    label="ФИО представителя"
                    :initialValue="initialValues.agent_name"
                    required
            />
            <PhoneField
                    class=""
                    name="agent_phone"
                    label="Телефон"
                    :initialValue="initialValues.agent_phone"
                    required
            />
            <EmailField
                    class=""
                    name="agent_email"
                    label="Email"
                    :initialValue="initialValues.agent_email"
                    required
            />
        </div>
    </div>
<!--    <AddClub
        :visible="modals_visible.add_club"
        @changeData="changeClubs"
        @hide="modals_visible.add_club = false"
    />
    <AddClub
        :selected_club="this.selected_club"
        :visible="modals_visible.edit_club"
        @changeData="changeClubs"
        @hide="modals_visible.edit_club = false"
    />-->
</template>

<script setup>
import AddClubModal from "@/components/offcanvases/AddClubModal.vue";
import SelectField from "~/components/UI/Fields/SelectField.vue";
import TextField from "~/components/UI/Fields/TextField.vue";
import {Button} from "~/components/shadcn/ui/button";
import PhoneField from "~/components/UI/Fields/PhoneField.vue";
import EmailField from "~/components/UI/Fields/EmailField.vue";

const userStore = useUserStore();
const selectedClub = ref(null)
const initialValues = ref({
    club_id: null,
    agent_name: "",
    agent_phone: "",
    agent_email: "",
})

function itsMeMario(){
    initialValues.value.agent_name = userStore.userdata.name
    initialValues.value.agent_phone = userStore.userdata.phone
    initialValues.value.agent_email = userStore.userdata.email
}

function selectClub(id){
    selectedClub.value = userStore.clubs.find((club) => club.id === id) || null
    if(selectedClub.value){
        initialValues.value.agent_name = selectedClub.value.agent_name
        initialValues.value.agent_phone = selectedClub.value.agent_phone
        initialValues.value.agent_email = selectedClub.value.agent_email
    }
}

</script>

<style>
</style>