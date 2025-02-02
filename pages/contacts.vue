<template>
    <DefaultLayout>
        <template #content>
            <PageTitle title="Контакты" />
            <div v-if="page" class="page_section">
                <div class="container">
                    <div v-if="page.contacts" class="content_box p-4 mb-4">
                        <div v-for="(item, i) in page.contacts" :key="i" class="contacts_row">
                            <p v-if="item.name" class="fs-4 font-bold">{{item.name}}</p>
                            <div v-if="item.manager_name" class="table_name_item flex items-center mb-3">
                                <Avatar :src="item.avatar" :name="item.manager_name" :class="'me-2'" />
                                <span class="font-bold">{{item.manager_name}}</span>
                            </div>
                            <div class="row g-4">

                                <div v-for="(phone, index) in item.phones" :key="index" class="col-auto">
                                    <p class="text-sub mb-1">{{phone.label ? phone.label : 'Телефон:'}}</p>
                                    <a :href="'tel:'+phone.phone" class="text_20 font-bold text-decoration-none mb-0">{{phone.phone}}</a>
                                </div>

                                <div v-if="item.email" class="col-auto">
                                    <p class="text-sub mb-1">Электронная почта:</p>
                                    <a :href="'mailto:'+item.email" class="text_20 text-decoration-none mb-0">{{item.email}}</a>
                                </div>

                                <div v-if="item.workhours" class="col-auto">
                                    <p class="text-sub mb-1">Режим работы:</p>
                                    <p class="text_20 text-decoration-none mb-0">{{item.workhours}}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="page.requisits && page.requisits[0]" class="requisits_box bg-secondary rounded px-4 py-5">
                        <h2 class="text-accent fs-2 font-bold uppercase font-oswald mb-4">Реквизиты</h2>
                        <div class="row g-4 text-white">
                            <div v-if="page.requisits[0].company_name" class="col-auto">
                                <p class="text-sub mb-1">Компания:</p>
                                <p class="mb-0">{{page.requisits[0].company_name}}</p>
                            </div>
                            <div v-if="page.requisits[0].address" class="col-auto">
                                <p class="text-sub mb-1">Юридический адрес:</p>
                                <p class="mb-0">{{page.requisits[0].address}}</p>
                            </div>
                            <div v-if="page.requisits[0].orgn" class="col-auto">
                                <p class="text-sub mb-1">ОГРН:</p>
                                <p class="mb-0">{{page.requisits[0].orgn}}</p>
                            </div>
                            <div v-if="page.requisits[0].inn" class="col-auto">
                                <p class="text-sub mb-1">ИНН:</p>
                                <p class="mb-0">{{page.requisits[0].inn}}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </template>
    </DefaultLayout>
</template>

<script>
import Avatar from '../components/UI/Avatar'
import PageTitle from '../components/PageTitle'
import DefaultLayout from '../layouts/DefaultLayout'
import {
    mapGetters, mapActions
} from "vuex";

export default {
    components: {
        Avatar,
        PageTitle,
        DefaultLayout, Avatar
    },
    async mounted() {
        await this.fetchContacts()
        setMeta(
            'Контакты | Swim4you.ru',
            null,
            null,
            false
        )
    },
    methods: {
        ...mapActions({
            fetchContacts: "page/fetchContacts",
        }),
    },
    computed: {
        ...mapGetters({
            page: "page/getContacts",
        }),
    }
}
</script>

<style>

</style>
