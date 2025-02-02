import api from "./api"

export const profileStateModule = {
	state: () => ({
		userdata: null,
		clubs: [],
        orders: [],
        extra_items: [],
		notifications: [],
		shop_orders: [],
	}),
	getters: {
		getUserData(state) {
			return state.userdata
		},
		getOrders(state) {
			return state.orders
		},
		getShopOrders(state) {
			return state.shop_orders
		},
		getAthletes(state, getters, rootState, rootGetters) {
            return rootGetters['athletes/getAthletes'].filter(item => item.client_id == state.userdata.id);
		},
		getAthleteNames(state, getters, rootState, rootGetters) {
            if(!getters.getAthletes) return ''
            return getters.getAthletes.map((item) => {
                return item.name
            }).join(', ')
		},
		getClubs(state) {
			return state.clubs
		},
		getNotifications(state) {
			return state.notifications
		},
	},
	mutations: {
		setUser(state, response) {
            if(response?.user) state.userdata = response.user
            if(response?.clubs) state.clubs = response.clubs
            if(response?.orders) state.orders = response.orders
            if(response?.extra_items) state.extra_items = response.extra_items
            if(response?.notifications) state.notifications = response.notifications
            if(response?.shop_orders) state.shop_orders = response.shop_orders
		},
        clearUser(state) {
			state.userdata = null
            state.orders = []
            state.clubs = []
            state.notifications = []
            state.shop_orders = []
		},
		setOrders(state, response) {
			state.orders = response
		},
		setNotificationsViewed(state) {
			state.notifications = state.notifications.map((item) => {
                item.is_viewed = 1

                return item
            })
		},
		deleteNotifications(state) {
			state.notifications = []
		},
		setSubscribed(state, response) {
			if (state.userdata) state.userdata.is_subscribed = response
		},
	},
	actions: {
		async fetchUserData({ state, commit }) {
			try {
				const response = await api.get(process.env.VUE_APP_BASE_URL + 'user')
				commit('setUser', response.data)
                if(response.data?.athletes && response.data?.athletes.length){
                    commit('athletes/setAthletes', response.data.athletes, { root: true })
                }
			} catch (e) {
				console.log('Ошибка получения данных с сервера о пользователе')
			}
		},
		async fetchOrders({ state, commit }) {
			try {
				const response = await api.get(process.env.VUE_APP_BASE_URL + 'orders')
				commit('setOrders', response.data)
			} catch (e) {
				console.log('Ошибка получения данных с сервера о заказах')
			}
		},
		async fetchShopOrders({ state, commit }) {
			try {
				const response = await api.get(process.env.VUE_APP_BASE_URL + 'shop/orders')
				commit('setShopOrders', response.data)
			} catch (e) {
				console.log('Ошибка получения данных с сервера о заказах')
			}
		},
		async fetchExtraItems({ state, commit }) {
			try {
				const response = await api.get(process.env.VUE_APP_BASE_URL + 'extra-services')
				return response.data
			} catch (e) {
				console.log('Ошибка получения данных с сервера о заказах')
                return []
			}
		},
		async fetchNotifications({ state, commit }) {
			try {
				const response = await api.get(process.env.VUE_APP_BASE_URL + 'notifications/get')
				commit('setNotifications', response.data)
			} catch (e) {
				console.log('Ошибка получения данных с сервера о клубах')
			}
		},
		async fetchNotificationsSetViewed({ state, commit }) {
			try {
				const response = await api.get(
					process.env.VUE_APP_BASE_URL + 'notifications/setviewed'
				)
                if(response.data?.success){
                    commit('setNotificationsViewed')
                }
			} catch (e) {
				console.log('Ошибка получения данных с сервера о клубах')
			}
		},
		async fetchNotificationsDelete({ state, commit }) {
			try {
				const response = await api.delete(
					process.env.VUE_APP_BASE_URL + 'notifications/delete'
				)
                if(response.data?.success){
                    commit('deleteNotifications')
                }
			} catch (e) {
				console.log('Ошибка получения данных с сервера о клубах')
			}
		},
		async fetchIsSubcribed({ state, commit }) {
			try {
				const response = await api.put(process.env.VUE_APP_BASE_URL + 'subscribed', {
					is_subscribed: 1,
				})
				commit('setSubscribed', response.data)
			} catch (e) {
				console.log('Ошибка получения данных о подписке')
			}
		},
        clearUser({ state, commit }) {
			commit('clearUser')
		},
	},
	namespaced: true,
}