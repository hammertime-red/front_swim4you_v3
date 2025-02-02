<template>
	<div class="cart_item__quantity input-group" :class="size == 'lg' ? 'size_lg' : 'size_sm'">
		<span class="input-group-btn">
			<button type="button" class="btn btn-default btn-number" @click="minus">-</button>
		</span>
		<input type="text" class="form-control input-number" v-model="item_quantity" min="1" :max="max" @change="changeInput" />
		<span class="input-group-btn">
			<button type="button" class="btn btn-default btn-number" @click="plus">+</button>
		</span>
	</div>
</template>

<script>
export default {
    data(){
        return {
            item_quantity: 1
        }
    },
    props: {
        quantity: {
            type: Number,
            default: 1
        },
        size: {
            type: String,
            default: 'sm'
        },
        max: {
            type: Number,
            default: 10000,
        }
    },
    watch: {
        item_quantity(val){
            if(val <= this.max) {
                this.$emit('changeQty', val)
            } else {
                this.item_quantity = this.max
            }
        },
        quantity(val){
            this.item_quantity = val
        }
    },
    created(){
        this.item_quantity = this.quantity
    },
    methods: {
        plus(){
            if(this.item_quantity < this.max) this.item_quantity += 1
        },
        minus(){
            if(this.item_quantity > 1) this.item_quantity -= 1
        },
        changeInput(e){
            this.$emit('changeQty', parseInt(e.target.value));
        }
    },
    emits: ['changeQty']
}
</script>

<style scoped>
.cart_item__quantity{
    max-width: 90px;
    height: 25px;
}

.cart_item__quantity .input-group-btn{
    width: 24px;
    margin: 0 !important;
}

.cart_item__quantity button{
    background: #fff;
    transition: all .4s;
    padding: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
}

.cart_item__quantity input{
    padding: 0;
    text-align: center;
    margin: 0 2px !important;
    border: none;
}

.cart_item__quantity button:hover{
    background: #fcfcfc;
}

.cart_item__quantity.size_lg{
    max-width: 130px;
    height: 50px;
}

.cart_item__quantity.size_lg .input-group-btn{
    width: 24px;
    margin: 0 !important;
}
</style>
