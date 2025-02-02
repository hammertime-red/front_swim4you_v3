import { defineStore } from 'pinia';
import axios from 'axios';

export const useHomeStore = defineStore('home', {
    state: () => ({
        site_description: '',
        slider: [],
        events: [],
        results: [],
        news: [],
        media_photo: [],
        media_video: [],
        partners: [],
        loaded: false,
    }),

    getters: {
        allSlides(state) {
            return state.slider.map((item, i) => ({
                ...item,
                isActive: i === 0,
            }));
        },
        eventTabs(state) {
            return state.events;
        },
        results(state) {
            return state.results;
        },
        news(state) {
            return state.news;
        },
        mediaPhoto(state) {
            return state.media_photo;
        },
        mediaVideo(state) {
            return state.media_video;
        },
        partners(state) {
            return state.partners;
        },
    },

    actions: {
        setSlideActive(newData) {
            this.slider[newData.id].isActive = newData.status;
        },

        async fetchHome() {
            const { $apiClient } = useNuxtApp()
            return await $apiClient.get(`home`)
                .then((response) => {
                    return response;
                })
                .catch((e) => {
                return Promise.reject(e);
            });
        },

        setHome(payload) {
            console.log(payload)
            if(payload.page_content)
            this.home = payload;
        },
    },
});
