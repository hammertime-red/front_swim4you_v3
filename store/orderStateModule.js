import api from "./api"

export const orderStateModule = {
    state: () => ({
        order_data: null,
    }),
    getters: {
        ORDER_ITEMS(state){
            if(!state.order_data?.order_items) return []
            return state.order_data.order_items
        },
        DISTANCE_ITEMS(state){
            if(!state.order_data?.order_items) return []
            return state.order_data.order_items.filter(item => item.type == 'distance').map(item => {
                return item
            })
        },
        RELAY_ITEMS(state){
            if(!state.order_data?.order_items) return []
            return state.order_data.order_items.filter(item => item.type == 'relay_race').map(item => {
                return {
                    order_item_id: item.id,
                    key: item.key,
                    distance_id: item.distance_id,
                    quantity: item.quantity,
                }
            })
        },
        EXTRA_ITEMS(state){
            if(!state.order_data?.extra_items) return []
            return state.order_data.extra_items
        },
        
        getOrderData(state) {
            return state.order_data
        },
    },
    mutations: {
        setOrderData(state, order) {
            state.order_data = order
        },
        clearOrderData(state){
            state.order_data = null
        },
        setOrderItems(state, {order_items, summ}) {
            state.order_data.order_items = order_items
            if(summ){
                state.order_data.summ = summ 
            }
        },
        setExtraItems(state, {extra_items, summ}) {
            state.order_data.extra_items = extra_items
            if(summ){
                state.order_data.summ = summ 
            }
        },
        setOrderPaymentStatus(state, response) {
            state.order_data.status = response.status
            state.order_data.payment_status = response.payment_status
        },
        setOrderStatus(state, status) {
            state.order_data.status = status
        },
    },
    actions: {
        async storeForm({state, commit}, {request, action = 'reserve'}){
            let result = null;
            try{
                const response = await api.post(
                    process.env.VUE_APP_BASE_URL+'order/competition/store/'+action, 
                    {...request}
                )
                if(response?.data?.success){
                    result = response.data

                    if(response.data?.order){
                        commit('setOrderData', response.data?.order)
                    }
                }
            } catch (e){
                console.log("Ошибка получения данных с сервера о заявке")
            }

            return result;
        },
        async confirmForm({state, commit}, request){
            let result = null;
            try{
                const response = await api.post(
                    `${process.env.VUE_APP_BASE_URL}order/${request.order_id}/confirm`, 
                    {...request}
                )
                if(response?.data?.success){
                    result = response.data

                    if(response?.data?.order_status){
                        commit('setOrderStatus', response?.data?.order_status)
                    }
                }
            } catch (e){
                console.log("Ошибка отправки заявки")
            }

            return result;
        },
        async expireOrder({state, commit}, order_id){
            let result = null;
            try{
                const response = await api.patch(
                    `${process.env.VUE_APP_BASE_URL}order/${order_id}/expire`
                )
                if(response?.data?.success){
                    result = response.data

                    if(response.data?.order){
                        commit('setOrderData', response.data?.order)
                    }
                }
            } catch (e){
                console.log("Ошибка изменения заявки")
            }

            return result;
        },
        async storeExtraItems({state, commit}, {extra_items, order_id}){
            let result = null;
            try{
                const response = await api.post(
                    `${process.env.VUE_APP_BASE_URL}order/${order_id}/store-extra-items`, 
                    {   
                        order_id,
                        extra_items 
                    }
                )
                if(response?.data?.success){
                    result = response.data

                    commit('setExtraItems', {
                        extra_items: response.data?.extra_items,
                        summ: response.data?.summ,
                    })
                }
            } catch (e){
                console.log("Ошибка получения данных с сервера о заявке")
            }

            return result;
        },
        async storeRelayItems({state, commit}, {relay_items, order_id}){
            let result = null;
            try{
                const response = await api.post(
                    `${process.env.VUE_APP_BASE_URL}order/${order_id}/store-relay-items`, 
                    {   
                        order_id,
                        relay_items 
                    }
                )
                if(response?.data?.success){
                    result = response.data

                    commit('setOrderItems', {
                        extra_items: response.data?.order_items,
                        summ: response.data?.summ,
                    })
                }
            } catch (e){
                console.log("Ошибка получения данных с сервера о заявке")
            }

            return result;
        },
        async deleteOrderItem({state, commit}, order_item_id){
            let result = null;
            try{
                const response = await api.delete(
                    `${process.env.VUE_APP_BASE_URL}order-item/${order_item_id}/delete`
                )
                if(response?.data?.success){
                    result = response.data

                    if(response.data?.order){
                        commit('setOrderData', response.data?.order)
                    }
                }
            } catch (e){
                console.log("Ошибка изменения заявки")
            }

            return result;
        },
        async fetchOrderData({state, commit}, id){
            if(state.order_data?.id && state.order_data.id == id){
                return
            }
            try{
                const response = await api.get(process.env.VUE_APP_BASE_URL+'order/'+id)
                commit('setOrderData', response.data)
            } catch (e){
                console.log("Ошибка получения данных с сервера о заказе")
            }
        },
        async fetchSingleExtraItem({state, commit}, id){
            try{
                const response = await api.get(process.env.VUE_APP_BASE_URL+'extra-services/'+id)
                return response.data
            } catch (e){
                console.log("Ошибка получения данных с сервера о заказе")
                return null
            }
        },
        async fetchPaymentStatus({state, commit}, id){
            let res = null;
            try{
                const response = await api.get(process.env.VUE_APP_BASE_URL+'checkPaymentStatus/Order/'+id)
                res = response.data
                commit('setOrderPaymentStatus', response.data)
            } catch (e){
                console.log("Ошибка получения данных с сервера о статусе оплаты")
            }

            return res
        },
        async getPaymentUrl({state, commit}, order_id){
            try{
                const response = await api.get(process.env.VUE_APP_BASE_URL+'order/'+order_id+'/toPayment')
                return response.data
            } catch (e){
				console.log(e);
                console.log("Ошибка получения ссылки на оплату с сервера ")
            }
        },
    },
    namespaced: true
}