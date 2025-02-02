<template>
<ModalInline @hide="$emit('hide')" :visible="visible" modal_class="bg-light">
<div class="title_section row justify-between mb-4">
    <p v-if="item.title" class="section_title_medium mb-2">{{item.title}}</p>
    <p v-if="item.subtitle"  class="text-sub mb-0">{{item.subtitle}}</p>
</div>

<div class="row mb-4">
    <div class="col-6">
        <div class="carousel-nav">
            <button @click="swiperPrev()" class="carousel-control-prev me-3">
                <vue-feather type="arrow-left-circle"></vue-feather>
            </button>
            <button @click="swiperNext()" class="carousel-control-next">
                <vue-feather type="arrow-right-circle"></vue-feather>
            </button>
        </div>
    </div>
    <div class="col-6">
        <HeaderShopCartButton className="ms-auto" direct_checkout @onCheckout="onCheckout"/>
    </div>
</div>


<swiper v-if="item.items && item.items.length" :modules="modules" :autoplay="true" :slidesPerView="3" :spaceBetween="15" ref="swiper_slider" :breakpoints="this.swiper_breakpoints" :loop="true" class="pb-2">
    <swiper-slide v-for="(product, i) in item.items" :key="i" class="slide">
        <ShopProductCard :item="product" disable_link/>
    </swiper-slide>
</swiper>

<button @click="onCheckout" class="btn d-table btn-primary btn-primary-shadow btn-rounded mt-4 px-5 ms-auto me-auto">Оформить заказ</button>

</ModalInline>
</template>

<script>
import HeaderShopCartButton from '../header/HeaderShopCartButton'
import ShopProductCard from '../shop/ShopProductCard.vue'
import ModalInline from './ModalInline.vue'
import {
    Swiper,
    SwiperSlide
} from "swiper/vue";
import { Autoplay } from 'swiper/modules';
import "swiper/css";
import "swiper/css/autoplay";
import api from '@/store/api'
export default {
    props: {
        visible: {
            type: Boolean
        },
        item: {
            type: Object,
            default: {}
        },
    },
    data() {
        return {
            form_data: {
				payers_name: null,
				payers_phone: null,
				payers_email: null,
				payment_method: 3,
                event_stage_id: null,
                no_payment: true,
				items: []
			}, 
            swiper: null,
            swiper_breakpoints: {
                '0': {
                    slidesPerView: 1,
                },
                '550': {
                    slidesPerView: 2,
                },
                '1024': {
                    slidesPerView: 3,
                },
            },
        }
    },
    computed: {
        CART(){
			return this.$store.getters['shop/CART']
		},
    },
    created(){
        console.log(this.item?.event_stage_id);
        this.form_data.event_stage_id = this.item?.event_stage_id
    },
    updated() {
        if(this.visible){
            this.swiper = this.$refs.swiper_slider.$el.swiper
        }
    },
    setup() {
      return {
        modules: [Autoplay],
      };
    },
    methods: {
        swiperPrev() {
            this.swiper.slidePrev();
        },
        swiperNext() {
            this.swiper.slideNext();
        },
        onCheckout(){
            this.storeOrder()
        },
        storeOrder(){
			this.form_data.items = this.CART
            api.post(process.env.VUE_APP_BASE_URL+'shop/order/create', this.form_data).then(res => {
                if(res.data && res.data.success){
					this.$store.commit('shop/clearCart')
					this.$swal('Заказ успешно создан', 'В вашем аккаунте появился новый заказ №'+res.data.id+', который ожидает оплаты.', 'success')
                    this.$emit('hide')
                }else{
                    console.log(res.data)
                    this.$swal('Возникла неизвестная ошибка, попробуйте еще раз', '', 'danger')
                }
            }).catch(error => {
                console.log('Catch', error, error.response)
                if(error.response && error.response.data.message){
                    this.$swal(error.response.data.message, '', 'danger')
                }
            })
        },
    },
    components: {
        HeaderShopCartButton,
        ModalInline,
        Swiper,
        SwiperSlide,
        ShopProductCard
    },
    emits: ['hide'],
}
</script>

<style scoped>
.badge{
    font-family: "Oswald", sans-serif;
    font-weight: 700;
    font-size: 18px;
    text-transform: uppercase;
}

.btn{
    padding-left: 45px;
    padding-right: 45px;
}

form {
    border: 1px solid #E9EBF1;
    border-radius: 10px;
    padding: 30px;
}

form button {
    padding-top: 10px;
    padding-bottom: 10px;
}

.form_sent .title{
    font-size: 20px;
}

@media(max-width: 768px){
    .btn{
        padding-left: 20px;
        padding-right: 20px;
    }

    .badge{
        font-size: 16px;
    }
}

</style>
