import axios from "axios"

export const homeStateModule = {
    state: () => ({
        home: {
            site_description: '',
            home_slider: [],
            events: [],
            results: [],
            news: [],
            media_photo: [],
            media_video: [],
            partners: [],
        },
        loaded: false
    }),
    getters: {
        allSlides(state){
            let slideArray = state.home.home_slider.map(function (item, i) {
                let isActive = false;
                if (i == 0) {
                  isActive = true;
                }
                item.isActive = isActive
                return item
            })
            return slideArray
        },
        eventTabs(state){
            return state.home.events
        },
        results(state){
            return state.home.results
        },
        news(state){
            return state.home.news
        },
        mediaPhoto(state){
            return state.home.media_photo
        },
        mediaVideo(state){
            return state.home.media_video
        },
        partners(state){
            return state.home.partners
        },
    },
    mutations: {
        setHome(state, response) {
            state.home = response;
        },
        setLoaded(state, response) {
            state.loaded = response;
        },
        setSlideActive(state, newData){
            state.home.home_slider[newData.id].isActive = newData.status
        }
    },
    actions: {
        
        async fetchHome({state, commit}){
            if(!this.loaded){
                try{
                    const response = await axios.get(process.env.VUE_APP_BASE_URL+'home')
                    if(!response.data?.success){
                        alert(response.data?.message)
                    }
                    commit('setHome', response.data.data)
                    commit('setLoaded', true)
                } catch (e){
                    console.log(e.response);
                    alert("Ошибка получения данных с сервера о главной странице")
                }
            }
        },
    },
    namespaced: true
}