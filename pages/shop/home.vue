<template>
    <ShopLayout>
        <template #content>
            <ShopIntro v-if="intro" :item="intro" class="mb-5" />
            <ShopCategoriesCarousel
                v-if="categories && categories.length"
                :items="categories"
                class="mb-6" />
            <ShopBannersSection v-if="banners && banners.length" :items="banners" class="mb-7" />
            <section class="home_products mb-7">
                <div class="container">
                    <div class="row g-4 mb-4 items-center">
                        <div class="col-md-9">
                            <p class="section_title">Бестселлеры</p>
                        </div>
                        <div class="col-md-3">
                            <NuxtLink
                                :to="{ name: 'shop' }"
                                class="btn btn-primary btn-rounded btn-primary-shadow w-full"
                            >Смотреть все товары</NuxtLink
                            >
                        </div>
                    </div>
                    <ShopProductGrid :filter="{ is_featured: 1 }" />
                </div>
            </section>
        </template>
        <template #offcanvas> </template>
    </ShopLayout>
</template>

<script>
import ShopProductGrid from '~/components/shop/ShopProductGrid'
import ShopBannersSection from '~/components/shop/ShopBannersSection'
import ShopCategoriesCarousel from '~/components/shop/ShopCategoriesCarousel'
import ShopIntro from '~/components/shop/ShopIntro'
import ShopLayout from '@/layouts/ShopLayout'
import axios from 'axios'

export default {
    data() {
        return {
            intro: null,
            categories: null,
            banners: null,
        }
    },
    created() {
        setMeta(
            'Магазин | Swim4you.ru',
            null,
            null,
            false
        )
        this.fetchHome()
    },
    methods: {
        async fetchHome() {
            try {
                const response = await axios.get(process.env.VUE_APP_BASE_URL + 'shop/home')
                if (response.data) {
                    this.intro = response.data.intro ? response.data.intro : null
                    this.categories = response.data.categories ? response.data.categories : null
                    this.banners = response.data.banners ? response.data.banners : null
                }
            } catch (e) {
                console.log(e.response)
                alert('Ошибка получения данных с сервера о главной странице')
            }
        },
    },
    components: {
        ShopProductGrid,
        ShopBannersSection,
        ShopCategoriesCarousel,
        ShopIntro,
        ShopLayout,
    },
}
</script>

<style></style>
