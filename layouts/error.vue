<template>
    <DefaultLayout>
        <template #content>
            <div class="page_section">
                <div class="container">
                    <div class="page_404 text-center py-5 my-3">
                        <h1 class="page_title">Похоже, что такой страницы не существует</h1>
                        <p class="page_subtitle mb-4">Вы можете вернуться назад или на главную страницу, а также воспользоваться поиском по сайту</p>
                        <div class="buttons_cont mb-5">
                            <a href="#" @click="this.$router.go(-2)" class="btn btn-primary  btn-rounded me-3">Назад</a>
                            <NuxtLink to="/" class="btn btn-primary btn-rounded">На главную</NuxtLink>
                        </div>
                        <img src="/img/404.svg">
                    </div>
                </div>
            </div>
        </template>
    </DefaultLayout>
</template>

<script>
import DefaultLayout from '../layouts/DefaultLayout.vue'

export default {
    components: { DefaultLayout },
    mounted() {
        setMeta(
            'Страницы не существует | Swim4you.ru',
            null,
            null,
            false
        )
    },
}
</script>

<style scoped>
.page_title{
    font-family: 'Oswald', sans-serif;
    text-transform: uppercase;
    font-size: 40px;
}

@media(max-width: 768px){
    .page_title{
        font-size: 30px;
    }
}
</style>
