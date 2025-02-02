<template>
<div class="hero_intro text-white" :style="'background-image: url('+backgroundImg()+');'">
    <div class="container">
        <h1 class="intro_title_medium mb-3">Фотобанк Соревнований по плаванию</h1>
        <PhtSearchForm />
    </div>
</div>
</template>

<script>
import PhtSearchForm from './PhtSearchForm'
export default {
    data(){
        return {
            background: {
                desktop: '/assets/img/pht/pht_back_1.jpg',
                mobile: '/assets/img/pht/pht_back_1.jpg',
            },

        }
    },
    methods: {
        backgroundImg() {
            if (window.innerWidth < 768) {
                return this.background.mobile;
            } else {
                return this.background.desktop;
            }
        },
    },
    components: { PhtSearchForm },
}
</script>

<style scoped>
    .hero_intro{
        min-height: 500px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 180px 0;
    }

    @media(max-width: 768px){
        .hero_intro{
            padding: 120px 0;
        }
    }

    .intro_title_medium{
        text-align: center;
        max-width: 850px;
        margin: 0 auto 30px;
    }

    @media(max-width: 768px){
        .breadcrumbs{
            display: none;
        }
    }
</style>
