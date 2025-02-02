<template>
    <WithSidebarLayout>
        <template #head>
            <page-title :title="page.name" />
        </template>
        <template #content>
            <template v-if="page.content">
                <div v-if="page.childs" class="row g-4 mb-4">
                    <div v-for="(item, i) in page.childs" :key="i" class="col-md-6">
                        <div class="inner_page_link content_box p-4">
                            <h2 class="font-oswald uppercase font-bold fs-4 mb-3">{{item.name}}
                            </h2>
                            <NuxtLink :to="'/page/'+item.id" class="btn btn-primary btn-primary-shadow btn-rounded px-5">Перейти</NuxtLink>
                        </div>
                    </div>
                </div>
                <template v-for="(section, section_i) in page.content" :key="section_i">
                    <div class="content_box p-4 mb-4">
                        <h2 v-if="section.name" class="font-oswald uppercase font-bold">{{section.name}}</h2>
                        <p v-if="section.description" class="text_20 text-sub">{{section.description}}</p>
                        <template v-if="section.type == 'text' && section.text">
                            <div v-html="section.text" class="post_item__content longtext_content"></div>
                        </template>

                        <template v-if="section.type == 'buttons' && section.buttons">
                            <div class="row g-4">
                                <div v-for="(item, i) in section.buttons" :key="i" class="col-auto">
                                    <a :href="item.link" target="_blank" class="btn btn-primary btn-primary-shadow btn-rounded">{{item.name}}</a>
                                </div>
                            </div>
                        </template>

                        <template v-if="section.type == 'docs' && section.docs">
                            <div v-for="(item, i) in section.docs" :key="i" class="link_item flex justify-between  items-center bg-body mb-2">
                                <span class="d-block font-bold font-20 p-3">{{item.name}}</span>
                                <a :href="item.link" target="_blank" class="link_item__icon p-3">
                                    <vue-feather type="download" />
                                </a>
                            </div>
                        </template>

                    </div>
                </template>
            </template>

        </template>
        <template #sidebar>
            <SidebarNews />
        </template>
    </WithSidebarLayout>
</template>

<script>
import SidebarNews from '../components/SidebarNews'
import PageTitle from '../components/PageTitle'
import WithSidebarLayout from '../layouts/WithSidebarLayout'
import {
    mapGetters, mapActions
} from "vuex";

export default {
    components: {
        SidebarNews,
        PageTitle,
        WithSidebarLayout,
    },
    data(){
        return {
            page: {},
            alerts: null,
        }
    },
    async mounted() {
        await this.fetchPage(this.$route.params.id)
        this.page = this.getPage
        setMeta(
            this.page.seo_title,
            this.page.seo_description,
            null,
            this.page.seo_robots
        )
    },
    async updated(){
        await this.fetchPage(this.$route.params.id)
        this.page = this.getPage
    },
    methods: {
        ...mapActions({
            fetchPage: "page/fetchPage",
        }),
    },
    computed: {
        ...mapGetters({
            getPage: "page/getPage",
        }),
    },
    /* metaInfo() {
        return setMeta(
            this.page.seo_title,
            this.page.seo_description,
            null,
            this.page.seo_robots
        )
    }, */
}
</script>

<style>
</style>
