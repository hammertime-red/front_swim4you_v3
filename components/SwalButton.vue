<template>
	<a @click.prevent="showAlert" href="#" :class="this.class"><slot /></a>
</template>

<script>
export default {
	props: [
		"class",
		"title",
		"text",
		"icon",
		"confirmButtonText",
		"confirmButtonColor",
		"callback",
		"successText",
		"callbackData",
	],
	methods: {
		showAlert() {
			let swalSettings = {
				title: "Вы действительно хотите сделать это?",
				confirmButtonText: "Ок",
				focusConfirm: false,
				focusCancel: true,
				showCancelButton: true,
				cancelButtonText: "Отмена",
			}
			if (this.title) swalSettings.title = this.title
			if (this.confirmButtonText)
				swalSettings.confirmButtonText = this.confirmButtonText
			if (this.text) swalSettings.text = this.text
			if (this.icon) swalSettings.icon = this.icon
			if (this.confirmButtonColor)
				swalSettings.confirmButtonColor = this.confirmButtonColor

			let swalCallback = (result) => {
				if (result.isConfirmed) {
					this.$emit("callback", this.callbackData)
					if (this.successText) {
						this.$swal(this.successText, "", "success")
					}
				}
			}

			this.$swal(swalSettings).then(swalCallback)
		},
	},
	emits: ["callback"],
}
</script>

<style></style>