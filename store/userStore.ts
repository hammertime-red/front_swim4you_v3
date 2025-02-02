import { defineStore } from 'pinia';
import {useAthleteStore} from "@/store/athleteStore";
import {fetchData} from "~/utils/api";

interface LoginCredentials {
	email: string
	password: string
}

interface RegisterCredentials {
	name: string
	email: string
	password: string
}

export const useUserStore = defineStore('userStore', {
	state: () => ({
		userdata: null,
		token: useCookie('access_token'),
		isAuthenticated: false,
		loading: false,
		clubs: [],
		orders: [],
		extra_items: [],
		notifications: [],
		shop_orders: [],
	}),

	getters: {
		getOrders: (state) => state.orders,
		getShopOrders: (state) => state.shop_orders,
		/*getAthletes: (state) => {
			return (athletes) =>
				athletes.filter((item) => item.client_id === state.userdata?.id);
		},
		getAthleteNames: (state, getters) => (athletes) => {
			const userAthletes = getters.getAthletes(athletes);
			return userAthletes.length
				? userAthletes.map((item) => item.name).join(', ')
				: '';
		},*/
		getClubs: (state) => state.clubs,
		getNotifications: (state) => state.notifications,
	},

	actions: {
		async login(credentials: LoginCredentials) {
			this.loading = true
			return await fetchData('login', {
				method: 'POST',
				body: credentials
			}).then((response) => {
				console.log(response)
				this.token = response?.token
				if(response?.client){
					this.setUser(response?.client)
				}
				this.isAuthenticated = true
			}).catch ((e) => {
				return Promise.reject(e);
			}).finally(() => {
				this.loading = false
			})
		},

		async register(credentials: RegisterCredentials) {
			this.loading = true

			await fetchData('register', {
				method: 'POST',
				body: credentials
			}).then((response) => {
				this.token = response?.token
				if(response?.client){
					this.setUser(response?.client)
					this.isAuthenticated = true
				}
			}).catch((error: any) => {
				throw error
			}).finally(() => {
				this.loading = false
			})
		},

		async logout() {
			try {
				// Вызываем logout на бэкенде для инвалидации токена
				await fetchAuth('/logout', { method: 'POST' })
			} catch {
				// Даже если logout на бэкенде не удался, очищаем клиентское состояние
			} finally {
				// Очищаем состояние и токен
				this.token = null
				this.clearUser()
				this.isAuthenticated = false
				navigateTo('/')
			}
		},

		async emailVerify(verify_url: string) {
			return fetchData(verify_url, {
				method: 'GET',
			})
			.then((response: any) => {
				this.token = response?.token
				if(response?.client){
					this.setUser(response?.client)
					this.isAuthenticated = true
				}
			}).catch((e: any) => {
				return Promise.reject(e);
			})
		},

		async fetchUser() {
			if (!this.token) return

			this.loading = true
			try {
				const user = await fetchAuth('/user')
				if(user){
					this.setUser(user)
					this.isAuthenticated = true
				}
			} catch {
				await this.logout() // Если профиль не удалось загрузить, разлогиниваем
			} finally {
				this.loading = false
			}
		},

		async fetchUserData() {
			this.loading = false
			const { $apiAuthClient } = useNuxtApp()
			return await $apiAuthClient.get('user')
				.then((response) => {
					this.setUser(response);
				}).catch((e) => {
					return Promise.reject(e);
				}).finally(() => {
					this.loading = true
				})
		},

		async restoreState() {
			if (this.token) {
				try {
					await this.fetchUser() // Если токен есть, пытаемся загрузить пользователя
				} catch {
					// Если не удалось загрузить пользователя, разлогиниваем
					await this.logout()
				}
			} else {
				this.isAuthenticated = false
			}
		},

		async fetchProfile() {
			this.loading = false
			const { $apiAuthClient } = useNuxtApp()
			return await $apiAuthClient.get('profile')
				.then((response) => {
					console.log(response);
				}).catch((e) => {
					return Promise.reject(e);
				}).finally(() => {
					this.loading = true
				})
		},

		async fetchShopOrders() {
			/*try {
				const response = await authApiClient.get(`${process.env.VUE_APP_BASE_URL}shop/orders`);
				this.shop_orders = response.data;
			} catch (e) {
				console.log('Ошибка получения данных с сервера о заказах');
			}
			return await authApiClient.get('shop/orders')
				.then((response) => {
					this.setOrders(response.data);
				}).catch((e) => {
					return Promise.reject(e);
				})*/
		},

		async fetchExtraItems() {
			try {
				const response = await apiAuthClient.get(`${process.env.VUE_APP_BASE_URL}extra-services`);
				return response;
			} catch (e) {
				console.log('Ошибка получения данных с сервера о заказах');
				return [];
			}
		},

		async fetchNotifications() {
			try {
				const response = await apiAuthClient.get(`${process.env.VUE_APP_BASE_URL}notifications/get`);
				this.notifications = response;
			} catch (e) {
				console.log('Ошибка получения данных с сервера о клубах');
			}
		},

		async fetchNotificationsSetViewed() {
			try {
				const response = await apiAuthClient.get(
					`${process.env.VUE_APP_BASE_URL}notifications/setviewed`
				);
				if (response.data?.success) {
					this.setNotificationsViewed();
				}
			} catch (e) {
				console.log('Ошибка получения данных с сервера о клубах');
			}
		},

		async fetchNotificationsDelete() {
			try {
				const response = await apiAuthClient.delete(
					`${process.env.VUE_APP_BASE_URL}notifications/delete`
				);
				if (response.data?.success) {
					this.deleteNotifications();
				}
			} catch (e) {
				console.log('Ошибка получения данных с сервера о клубах');
			}
		},

		async fetchIsSubscribed() {
			try {
				const response = await apiAuthClient.put(`${process.env.VUE_APP_BASE_URL}subscribed`, {
					is_subscribed: 1,
				});
				this.setSubscribed(response);
			} catch (e) {
				console.log('Ошибка получения данных о подписке');
			}
		},

		async createClub(values){
			return await fetchAuth('user/clubs/create', {
				method: 'POST',
				params: values
			}).then(async (response) => {
				this.setClub(response)
			}).catch((e) => {
				return Promise.reject(e);
			})
		},

		async updateClub(values, id){
			return await fetchAuth(`user/clubs/${id}`, {
				method: 'PUT',
				params: values
			}).then(async (response) => {
				this.setClub(response)
			}).catch((e) => {
				return Promise.reject(e);
			})
		},

		async deleteClub(id){
			return await fetchAuth(`user/clubs/${id}`, {
				method: 'DELETE',
			}).then(async (response) => {
				this.clubs = this.clubs.filter((club) => club.id !== id);
			}).catch((e) => {
				return Promise.reject(e);
			})
		},

		setClub(payload){
			const index = this.clubs.findIndex(item => item.id === payload.id)
			if(index > -1){
				this.clubs.index = payload
				return
			}
			this.clubs.push(payload)
		},

		setUser(response) {
			if (response?.clubs) this.clubs = response.clubs;
			if (response?.orders) this.orders = response.orders;
			if (response?.extra_items) this.extra_items = response.extra_items;
			if (response?.notifications) this.notifications = response.notifications;
			if (response?.shop_orders) this.shop_orders = response.shop_orders;
			if (response?.athletes && response?.athletes.length) {
				const athletesStore = useAthleteStore();
				athletesStore.setAthletes(response.athletes);
			}

			delete response.clubs;
			delete response.orders;
			delete response.extra_items;
			delete response.notifications;
			delete response.shop_orders;
			delete response.athletes;

			this.userdata = response;
		},

		clearUser() {
			this.userdata = null;
			this.orders = [];
			this.clubs = [];
			this.notifications = [];
			this.shop_orders = [];
		},

		setOrders(response) {
			this.orders = response;
		},

		setNotificationsViewed() {
			this.notifications = this.notifications.map((item) => {
				item.is_viewed = 1;
				return item;
			});
		},

		deleteNotifications() {
			this.notifications = [];
		},

		setSubscribed(response) {
			if (this.userdata) this.userdata.is_subscribed = response;
		},
	},
});
