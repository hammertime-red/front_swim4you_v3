<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/shadcn/ui/form";
import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { ref } from "vue";

const props = defineProps({
    class: {
        type: String,
    },
    label: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    required: {
        type: Boolean,
        default: false
    },
    maxSize: {
        type: Number,
        default: 5 * 1024 * 1024 // 5MB по умолчанию
    },
    acceptedTypes: {
        type: Array as PropType<string[]>,
        default: () => ['image/jpeg', 'image/png', 'image/webp']
    },
    initialValue: {
        type: [File, String],
    },
    dropZoneClass: {  // новый пропс для стилизации зоны загрузки
        type: String,
        default: 'w-full h-64'  // дефолтные размеры
    },
});

const emit = defineEmits(['change'])
const dragActive = ref(false)
const previewUrl = ref<string | null>(null)

const validationSchema = props.required
    ? z.instanceof(File, { message: 'Это поле обязательно' })
        .refine(
            (file) => file.size <= props.maxSize,
            `Размер файла не должен превышать ${props.maxSize / (1024 * 1024)}MB`
        )
        .refine(
            (file) => props.acceptedTypes.includes(file.type),
            'Неподдерживаемый формат файла'
        )
    : z.instanceof(File, { message: 'Некорректный формат файла' })
        .refine(
            (file) => file.size <= props.maxSize,
            `Размер файла не должен превышать ${props.maxSize / (1024 * 1024)}MB`
        )
        .refine(
            (file) => props.acceptedTypes.includes(file.type),
            'Неподдерживаемый формат файла'
        )
        .optional()
        .or(z.literal(''))
        .or(z.null());

const { setValue, value } = useField(props.name, toTypedSchema(validationSchema))

watch(() => props.initialValue, (newValue) => {
    if (newValue) {
        if (newValue instanceof File) {
            setValue(newValue);
            updatePreview(newValue);
        } else if (typeof newValue === 'string') {
            // Если передан URL изображения
            previewUrl.value = newValue;
        }
    }
}, { immediate: true });

watch(value, (newValue) => {
    emit('change', newValue);
});

const updatePreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        previewUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
};

const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    dragActive.value = false;

    if (e.dataTransfer?.files.length) {
        const file = e.dataTransfer.files[0];
        setValue(file);
        updatePreview(file);
    }
};

const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    dragActive.value = true;
};

const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    dragActive.value = false;
};

const handleFileSelect = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.files?.length) {
        const file = input.files[0];
        setValue(file);
        updatePreview(file);
    }
};
</script>

<template>
    <FormField v-slot="{ value: fieldValue }" :name="name">
        <FormItem :class="props.class">
            <FormLabel v-if="label">
                <span class="font-bold">{{ label }}</span>
                <span v-if="required" class="text-destructive">*</span>
            </FormLabel>
            <FormControl>
                <div
                        :class="[
                        props.dropZoneClass,
                        'relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer',
                        dragActive ? 'border-primary bg-primary/5' : 'border-gray-300',
                        'hover:bg-gray-50 transition-colors'
                    ]"
                        @drop="handleDrop"
                        @dragover="handleDragOver"
                        @dragleave="handleDragLeave"
                >
                    <!-- Превью изображения -->
                    <div v-if="previewUrl" class="absolute inset-0 flex items-center justify-center">
                        <img
                                :src="previewUrl"
                                class="max-w-full max-h-full object-contain rounded-lg"
                                alt="Preview"
                        />
                        <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                            <Icon name="ri:upload-cloud-line" size="48" class="text-white opacity-0 hover:opacity-100" />
                        </div>
                    </div>

                    <!-- Placeholder -->
                    <div v-else class="flex flex-col items-center justify-center p-6 text-center">
                        <Icon name="ri:image-add-line" size="48" class="text-slate-400" />
                        <p class="mt-4 text-sm text-gray-600">
                            Перетащите изображение сюда или кликните для выбора
                        </p>
                        <p class="mt-2 text-xs text-gray-500">
                            PNG, JPG или WEBP (макс. {{ props.maxSize / (1024 * 1024) }}MB)
                        </p>
                    </div>

                    <!-- Hidden file input -->
                    <input
                            type="file"
                            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            :accept="props.acceptedTypes.join(',')"
                            @change="handleFileSelect"
                    />
                </div>
            </FormControl>
            <FormMessage />
        </FormItem>
    </FormField>
</template>