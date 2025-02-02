<template>
    <form @submit="onSubmit" class="grid gap-2" >
        <div v-for="(field, idx) in fields" :key="idx">
            <AthleteDocumentField
                    :name="`documents.${idx}`"
                    :initial-value="field.value"
            />
        </div>
        <GlobalErrorAlert v-if="errors.global" :error="errors.global" />
        <Button :disabled="loading" variant="primary" type="submit" class="rounded-full mt-auto px-5 py-7 mb-7 mt-5">
            <span v-if="loading"><Icon name="svg-spinners:ring-resize" /></span>
            <span v-else>Сохранить</span>
        </Button>
    </form>
</template>

<script setup lang="ts">
import {Form, useFieldArray, useForm} from 'vee-validate'
import AthleteDocumentField from "~/components/UI/Fields/AthleteDocumentField.vue";
import {Button} from "~/components/shadcn/ui/button";
import {useToast} from "~/components/shadcn/ui/toast";
import GlobalErrorAlert from "~/components/forms/GlobalErrorAlert.vue";

const {toast} = useToast()
const loading = ref(false)

interface DocumentSchemaItem {
    id: number
    name: string
    description: string | null
    is_multiple: boolean
}

interface AthleteDocumentItem extends DocumentSchemaItem {
    files: string[]
}

const props = defineProps<{
    documentSchema: DocumentSchemaItem[],
    initialValue: AthleteDocumentItem[],
    selected_athlete: Object
}>()
const emit = defineEmits(['saved'])

const athleteStore = useAthleteStore()
const { handleSubmit, errors } = useForm({
    initialValues: {
        documents: []
    }
})
const { fields, replace } = useFieldArray('documents')

watch(() => props.documentSchema, (schema) => {
    if (!schema) return

    const initialValueMap = new Map(
        props.initialValue?.map(item => [item.id, item]) || []
    )

    const newFields = schema.map(schemaItem => {
        const existingValue = initialValueMap.get(schemaItem.id)
        return {
            files: [],
            ...schemaItem,
            ...existingValue
        }
    })

    replace(newFields)
}, { immediate: true })

const onSubmit = handleSubmit(async (values: any, context: any) => {
    console.log(values)
    loading.value = true
    await athleteStore.uploadDocuments(values, props.selected_athlete.id)
        .then((response) => {
            toast({
                title: 'Документы успешно обновлены',
                variant: 'success',
            })
            emit('saved')
        }).catch((error) => {
            context.setErrors({global: error.data?.message, ...error.data.errors})
        }).finally(() => {
            loading.value = false
        })
})
</script>