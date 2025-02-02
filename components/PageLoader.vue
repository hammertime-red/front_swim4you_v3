<template>
  <div class="page-loader">
		<div class="flex justify-center items-center h-screen  text-primary-500 font-bold">
            <Icon name="line-md:loading-twotone-loop" size="50px" />
		</div>
	</div>
</template>

<script>
export default {

}
</script>

<style scoped>
    .page-loader{
        position: fixed;
        height: 100vh;
        width: 100%;
        top: 0;
        background: rgba(255, 255, 255, 0.47);
        z-index: 9999;
        backdrop-filter: blur(10px);
    }
</style>