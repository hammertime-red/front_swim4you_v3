<template>
	<CModal
		size="xl"
		alignment="center"
		:visible="visible"
		@hide=";(visible = !visible), this.$emit('hide')"
		@show="this.$emit('show')">
		<button
			@click=";(visible = !visible), this.$emit('hide')"
			type="button"
			class="btn-close text-reset"></button>
		<div class="modal-body" :class="modal_class">
			<slot />
		</div>
	</CModal>
</template>

<script>
import { CModal } from '@coreui/vue'
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
		modal_class: {
			type: String,
			default: ''
		}
    },
	components: {
		CModal,
	},
	emits: ["show", "hide"],
}
</script>

<style scoped>
.modal-content {
	border: none;
}

.btn-close {
	position: absolute;
	top: 20px;
	right: 20px;
	opacity: 0.5;
	z-index: 1000;
}

.modal-body {
	padding: 30px 30px;
}

.bg-light{
	background: #f5f6fa;
}

@media (max-width: 768px) {
	.btn-close {
		top: 10px;
		right: 10px;
	}

	.modal-body {
		padding: 30px 15px;
	}
}
</style>
