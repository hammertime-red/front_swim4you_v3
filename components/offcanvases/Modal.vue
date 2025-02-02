<template>
<CModal size="lg" alignment="center" :visible="globalStore.getOffcanvas(id)" @close="globalStore.closeOffcanvas(id)">
    <button @click="globalStore.closeOffcanvas(id)" type="button" class="btn-close text-reset"></button>
    <div class="modal-body">
        <slot />
    </div>
</CModal>
<div></div>
</template>

<script>
import {
    CModal
} from '@coreui/vue'
import {useGlobalStore} from '@/store/globalStore'
export default {
    props: ['id'],
    components: {
        CModal, 
    },
    setup() {
        const globalStore = useGlobalStore();
        return {
            globalStore
        };
    },
}
</script>

<style scoped>
.modal-content{
    border: none;
}

.btn-close{
    position: absolute;
    top: 20px;
    right: 20px;
    opacity: 0.5;
    z-index: 1000;
}

.modal-body{
    padding: 60px 45px;
}

@media(max-width: 768px){

    .btn-close{
        top: 10px;
        right: 10px;
    }

    .modal-body{
        padding: 30px 15px;
    }
}

</style>
