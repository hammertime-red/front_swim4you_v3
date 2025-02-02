<template>
	<COffcanvas
		placement="end"
		:visible="visible"
		@hide=";(visible = !visible), this.$emit('hide')"
		@show="this.$emit('show')">
		<div class="offcanvas-header justify-content-end">
			<button
				@click=";(visible = !visible), this.$emit('hide')"
				type="button"
				class="btn-close text-reset"></button>
		</div>
		<div class="offcanvas-body">
			<slot />
		</div>
	</COffcanvas>
	<div></div>
</template>

<script>
import { COffcanvas } from "@coreui/vue"
export default {
	props: ["id", "visible"],
	components: {
		COffcanvas,
	},
	emits: ["show", "hide"],
}
</script>

<style>
.its_me_check {
	padding-left: 40px !important;
	border-radius: 5px;
}

.offcanvas {
	border: none;
}

.offcanvas-end {
	width: 100%;
	max-width: 600px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.offcanvas-end .offcanvas-header {
	width: 100%;
}

.offcanvas-end .offcanvas-body {
	width: 100%;
	max-width: 570px;
}

.styled_scrollbar::-webkit-scrollbar-track {
	background-color: #f2f2f2;
}

.styled_scrollbar::-webkit-scrollbar {
	width: 6px;
	background-color: #f2f2f2;
}

.styled_scrollbar::-webkit-scrollbar-thumb {
	background-color: #dbdbdb;
}

.offcanvas-backdrop {
	background: rgba(7, 16, 49, 0.7);
	opacity: 1;
	width: 100%;
	height: calc(100% + 200px);
	position: absolute;
	top: -200px;
	left: 0;
	z-index: 10;
	backdrop-filter: blur(10px);
	position: fixed;
}

.dark_cart .offcanvas{
	background: #071031;
	color: #fff;
	max-width: 550px;
	padding: 0 15px;
}

.dark_cart .offcanvas-header .btn-close{
	filter: invert(1);
}

</style>