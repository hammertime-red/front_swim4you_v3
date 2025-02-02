<template>
	<div class="content_box p-4 mb-3">
		<div
			class="content_box__header flex justify-between items-center mb-3 relative z-2">
			<h2 class="title_block mb-2 text-sub">Способы оплаты</h2>
		</div>
		<div class="checkout_methods">
			<div
				v-for="(item, i) in accept_payment_methods"
				:key="i"
				class="checkout_methods__item form-check mb-3">
				<input
					class="form-check-input"
					type="radio"
					name="payment_method"
					:id="'payment_method_' + item.id"
					:value="item.id"
					v-model="theModel" />
				<label class="form-check-label" :for="'payment_method_' + item.id">
					<p
						class="font-bold mb-1"
						:class="theModel == item.id ? 'text-positive' : 'text-primary'">
						{{ item.title }}
					</p>
					<p class="text-sub text-sm mb-0">
						{{ item.desc }}
					</p>
				</label>
			</div>
		</div>
		<button
            v-if="send_order_btn"
			@click.prevent="$emit('sendOrder')"
			class="btn btn-primary btn-primary-shadow btn-rounded"
			:disabled="!theModel || has_errors">
			Перейти к оплате
		</button>
	</div>
</template>

<script>
import { computed } from 'vue'
import {useGlobalStore} from '@/store/globalStore'
export default {
    props: {
        send_order_btn: {
            type: Boolean,
            default: false
        },
        has_errors: {
            type: Boolean,
            default: false
        },
        modelValue: {
			type: Number,
			default: 1,
		},
		accept_methods: {
			type: Array,
			default: null
		}
    },
	computed: {
		payment_methods(){
			return this.globalStore.getPaymentMethods();
		},
		accept_payment_methods(){
			if(!this.accept_methods.length) return this.payment_methods
			return this.payment_methods.filter(item => this.accept_methods.includes(item.id))
		}
	},
    mounted(){
        this.theModel = this.accept_payment_methods[0].id
    },
    setup(props, { emit }) {
        const globalStore = useGlobalStore();
        const theModel = computed({
          get: () => props.modelValue,
          set: (value) => emit('update:modelValue', value),
        })
        return { theModel, globalStore }
	},
    emits: ['sendOrder', 'update:modelValue']
}
</script>

<style></style>
