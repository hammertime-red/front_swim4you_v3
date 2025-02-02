<template>
	<div v-if="!is_subscribed" class="container">
		<div class="subcribe_section">
			<p class="title">Подпишитесь на рассылку</p>
			<p class="subtitle lead">
				И получайте свежую информацию о новых меропрятиях и событиях на свой email
			</p>
			<form @submit.prevent="sendSubmit" class="subcribe_form">
				<div class="row">
					<div class="col-md-4 mb-4 mb-md-0">
						<input
							v-model="name"
							type="text"
							class="form-control"
							placeholder="Введите ваше имя"
							required />
					</div>
					<div class="col-md-4 mb-4 mb-md-0">
						<input
							v-model="email"
							type="email"
							class="form-control"
							placeholder="Введите ваш email"
							required />
					</div>
					<div class="col-md-4 mb-4 mb-md-0">
						<button sype="submit" class="btn btn-warning w-full" :disabled="loading">
							<vue-feather
								v-if="loading"
								type="settings"
								animation="spin"
								animation-speed="slow"></vue-feather>
							<span v-else>Подписаться</span>
						</button>
					</div>
					<div class="col-12 mt-3">
						<p class="small opacity-50 mb-0">
							Нажав кнопку "Подписаться", вы подтверждаете согласие с
							<NuxtLink to="/page/8" class="text-white"
								>политикой конфиденциальности</NuxtLink
							>
						</p>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
export default {
	data() {
		return {
			name: null,
			email: null,
			loading: false,
			error_message: null,
		}
	},
    watch: {
        userData(promise) {
			this.name = this.userData.name
            this.email = this.userData.email
		},
    },
	methods: {
		sendSubmit() {
            this.loading = true
			axios
				.post(
					'https://sendsay.ru/form/x_16668613823300/1/',
					{
						_member_email: this.email,
						q521: this.name,
					},
					{
						headers: {
							'Accept': 'application/json',
						},
					}
				)
				.then((res) => {
					this.loading = false
					this.error_message = null
					if (res.data.page) {
                        console.log(res.data)
                        this.setSubscribed()
						this.showAlert('success')
					} else {
                        console.log(res.data)
						this.showAlert('error')
					}
				})
				.catch((error) => {
					this.loading = false
                    console.log(error.response.data)
					this.showAlert('error')
				})
		},
		showAlert(status) {
			if (status === 'success') {
				this.$swal('Спасибо за подписку', 'Пожалуйста, проверьте почтовый ящик и подтвердите согласие на рассылку', 'success')
			} else {
                this.$swal('Упс, похоже возникла ошибка', 'Пожалуйста, попробуйте подписаться еще раз, если ошибка повторится - пожалуйста, свяжитесь с администратором сайта', 'error')
            }
		},
        setSubscribed(){
            localStorage.setItem('is_subscribed', 1)
            this.$store.dispatch("profile/fetchIsSubcribed");
        }
	},
	computed: {
		is_subscribed() {
			if (localStorage.getItem('is_subscribed')) {
				return localStorage.getItem('is_subscribed')
			} else {
				if (this.userData) {
					return this.userData.is_subscribed
				}
			}
			return
		},
		userData() {
			return this.$store.getters['profile/getUserData']
		},
	},
}
</script>

<style></style>
