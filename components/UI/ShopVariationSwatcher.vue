<template>
	<div class="variation_swatchers_cont">
		<template v-if="sizes.length">
			<p class="font-bold mb-2">Выберите размер:</p>
			<div class="variation_swatcher m-n1">
				<a
					v-for="(item, i) in sizes"
					:key="i"
					href="javascript:void(0)"
					:disable="isDisabled('size', item)"
					@click.prevent="selectVariation('size', item)"
					class="p-3 d-inline-block text-decoration-none font-bold m-1"
					:class="selected.size == item ? 'text-white bg-primary' : 'bg-white text-dark'"
					>{{ item }}</a
				>
			</div>
		</template>

		<template v-if="colors.length">
			<p class="font-bold mb-2">Выберите цвет:</p>
			<div class="variation_swatcher variation_swatcher--color m-n1">
				<a
					v-for="(item, i) in colors"
					:key="i"
					@click.prevent="selectVariation('color', item.name)"
					:disable="isDisabled('color', item.name)"
					href="javascript:void(0)"
					class="d-inline-block text-decoration-none font-bold text-white m-1 rounded-pill"
					:class="selected.color == item.name ? 'active' : ''"
					:style="'background-color:'+item.hex"></a>
			</div>
		</template>
	</div>
</template>

<script>
export default {
	props: {
		variations: {
			type: Array,
			default: [],
		},
	},
	data() {
		return {
			selected: {
				size: null,
				color: null,
			},
		}
	},
	watch: {
		selected: {
			handler(val) {
				this.$emit('select')
				if (
					(this.colors.length && this.sizes.length && val.size && val.color) ||
					(!this.colors.length && this.sizes.length && val.size) ||
					(this.colors.length && !this.sizes.length && val.color)
				) {
					this.$emit('selectVariation', this.selected)
				}
			},
			deep: true,
		},
	},
	computed: {
		colors() {
			let colors = []
			this.variations.forEach((item) => {
				if (item.color && !colors.includes(item.color)) {
					colors.push({name: item.color, hex: item.hex})
				}
			})
			return colors
		},
		sizes() {
			let sizes = []
			this.variations.forEach((item) => {
				if (item.size && !sizes.includes(item.size)) {
					sizes.push(item.size)
				}
			})
			return sizes
		},
		modifyVariations() {
			if (!this.selected.size && !this.selected.color) return this.variations
			return this.variations.filter(
				(item) => item.size == this.selected.size || item.color == this.selected.color
			)
		},
	},
	methods: {
		selectVariation(key, value) {
			if (this.selected[key] == value) {
				this.selected[key] = null
				return
			}
			if (this.isDisabled(key, value)) return
			this.selected[key] = value
		},
		isDisabled(key, value) {
			let exist = this.modifyVariations.filter((item) => item[key] == value)
			if (exist.length > 0) return false
			return true
		},
	},
	emits: ['selectVariation', 'select'],
}
</script>

<style scoped>
.variation_swatchers_cont .variation_swatcher {
	margin-bottom: 20px !important;
}

.variation_swatchers_cont .variation_swatcher:last-child {
	margin-bottom: 0 !important;
}

.variation_swatchers_cont a {
	transition: all 0.4s;
	opacity: 1;
	padding: 15px;
}

.variation_swatchers_cont a[disable='true'] {
	opacity: 0.5;
	cursor: default;
}

.variation_swatchers_cont a:hover {
	opacity: 0.5;
}

.variation_swatcher--color a.active {
	box-shadow: 0 0 0 3px rgba(11, 93, 215, 0.3);
}
</style>
