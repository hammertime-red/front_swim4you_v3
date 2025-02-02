<template>
	<div class="content_box p-4 mb-4">
		<div v-for="(item, i) in accept_checks" :key="i" class="form-check">
			<input
				v-model="accept_checks[i].check"
				:id="'accept_' + i"
				class="form-check-input ml-2"
				:class="show_errors && !accept_checks[i].check ? 'invalid' : ''"
				type="checkbox"
				required />
			<label
				class="form-check-label small"
				:class="show_errors && !accept_checks[i].check ? 'text-danger' : ''"
				:for="'accept_' + i"
				v-html="item.text">
			</label>
		</div>
	</div>
</template>

<script>
import { computed } from 'vue'
export default {
	props: {
		accept_checks: {
			type: Array,
			default: () => [],
		},
		show_errors: {
			type: Boolean,
			default: false,
		},
	},
	setup(props, { emit }) {
		const accept_checks = computed({
			get: () => props.accept_checks,
			set: (value) => emit('update:accept_checks', value),
		})
		return { accept_checks }
	},
	emits: ['update:accept_checks'],
}
</script>

<style></style>
