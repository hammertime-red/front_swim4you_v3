<template>
	<div class="order_result__cont">
		<div v-if="status == 'paid'" class="order_result order_result__success bg-positive rounded p-4 p-md-5">
			<div class="row g-4 items-center">
				<div class="col-md-12">
					<h2 class="uppercase section_title_medium font-bold text-white mb-0">Спасибо, ваш заказ оплачен</h2>
				</div>
			</div>
		</div>

        <div v-else class="order_result order_result__pending bg-warning text-dark rounded p-5">
			<div class="row g-4 items-center">
				<div class="col-md-12">
					<h2 class="uppercase section_title_medium font-bold">Оплата не удалась</h2>
					<p class="mb-0">
						Пожалуйста, проверьте правильность ввода данных карточки, наличие необходимой суммы на счету и попробуйте еще раз.<br>
						<b>Если вы уверены, что оплата прошла успешно, просто перезагрузите страницу, возможно мы еще не получили информацию о платеже.</b>
					</p>
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
    emits: ['goToPayment']
}
</script>

<style></style>
