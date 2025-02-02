<template>
    <div class="content_box p-4">
        <div class="row gy-4">
            <div
                v-for="(item, i) in items"
                :key="i"
                :class="
                    items.length % 3 == 0 || items.length % 5 == 0
                        ? 'col-md-4'
                        : 'col-md-6'
                "
            >
                <div class="file_box p-3 bg-body rounded flex">
                    <div class="file_ext_icon flex items-center me-3">
                        <vue-feather
                            type="file-text"
                            class="text-sub"
                        ></vue-feather>
                    </div>
                    <div
                        class="
                            file_content
                            h-full
                            flex
                            flex-col
                            justify-between
                            items-start
                        "
                    >
                        <p class="mb-2">{{ item.name }}</p>
                        <a
                            :href="item.url"
                            target="_blank"
                            class="btn btn-white btn-rounded btn-sm px-5"
                        >
                            <vue-feather type="download" class="text-primary">
                            </vue-feather
                            >Скачать
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["items"],
};
</script>

<style>
</style>