import { defineStore } from 'pinia'
import api from '~/store/api'

export const useShopStore = defineStore('shopStore', {
    state: () => ({
        cart: []
    }),

    getters: {
        summ: (state) => state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemsCount: (state) => state.cart.reduce((count, item) => count + item.quantity, 0)
    },

    actions: {
        setCart() {
            const cookie = useCookie('shop_cart')
            this.cart = cookie.value || []
        },

        updateCookie() {
            const cookie = useCookie('shop_cart', {
                maxAge: 60 * 60 * 24 * 7, // 7 дней
                path: '/'
            })
            cookie.value = JSON.stringify(this.cart)
        },

        addToCart(item, quantity = 1) {
            console.log('HEYHO')
            const existingItem = this.cart.find(cartItem => cartItem.id === item.id)

            if (existingItem) {
                existingItem.quantity += quantity
            } else {
                const productData = {
                    id: item.id,
                    name: item.name,
                    slug: item.slug,
                    thumbnail: item.thumbnail,
                    price: item.price,
                    quantity: quantity,
                    color_id: item.color_id,
                    size_id: item.size_id,
                }

                this.cart.push(productData)
            }

            this.updateCookie()
        },

        removeFromCart(id) {
            this.cart = this.cart.filter(item => item.id !== id)
            this.updateCookie()
        },

        changeQuantity(id, quantity) {
            const item = this.cart.find(item => item.id === id)
            if (item) {
                item.quantity = quantity
                this.updateCookie()
            }
        },

        clearCart() {
            this.cart = []
            const cookie = useCookie('shop_cart')
            cookie.value = null
        },

        async fetchCheckout() {
            try {
                const { data } = await api.get(`${process.env.VUE_APP_BASE_URL}shop/checkout`)
                return data
            } catch (error) {
                console.error('Ошибка получения данных оплаты:', error)
            }
        },

        async fetchPaymentStatus(id) {
            try {
                const { data } = await api.get(`${process.env.VUE_APP_BASE_URL}checkPaymentStatus/ShopOrder/${id}`)
                return data
            } catch (error) {
                console.error('Ошибка получения статуса оплаты:', error)
            }
        },

        async getPaymentUrl(orderId) {
            try {
                const { data } = await api.get(`${process.env.VUE_APP_BASE_URL}shop/order/${orderId}/toPayment`, {
                    params: {
                        order_id: orderId,
                        order_type: 'ShopOrder'
                    }
                })
                return data
            } catch (error) {
                console.error('Ошибка получения ссылки на оплату:', error)
            }
        }
    }
})