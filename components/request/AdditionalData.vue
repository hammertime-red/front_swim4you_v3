<template>
<div class="content_box p-4 mb-4">
    <div class="content_box__header flex justify-between items-center mb-3 relative z-2">
        <h2 class="title_block mb-2">Дополнительные данные</h2>
    </div>
    <div v-if="club.name" class="row g-4">
        <div v-if="club.name" class="col-auto text-sm">
            <p class="text-sub mb-1">Клуб</p>
            <p class="font-bold mb-0">{{club.name}}</p>
        </div>
        <div v-if="club.shortname" class="col-auto text-sm">
            <p class="text-sub mb-1">Короткое название команды</p>
            <p class="mb-0">{{club.shortname}}</p>
        </div>
        <div v-if="club.state" class="col-auto text-sm">
            <p class="text-sub mb-1">Код региона</p>
            <p class="mb-0">{{club.state}}</p>
        </div>
    </div>
    <hr v-if="club.name">
    <div class="row g-4">
        <div v-if="contacts.name" class="col-auto text-sm">
            <p class="text-sub mb-1">ФИО представителя</p>
            <p class="mb-0">{{contacts.name}}</p>
        </div>
        <div v-if="contacts.phone" class="col-auto text-sm">
            <p class="text-sub mb-1">Телефон представителя</p>
            <p class="mb-0">{{contacts.phone}}</p>
        </div>
        <div v-if="contacts.email" class="col-auto text-sm">
            <p class="text-sub mb-1">Email представителя</p>
            <p class="mb-0">{{contacts.email}}</p>
        </div>
        <div v-if="contacts.city" class="col-auto text-sm">
            <p class="text-sub mb-1">Город</p>
            <p class="mb-0">{{contacts.city}}</p>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props:{
      club:{
        type: Object,
        default: {
            name: null,
            shortname: null,
            state: null,
        }
      },
      contacts:{
        type: Object,
        default: {
            name: null,
            phone: null,
            email: null,
        }
      },
    }
}
</script>

<style>

</style>
