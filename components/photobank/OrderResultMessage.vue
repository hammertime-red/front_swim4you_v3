<template>
	<div class="order_result__cont">
		<div v-if="status == 'paid'" class="order_result order_result__success bg-positive rounded p-4 p-md-5">
			<div class="row g-4 items-center">
				<div class="col-md-8">
					<h2 class="uppercase section_title_medium font-bold">Спасибо, ваш заказ оплачен</h2>
					<p class="mb-0 text-sm">
						Вы можете скачать ваши изображения в максимальном разрешении в личном кабинете, в разделе “Мои фото”. <!-- Также фото отправлены на ваш
						email -->
					</p>
				</div>
				<div class="col-md-4 text-start text-md-end">
					<button @click.prevent="$emit('downloadPhotos')" class="btn btn-white rounded-pill px-5 text-dark">
                        <vue-feather type="download" size="20" class="me-2"/>
                        <span>Скачать фото</span>
                    </button>
				</div>
			</div>
		</div>

        <div v-else class="order_result order_result__pending bg-warning text-dark rounded p-5">
			<div class="row g-4 items-center">
				<div class="col-md-8">
					<h2 class="uppercase section_title_medium font-bold">Заказ не оплачен</h2>
					<p class="mb-0 text-sm">
						Пожалуйста, проверьте правильность ввода данных карточки и наличие необходимой суммы на счету.
					</p>
				</div>
				<div class="col-md-4 text-end">
					<button @click.prevent="$emit('goToPayment')" class="btn btn-white rounded-pill px-5 text-dark">Перейти к оплате</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
    props: {
        status: {
            type: String,
            required: true
        },
    },
    emits: ['downloadPhotos', 'goToPayment']
}
</script>

<style></style>
