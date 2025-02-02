<script setup lang="ts">
import { useField } from 'vee-validate';
import { ref, computed } from 'vue';
import { FormField, FormMessage } from '@/components/shadcn/ui/form';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "~/components/shadcn/ui/card";
import {Button} from "~/components/shadcn/ui/button";


interface FileItem {
    url: string;
    name: string;
    type: 'uploaded' | 'server';
    file?: File;
}

interface DocumentItem {
    id: number;
    name: string;
    description: string;
    is_multiple: boolean;
    files: (string | FileItem)[];
}

const props = defineProps<{
    name: string;
    initialValue?: DocumentItem;
}>();

const ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf'
];

const ALLOWED_EXTENSIONS = '.jpg,.jpeg,.png,.pdf';

const validate = (value: any) => {
    if (!value) return true;
    if (!Array.isArray(value.files)) return 'Неверный формат файла';

    // Проверяем каждый загруженный файл
    const invalidFile = value.files.find(file =>
        typeof file === 'object' &&
        file.type === 'uploaded' &&
        file.file &&
        !ALLOWED_TYPES.includes(file.file.type)
    );

    if (invalidFile) {
        return 'Разрешены только JPG, JPEG, PNG и PDF файлы';
    }

    return true;
};

const { value, setValue, errorMessage } = useField(() => props.name, validate, {
    // Важно! Указываем initialValue чтобы форма знала начальное значение
    initialValue: props.initialValue
});
const fileInputRef = ref<HTMLInputElement | null>(null);
const isInitialized = ref(false);

const getFileName = (fileItem: FileItem | string) => {
    try {
        if (typeof fileItem === 'object') {
            return fileItem.name;
        }

        const urlWithoutParams = fileItem.split('?')[0];
        return decodeURIComponent(urlWithoutParams.split('/').pop() || '') || fileItem;
    } catch {
        return typeof fileItem === 'string' ? fileItem : 'Неизвестный файл';
    }
};

watch(() => props.initialValue, (newValue) => {
    if (isInitialized.value || !newValue) return;
    
    const files = newValue.files.map(file =>
        typeof file === 'string'
            ? { url: file, name: getFileName(file), type: 'server' as const }
            : file
    );

    value.value = {
        id: newValue.id,
        name: newValue.name,
        description: newValue.description,
        is_multiple: newValue.is_multiple,
        files
    };

    isInitialized.value = true;
}, { immediate: true, deep: true });

const handleClick = () => {
    fileInputRef.value?.click();
};

const handleChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    // Проверяем типы файлов перед добавлением
    const validFiles = Array.from(input.files).filter(file =>
        ALLOWED_TYPES.includes(file.type)
    );

    if (validFiles.length !== input.files.length) {
        alert('Некоторые файлы не были добавлены. Разрешены только форматы JPG, JPEG, PNG, PDF.');
    }

    const newFiles = validFiles.map(file => ({
        url: URL.createObjectURL(file),
        name: file.name,
        type: 'uploaded' as const,
        file
    }));

    console.log({
        ...value.value,
        files: [...value.value.files, ...newFiles]
    })

    setValue({
        ...value.value,
        files: [...(value.value?.files || []), ...newFiles]
    });
    console.log(value.value)
    input.value = '';
};

const removeFile = (index: number) => {
    if (!value.value?.files) return;

    const files = [...value.value.files];
    const removedFile = files[index];

    if (typeof removedFile === 'object' && removedFile.type === 'uploaded') {
        URL.revokeObjectURL(removedFile.url);
    }

    files.splice(index, 1);

    setValue({
        ...value.value,
        files
    });
};

const getUploadedFiles = () => {
    if (!value.value?.files) return [];

    return value.value.files
        .filter((file): file is FileItem =>
            typeof file === 'object' && file.type === 'uploaded' && !!file.file
        )
        .map(item => item.file!);
};

const getServerUrls = () => {
    if (!value.value?.files) return [];

    return value.value.files
        .filter((file): file is FileItem =>
            typeof file === 'string' || (typeof file === 'object' && file.type === 'server')
        )
        .map(file => typeof file === 'string' ? file : file.url);
};

onBeforeUnmount(() => {
    if (!value.value?.files) return;

    value.value.files.forEach(file => {
        if (typeof file === 'object' && file.type === 'uploaded') {
            URL.revokeObjectURL(file.url);
        }
    });
});

const isMultipleAllowed = computed(() => value.value?.is_multiple ?? false);

defineExpose({
    getUploadedFiles,
    getServerUrls
});

const globalStore = useGlobalStore()
const currentDocument = computed(() => {
    return globalStore.athlete_documents.find(item => item.id === props.initialValue?.id);
})

</script>

<template>
    <Card class="shadow-none">
        <CardHeader class="p-3 gap--0">
            <div class="grid grid-cols-4 gap-2">
                <div class="col-span-full md:col-span-3">
                    <CardTitle v-if="currentDocument?.name" class="text-sm md:text-lg">{{currentDocument?.name}}</CardTitle>
                    <CardDescription v-if="currentDocument?.description" class="text-xs md:text-sm text-sub">{{ currentDocument?.description }}</CardDescription>
                </div>
                <Button
                        v-if="!value?.files?.length || currentDocument.is_multiple"
                        type="button"
                        @click="handleClick"
                        class="col-span-full md:col-span-1 uppercase text-xs px-3"
                >
                    <Icon name="lucide:upload" class="h-4 w-4" />
                    Добавить
                </Button>
            </div>
            
        </CardHeader>
        <CardContent class="p-3 pt-0">
            <div v-if="value?.files?.length" class="grid gap-1">
                <div
                        v-for="(file, index) in value.files"
                        :key="index"
                        class="text-sm text-slate-600 flex items-center justify-between gap-2 bg-slate-100 rounded-md"
                >
                    <div class="flex justify-between items-center gap-2">
                        <Button
                                variant="ghost"
                                type="button"
                                size="icon"
                                as-child
                                class="shrink-0"
                        >
                            <NuxtLink :to="file.url" external target="_blank">
                                <Icon name="ri:eye-line" class="text-primary-500" />
                            </NuxtLink>
                        </Button>
                        
                        <p class="text-xs md:text-sm line-clamp-1">{{ getFileName(file) }}</p>
                    </div>
                    
                    <Button
                            variant="ghost"
                            type="button"
                            size="icon"
                            class="text-red-500 hover:text-red-700 shrink-0"
                            @click.prevent="() => removeFile(index)"
                    >
                        <Icon name="lucide:x" class="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div v-else class="bg-amber-200 rounded-md p-2 text-center text-sm font-bold">Документы не добавлены</div>
            <FormField :name="name">
                <input
                        ref="fileInputRef"
                        type="file"
                        :name="name"
                        class="hidden"
                        :multiple="isMultipleAllowed"
                        :accept="ALLOWED_EXTENSIONS"
                        @change="handleChange"
                />
                <FormMessage />
            </FormField>
        </CardContent>
    </Card>
</template>