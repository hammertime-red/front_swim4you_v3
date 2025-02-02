import axios from "axios"
import api from '@/store/api'

export const shopStateModule = {
	state: () => ({
		cart_items: [
            /* {
                id: 1,
                name: 'Название товара 1',
                variation: {
                    key: 'size',
                    value: 'XL'
                },
                thumbnail: '/assets/testdata/shop_product_1.jpg',
                price: 2600,
                quantity: 1
            },
            {
                id: 2,
                name: 'Название товара 2',
                variation: null,
                thumbnail: '/assets/testdata/shop_product_2.jpg',
                price: 2600,
                quantity: 1
            }, */
        ],
	}),
	getters: {
		CART(state) {
			return state.cart_items
		},
        CARTSUMM(state) {
            if(!state.cart_items || !state.cart_items.length) return 0
            let summ = 0
            state.cart_items.forEach(item => {
                summ += item.price * item.quantity
            })
            return summ
        },
        CARTCOUNT(state) {
            if(!state.cart_items || !state.cart_items.length) return 0
            let count = 0
            state.cart_items.forEach(item => {
                count += item.quantity
            })
            return count
        }
	},
	mutations: {
        setCart(state) {
			state.cart_items = localStorage.getItem('shop_cart')
				? JSON.parse(localStorage.getItem('shop_cart'))
				: state.cart_items
		},
        addToCart(state, item) {
			let exist = state.cart_items.find(cart_item => cart_item.id == item.id)
			if(exist) {
				exist.quantity += item.quantity ? item.quantity : 1
				return 
			}
            let product_data = {
				id: item.id,
				name: item.name,
				thumbnail: item.thumbnail,
				price: item.price ? item.price : item.min_price,
				quantity: item.quantity ? item.quantity : 1,
			}

			if(item.variation){
				product_data.variation = item.variation
			}
			
			state.cart_items.push(product_data)
		},
		removeFromCart(state, id) {
			state.cart_items = state.cart_items.filter((el) => el.id != id)
		},
		changeQuantity(state, {id, val}) {
			let cart_item = state.cart_items.find(item => item.id === id)
			cart_item.quantity = val
			//state.cart_items = state.cart_items.filter((el) => el.id != id)
		},
		clearCart(state) {
			state.cart_items = []
			localStorage.removeItem('shop_cart')
		},
	},
	actions: {
        changeLocalStorage({state}) {
			localStorage.setItem('shop_cart', JSON.stringify(state.cart_items))
		},
		async fetchCheckout({state, commit}){
            try{
                const response = await api.get(process.env.VUE_APP_BASE_URL+'shop/checkout')
                return response.data
            } catch (e){
                console.log("Ошибка получения данных с сервера о статусе оплаты")
                console.log(e)
                return;
            }
        },
		async fetchPaymentStatus({state, commit}, id){
            try{
                const response = await api.get(process.env.VUE_APP_BASE_URL+'checkPaymentStatus/ShopOrder/'+id)
                return response.data
            } catch (e){
                console.log("Ошибка получения данных с сервера о статусе оплаты")
                console.log(e)
            }
        },
		async getPaymentUrl({state, commit}, order_id){
            try{
                const response = await api.get(process.env.VUE_APP_BASE_URL+'shop/order/'+order_id+'/toPayment', {params: {
					order_id: order_id, 
					order_type: 'ShopOrder',
				}})
                return response.data
            } catch (e){
				console.log(e);
                console.log("Ошибка получения ссылки на оплату с сервера ")
            }
        },
	},
	namespaced: true,
}
