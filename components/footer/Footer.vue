<template>
	<footer class="pb-6" :style="'padding-top:' + globalStore.getFooterTopPadding + 'px; margin-top: -' + (globalStore.getFooterTopPadding - 30) + 'px;'">
		<div class="container">
			<div class="footer_top flex flex-wrap md:flex-nowrap items-center justify-between gap-8 md:gap-4 md:gap-12 py-5">
                <FooterNav class="flex-grow w-full md:w-fit md:max-w-[80%]" />
                <SocialLinks />
			</div>
			<div class="footer_bottom flex flex-wrap md:flex-nowrap items-center justify-between py-5">
				<div>
					<NuxtLink v-if="privacyPolicyPageId" :to="`/page/${privacyPolicyPageId}`">Политика конфиденциальности</NuxtLink>
					<NuxtLink v-if="rulesPageId" :to="`/page/${rulesPageId}`">Правила и условия сервиса</NuxtLink>
				</div>
				<div>
					<p class="text-md-end mt-4 mt-md-0">© 2014-{{ year }} {{ copyright }}</p>
				</div>
			</div>
		</div>
	</footer>
</template>

<script setup>
import SocialLinks from '../SocialLinks'
import FooterNav from './FooterNav'
import {useGlobalStore} from '@/store/globalStore'
import {computed} from "vue";

const globalStore = useGlobalStore();

const year = computed(() => {
    return new Date().getFullYear()
})

const privacyPolicyPageId = computed(() => {
    return globalStore.global?.pages?.privacy_policy || null
})

const rulesPageId = computed(() => {
    return globalStore.global?.pages?.rules || null
})

const copyright = computed(() => {
    return globalStore.global?.copyright || null
})

</script>

<style>
footer.footer__without_subscribe_section {
	padding-top: 30px;
	margin-top: 0;
}
</style>
