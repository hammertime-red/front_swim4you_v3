<template>
    <div class="grid grid-cols-1 md:grid-cols-12 gap-2 relative" :class="'key_' + index">
        <SelectField
                :options="sortedAllowedDistances"
                :name="`${name}.distance_id`"
                label="Выберите дистанцию"
                placeholder="Выберите вариант"
                option-label="name"
                option-value="id"
                required
                :disabled-condition="(option) => isDistanceDisabled(option.id)"
                :get-description="(option) => isDistanceDisabled(option.id) ? 'Нет мест' : null"
                @select="changeDistance"
                :disabled="reservationStatus === 'reserved'"
                class="md:col-span-5"
        />
        <template v-if="fieldValue.distance_id">
            <EntrytimeField
                    :name="`${name}.entrytime`"
                    label="Заявочное время"
                    class="md:col-span-3"
                    :initial-value="initialEntryTime"
                    :disabled="systemEntrytimeValue"
            />
            <div class="md:col-span-4">
                <span class="font-bold text-sm">Статус</span>
                <div class="h-10 flex flex-col items-center justify-start my-1">
                    <DistanceStatus
                            :status="fieldValue.reservation_status"
                            :is_payed="fieldValue.is_payed"
                            class="h-full"
                    />
                </div>
            </div>
        </template>
        <Button
                v-if="canDelete"
                type="button"
                variant="ghost"
                size="icon"
                @click.prevent="deleteDistance"
                class="text-destructive ms-auto rounded-full absolute top-2 right-2"
        >
            <Icon name="ri:delete-bin-5-line"/>
        </Button>
    </div>
</template>

<script setup>
import { distanceTemplate } from '@/helpers/formTemplates'
import SelectField from "~/components/UI/Fields/SelectField.vue"
import DistanceStatus from './DistanceStatus.vue'
import moment from 'moment'
import {useField} from "vee-validate";
import EntrytimeField from "~/components/UI/Fields/EntrytimeField.vue";
import {Button} from "~/components/shadcn/ui/button";
import {toTypedSchema} from "@vee-validate/zod";
import {z} from "zod";

const { $swal } = useNuxtApp()

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    allowedDistances: {
        type: Array,
        default: () => [],
    },
    used_distances: {
        type: Array,
        default: () => [],
    },
    index: {
        type: Number,
        required: true,
    },
    athlete: {
        type: Object,
        default: () => null,
    },
    canDelete: {
        type: Boolean,
        default: false,
    },
    modelValue: {
        type: Object,
        default: () => ({}),
    },
    disabled: {
        type: Boolean,
        default: false,
    }
})

const {value: fieldValue, setValue: setFieldvalue} = useField(props.name)

const systemEntrytimeSchema = z.boolean().default(false);
const keySchema = z.string().nullable().default(null);
const reservationStatusSchema = z.string().default(null);
const idSchema = z.number().nullable().default(null);

const {value: systemEntrytimeValue, setValue: setSystemEntrytimeValue} = useField(`${props.name}.is_system_entrytime`, toTypedSchema(systemEntrytimeSchema))
const {value: keyValue, setValue: setKeyValue} = useField(`${props.name}.key`, toTypedSchema(keySchema))
const {value: reservationStatus} = useField(`${props.name}.reservation_status`, toTypedSchema(reservationStatusSchema))
const {value: idValue} = useField(`${props.name}.id`, toTypedSchema(idSchema))

const emit = defineEmits(['changeDistance', 'removeDistance'])

// Injected values
const show_errors = inject('show_errors', false)
const postData = inject('postData')
const athletesSetFields = inject('athletesSetFields')
const setLoading = inject('setLoading')
const initialEntryTime = ref('')

const disabledDistances = computed(() => {
    return postData.distances.reduce((acc, distance) => {
        const distance_used = athletesSetFields.value.reduce((count, fieldgroup) => {
            return count + fieldgroup.value.distances.filter(item => item.id === distance.id).length;
        }, 0);

        if (distance.places_reserved + distance_used >= distance.places_limit) {
            acc.push(distance.id);
        }

        return acc;
    }, []);
});

// Computed
const distance = computed(() => {
    if (!fieldValue.value.distance_id) return
    return postData.distances.find(item => item.id === fieldValue.value.distance_id)
})

const distanceKey = computed(() => {
    if (fieldValue.value.id && fieldValue.value.key) return fieldValue.value.key
    if (!props.athlete?.id || !fieldValue.value.distance_id) return null
    return props.athlete?.id + '__' + fieldValue.value.distance_id
})

const hasDistancePlaces = computed(() => {
    if (!distance.value) return false
    return distance.value.places_reserved < distance.value.places_limit
})

const sortedAllowedDistances = computed(() => {
    return props.allowedDistances
        .sort((a, b) => a.distance - b.distance)
        .sort((a, b) => isDistanceDisabled(a.id) - isDistanceDisabled(b.id))
})

// Methods
const changeDistance = async () => {
    setLoading(true)

    if (hasDistancePlaces.value) {
        setEntrytime()
        setKeyValue(distanceKey.value)
    } else {
        setFieldvalue({...distanceTemplate})
        $swal.warning('К сожалению, в этой дистанции закончились места')
    }

    setLoading(false)
}

const deleteDistance = async () => {
    if (!fieldValue.value?.id) {
        emit('removeDistance', props.index)
        return
    }

    const result = await $swal.fire({
        title: "Вы уверены, что хотите удалить эту дистанцию?",
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: "Удалить",
        confirmButtonColor: "#dc3545",
        cancelButtonText: "Отмена",
    })

    if (result.isConfirmed) {
        setLoading(true)
        await fetchAuth(`/event/order/item/${fieldValue.value?.id}`, {
            method: "DELETE",
        }).then(() => {
            emit('removeDistance', props.index)
        }).finally(() => {
            setLoading(false)
        })
    }
}

const setEntrytime = () => {
    
    const entrytimes = props.athlete.best_results.filter(
        (item) =>
            item.stroke === distance.value.stroke &&
            item.distance === distance.value.distance &&
            item.gender === distance.value.gender
    )

    if (entrytimes.length) {
        if (entrytimes.length === 1) {
            initialEntryTime.value = entrytimes[0].short_swimtime
        } else {
            initialEntryTime.value = entrytimes.sort(
                (a, b) => moment(a.short_swimtime, 'mm:ss.SS') - moment(b.short_swimtime, 'mm:ss.SS')
            )[0].short_swimtime
        }
        setSystemEntrytimeValue(true)
        return false
    }
    
    setSystemEntrytimeValue(false)
}

const isDistanceDisabled = (distance_id) => {
    return disabledDistances.value.includes(distance_id) ||
        props.used_distances.includes(distance_id)
}
</script>

<style>
.system_entrytime_text {
    font-size: 12px;
}
</style>