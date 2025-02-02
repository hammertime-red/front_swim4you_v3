import axios from "axios"
import api from '@/store/api'

export const photobankStateModule = {
	state: () => ({
		cart: [],
		total: 0,
		page: 1,
		search: null,
		photobank: [],
		photobank_categories: [],
		cart_photos: [],
		payed_photos: [],
		payed_photos_ids: [],
		photos_by_athletes: {
			total: 0,
			items: [],
			search: null,
		},
		albums: [],
		album: {
			name: '',
			items: []
		},
		searchtips: [],
	}),
	getters: {
		getPhotos(state) {
			return state.photobank
		},
		getPayedPhotos(state) {
			return state.payed_photos
		},
		getPhotosByAthletes(state) {
			return state.photos_by_athletes
		},
		getPayedPhotosIds(state) {
			return state.payed_photos_ids
		},
		getAlbums(state) {
			return state.albums
		},
		getAlbum(state) {
			return state.album
		},
		getSearchTips(state) {
			return state.searchtips
		},
		getCart(state) {
			return state.cart
		},
		getCartItems(state) {
			return state.cart_photos
		},
		getCartSumm(state, getters) {
			let summ = 0
			state.cart_photos.forEach((el) => {
				summ += el.price
			})
			return summ
		},
		getCartCount(state) {
			return state.cart.length
		},
		getPhotobankCategories(state) {
			return state.photobank_categories
		},
	},
	mutations: {
		setPhotos(state, response) {
			state.photobank = response.items
			state.total = response.total
			state.search = response.search
		},
		setPayedPhotos(state, response) {
			state.payed_photos = response
		},
		setPayedPhotosIds(state, response) {
			state.payed_photos_ids = response
		},
		setPhotosByAthletes(state, response) {
			state.photos_by_athletes = response
		},
		addPhotos(state, response) {
			state.photobank = state.photobank.concat(response.items)
			state.page++
		},
		setCartPhotos(state, response) {
			state.cart_photos = response
		},
		setAlbums(state, response) {
			state.albums = response
		},
		setAlbum(state, response) {
			state.album = response
		},
		setSearchTips(state, response) {
			state.searchtips = response
		},
		addToCart(state, id) {
			if (!state.cart.find((el) => el === id)) state.cart.push(id)
		},
		removeFromCart(state, id) {
			state.cart = state.cart.filter((el) => el != id)
			state.cart_photos = state.cart_photos.filter((el) => el.id != id)
		},
		clearCart(state) {
			state.cart = []
			localStorage.removeItem('cart')
		},
		setCart(state) {
			state.cart = localStorage.getItem('cart')
				? JSON.parse(localStorage.getItem('cart'))
				: state.cart
		},
		setPhotobankCategories(state, response) {
			state.photobank_categories = response
		},
	},
	actions: {
		async fetchPhotobankCategories({ state, commit }) {
			if(state.photobank_categories.length > 0) return
			try {
				const response = await axios.get(process.env.VUE_APP_BASE_URL + 'photobank/categories')
				commit('setPhotobankCategories', response.data)
			} catch (e) {
				alert('Ошибка получения данных с сервера о фотобанке')
			}
		},
		async fetchPhotos({ state, commit }, search) {
			try {
				const response = await axios.get(process.env.VUE_APP_BASE_URL + 'photobank/photos', {
					params: {
						page: 1,
						page_size: 20,
						search: search ? search : null
					}
				})
				commit('setPhotos', response.data)
			} catch (e) {
				alert('Ошибка получения данных с сервера о фотобанке')
			}
		},
		async reFetchPhotos({ state, commit }) {
			try {
				const response = await axios.get(process.env.VUE_APP_BASE_URL + 'photobank/photos', {
					params: {
						page: state.photobank.page + 1,
						page_size: 20,
						search: state.search ? state.search : null
					}
				})
				commit('addPhotos', response.data)
			} catch (e) {
				alert('Ошибка получения данных с сервера о фотобанке')
			}
		},
		async fetchAlbums({ state, commit }) {
			try {
				const response = await axios.get(process.env.VUE_APP_BASE_URL + 'photobank/albums')
				commit('setAlbums', response.data)
			} catch (e) {
				console.log(e);
				alert('Ошибка получения данных с сервера о альбомах фотобанка')
			}
		},

		async fetchAlbum({ state, commit }, id) {
			try {
				const response = await axios.get(process.env.VUE_APP_BASE_URL + 'photobank/albums/' + id)
				commit('setAlbum', response.data)
			} catch (e) {
				alert('Ошибка получения данных с сервера о альбоме')
			}
		},

		async fetchSearchTips({ state, commit }) {
			if(_.isEmpty(state.searchtips)){
				try {
					const response = await axios.get(process.env.VUE_APP_BASE_URL + 'photobank/searchtips')
					commit('setSearchTips', response.data)
				} catch (e) {
					alert('Ошибка получения данных с сервера о поисковых подсказках')
				}
			}
		},

		async fetchCartPhotos({ state, commit }, ids) {
			if(!ids) ids = state.cart
			let exist = state.cart_photos.filter(el => ids.includes(el.id))
			if(exist.length && exist.length === state.cart.length) return
			try {
				const response = await axios.get(process.env.VUE_APP_BASE_URL + 'photobank/photosbyids', {
					params: {
						ids: ids
					}
				})
                console.log(response.data);
				commit('setCartPhotos', response.data)
			} catch (e) {
				console.log(e)
				alert('Ошибка получения данных с сервера о альбоме')
			}
		},

		async fetchPayedPhotos({ state, commit }, order_id){
            api.get(process.env.VUE_APP_BASE_URL+'getpayedphotos', {
				params: {
					order_id: order_id ? order_id : null
				}
			}).then(response => {
				commit('setPayedPhotos', response.data)
            }).catch(error => {
                console.log(error)
                alert('Ошибка получения данных с сервера о купленных фото')
            })
        },

		async fetchPayedPhotosIds({ state, commit }, force){
            api.get(process.env.VUE_APP_BASE_URL+'getpayedphotosids').then(response => {
				commit('setPayedPhotosIds', response.data)
            }).catch(error => {
                console.log(error)
                alert('Ошибка получения данных с сервера о id купленных фото')
            })
        },

		async fetchPhotosByAthletes({ state, commit }){
            api.get(process.env.VUE_APP_BASE_URL+'getphotosbyathletes').then(response => {
				commit('setPhotosByAthletes', response.data)
            }).catch(error => {
                console.log(error)
                alert('Ошибка получения данных с сервера о добавленных атлетах')
            })
        },

		changeLocalStorage({state}) {
			localStorage.setItem('cart', JSON.stringify(state.cart))
		},
	},
	namespaced: true,
}
