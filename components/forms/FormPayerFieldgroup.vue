<template>
    <div class="content_box p-4 mb-3">
        <div class="content_box__header flex justify-between items-center mb-3 relative z-2">
            <h2 class="title_block mb-2 text-muted">Плательщик</h2>
        </div>

        <div class="grid gap-4">
            <TextField
                    name="payers_name"
                    label="ФИО плательщика"
                    required
                    :initial-value="payers_name || userStore.userdata?.name"
            />
            <PhoneField
                name="payers_phone"
                label="Телефон плательщика"
                required
                :initial-value="payers_phone || userStore.userdata?.phone"
            />
            <EmailField
                name="payers_email"
                label="Email плательщика"
                required
                :initial-value="payers_email || userStore.userdata?.email"
            />
        </div>
    </div>
</template>

<script setup>
import TextField from "~/components/UI/Fields/TextField.vue";
import PhoneField from "~/components/UI/Fields/PhoneField.vue";
import EmailField from "~/components/UI/Fields/EmailField.vue";
const userStore = useUserStore()
const props = defineProps({
    payers_name: {
        type: String,
        default: '',
    },
    payers_phone: {
        type: String,
        default: '',
    },
    payers_email: {
        type: String,
        default: '',
    },
})
</script>