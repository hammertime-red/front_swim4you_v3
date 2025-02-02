<template>
<div class="hero_intro text-white" :style="'background-image: url('+backgroundImg()+');'">
    <div class="hero_intro__overlay"></div>
    <div class="container">
        <h1 v-if="title" class="intro_title_ultrabig mb-3">{{title}}</h1>
        <nav v-if="breadcrumbs || title" style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='9 18 15 12 9 6'%3E%3C/polyline%3E%3C/svg%3E&#34;);" class="breadcrumbs" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item">
                    <a href="#">
                        <vue-feather type="home" /></a>
                </li>
                <li v-for="(item, index) in breadcrumbs" :key="index" class="breadcrumb-item">
                            <NuxtLink :to="item.link">
                                {{item.title}}
                            </NuxtLink>
                        </li>
                <li v-if="title" class="breadcrumb-item active" aria-current="page">{{title}}</li>
            </ol>
        </nav>
        <button v-if="button_text" class="btn btn-warning btn-rounded mt-3 px-5" @click.prevent.stop="$emit('btnClick')">{{button_text}}</button>
    </div>
</div>
</template>

<script>
export default {
    props: ['title', 'image', 'image_sm', 'breadcrumbs', 'button_text'],
    methods: {
        backgroundImg() {
            if (window.innerWidth < 768) {
                return this.image_sm;
            } else {
                return this.image;
            }
        },
    }
}
</script>

<style scoped>
    .hero_intro{
        min-height: 400px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    /* @media(max-width: 768px){
        .breadcrumbs{
            display: none;
        }
    } */
</style>
