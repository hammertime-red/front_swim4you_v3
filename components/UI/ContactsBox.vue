<template>
    <div class="content_box p-5">
        <div class="row g-4">
            <div class="col-md-6">
                <p class="font-oswald uppercase fs-2 mb-5">Контакты</p>
                <div class="row g-4">
                    <div v-if="address" class="col-12 flex">
                        <vue-feather
                            type="map-pin"
                            class="me-3 text-sub flex-shrink-0"
                        />
                        <p class="text_20 mb-0">
                            {{address}}
                        </p>
                    </div>

                    <template v-if="phones && Object.keys(phones).length > 0">
                        <div v-for="(phone, i) in phones" :key="i" class="col-auto">
                            <p class="text-sub mb-1">{{phone.name ? phone.name : 'Телефон:'}}</p>
                            <a
                                :href="'tel:'+phone.text"
                                class="text-dark text-decoration-none text_20 mb-0"
                                >{{phone.text}}</a
                            >
                        </div>
                    </template>

                    <template v-if="emails && Object.keys(emails).length > 0">
                        <div v-for="(email, i) in emails" :key="i" class="col-auto">
                            <p class="text-sub mb-1">{{email.name ? email.name : 'Email:'}}</p>
                            <a
                                :href="'mailto:'+email.text"
                                class="text-dark text-decoration-none text_20 mb-0"
                                >{{email.text}}</a
                            >
                        </div>
                    </template>
                    
                    <div v-if="contacts_workhours" class="col-auto">
                        <p class="text-sub mb-1">Режим работы:</p>
                        <p class="text_20 mb-0">{{contacts_workhours}}</p>
                    </div>

                    <div v-if="socials && Object.keys(socials).length > 0" class="col-auto">
                        <SocialLinks :items="socials" className="h-full"/>
                    </div>
                </div>
            </div>
            <div v-if="coord" class="col-md-6">
                <YandexMap :coords="coord.split(',')" />
            </div>
        </div>
    </div>
</template>

<script>
import YandexMap from '../YandexMap.vue'
import SocialLinks from '../SocialLinks'
export default {
  components: { SocialLinks, YandexMap },
  props: ['address', 'phones', 'emails', 'contacts_workhours', 'socials', 'coord']
};
</script>

<style>
</style>