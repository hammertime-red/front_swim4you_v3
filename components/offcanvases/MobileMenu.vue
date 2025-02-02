<template>
<COffcanvas placement="start" :visible="globalStore.getOffcanvas('mobile_menu')" @hide="globalStore.closeOffcanvas('mobile_menu')">
    <div class="offcanvas-header justify-content-end">
        <button @click="globalStore.closeOffcanvas('mobile_menu')" type="button" class="btn-close text-reset"></button>
    </div>
    <div class="offcanvas-body">
        <nav class="mobile_menu">
            <ul>
                <li v-for="el in globalStore.getMainMenu" :key="el.id" class="menu_item" :class="el.children.length ? 'menu_item--with_children' : ''">

                    <a v-if="isExternal(el)" :href="el.url" ><span>{{ el.title }}</span></a>
                    <NuxtLink v-else :to="el.url" @click="globalStore.closeOffcanvas('mobile_menu')"><span>{{ el.title }}</span></NuxtLink>


                    <span v-if="el.children.length" @click="el.isActive = !el.isActive" class="submenu_trigger">
                        <vue-feather type="chevron-down" size="16" />
                    </span>
                    <ul v-if="el.children.length && el.isActive" class="sub_menu">
                        <li v-for="child in el.children" :key="child.id" class="menu_item">
                            <a v-if="isExternal(child)" :href="child.url" ><span>{{ child.title }}</span></a>
                            <NuxtLink v-else :to="child.url" @click="globalStore.closeOffcanvas('mobile_menu')"><span>{{ child.title }}</span></NuxtLink>
                        </li>
                    </ul>
                </li>

            </ul>
        </nav>
    </div>
</COffcanvas>
<div></div>
</template>

<script setup>
import {
    COffcanvas
} from '@coreui/vue'
import {useGlobalStore} from '@/store/globalStore'
import {useRouter} from "vue-router";
const globalStore = useGlobalStore();

function isExternal(el){
    return el?.url.includes('http')
}
</script>

<style>
.mobile_menu ul {
    list-style: none;
    padding-left: 0;
}

.mobile_menu ul li {
    display: block;
    border-bottom: 1px solid #E9EBF1;
    position: relative;
    overflow: hidden;
}

.mobile_menu ul.sub_menu {
    transition: all .4s;
}

.mobile_menu li a {
    text-decoration: none;
    color: #071031;
    padding: 10px 0 10px 15px;
    display: block;
}

.mobile_menu>ul>li>a {
    font-weight: 700;
}

.mobile_menu ul.sub_menu li {
    background: #e9ebf1;
    border-bottom-color: #fff;
}

.mobile_menu ul.sub_menu li:last-child {
    border: none;
}

.mobile_menu .submenu_trigger {
    position: absolute;
    right: 0;
    top: 0;
    padding: 10px 10px 9px;
    background: #f6f7fb;
}

.slideUp-enter-active {
    -moz-transition-duration: 0.3s;
    -webkit-transition-duration: 0.3s;
    -o-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -moz-transition-timing-function: ease-in;
    -webkit-transition-timing-function: ease-in;
    -o-transition-timing-function: ease-in;
    transition-timing-function: ease-in;
}

.slideUp-leave-active {
    -moz-transition-duration: 0.3s;
    -webkit-transition-duration: 0.3s;
    -o-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
    -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
    -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
    transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slideUp-enter-to,
.slide-leave {
    max-height: 100px;
    overflow: hidden;
}

.slideUp-enter,
.slide-leave-to {
    overflow: hidden;
    max-height: 0;
}
</style>
