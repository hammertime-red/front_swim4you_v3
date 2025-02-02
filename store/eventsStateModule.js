import axios from "axios"
import moment from 'moment-timezone'

export const eventsStateModule = {
    state: () => ({
        event_cats: [],
        event_post: {},
        stage_post: {},
        form_stage_post: {},
        events_results: [],
        distances_places: [],
        stage_order_athletes: [],
        current_time: null,
    }),
    getters: {
        CURRENT_TIME(state) {
            return state.current_time
        },
        getEventCats(state) {
            return state.event_cats
        },
        getEventCatById: (state) => (id) => {
            return state.event_cats.find(cat => cat.id === id)
        },
        getEventPost(state) {
            return state.event_post
        },
        getStagePost(state) {
            return state.stage_post
        },
        getFormStagePost(state) {
            return state.form_stage_post
        },
        DISTANCES(state){
            if(!state.form_stage_post?.distances) return []
            return state.form_stage_post.distances
        },
        RELAY_RACES(state){
            if(!state.form_stage_post?.relay_races) return []
            return state.form_stage_post.relay_races
        },
        getStageDistanceByID: (state, getters) => (id) => {
            return getters.DISTANCES.find(item => item.id === id)
        },
        getRelayRaceByID: (state, getters) => (id) => {
            return getters.RELAY_RACES.find(item => item.id === id)
        },
        getEventResults(state) {
            return state.events_results
        },
        getDisabledDistances(state, getters){
            return getters.DISTANCES.filter(item => item.places_reserved >= item.places_limit).map(item => item.id)
        },
        /* getStageOrdersAthletes(state) {
            return state.stage_order_athletes
        }, */
    },
    mutations: {
        setEventCats(state, event_cats) {
            state.event_cats = event_cats
        },
        setEvent(state, event_post) {
            state.event_post = event_post
        },
        setStage(state, stage_post) {
            state.stage_post = stage_post
        },
        setFormStage(state, stage_post) {
            state.form_stage_post = stage_post
        },
        setCurrentDate(state, date) {
            state.current_time = moment(date).tz('Europe/Moscow')
        },
        /* setStageOrdersAthletes(state, response) {
            state.stage_order_athletes = response
        }, */
        setEventResults(state, response) {
            state.events_results = response
        },
        setDistancePlaces(state, {response, getters}){
            if(!response || !response?.id || !response?.places_reserved || !response?.places_limit) return
            let index = getters.DISTANCES.findIndex(item => item.id == response.id)
            if(index < 0) return
            state.stage_post.distances[i].places_reserved = response.places_reserved
            state.stage_post.distances[i].places_limit = response.places_limit
        },
        setAgeLimits(state, response){
            if(!response?.items || response.items.length) return
            state.stage_post.age_limits = response.items
        }
    },
    actions: {
        async fetchEventCats({state, commit}){
            try{
                const response = await axios.get(process.env.VUE_APP_BASE_URL+'events/cards')
                commit('setEventCats', response.data)
                commit('setCurrentDate', response.headers?.date)
            } catch (e){
                if(e.response.status === 404){
                    //router.push({name: 'not_found'})
                } else {
                    alert("Ошибка получения данных с сервера о категориях мероприятий")
                }
            }
        },
        async fetchEvent({state, commit}, id){
            if(state.event_post?.id && state.event_post.id == id) return
            try{
                const response = await axios.get(process.env.VUE_APP_BASE_URL+'events/'+id)
                commit('setEvent', response.data)
                commit('setCurrentDate', response.headers?.date)
            } catch (e){
                if(e.response.status === 404){
                    //router.push({name: 'not_found'})
                } else {
                    alert("Ошибка получения данных с сервера о странице")
                }
            }
        },
        async fetchStage({state, commit}, id){
            try{
                const response = await axios.get(process.env.VUE_APP_BASE_URL+'event-stage/'+id)
                commit('setStage', response.data)
                commit('setCurrentDate', response.headers?.date)
            } catch (e){
                if(e.response.status === 404){
                    //router.push({name: 'not_found'})
                } else {
                    alert("Ошибка получения данных с сервера о странице")
                }
            }
        },
        async fetchFormStage({state, commit}, id){
            if(state.form_stage_post?.id && state.form_stage_post.id == id) return
            try{
                const response = await axios.get(process.env.VUE_APP_BASE_URL+'form/event-stage/'+id)
                commit('setFormStage', response.data)
                commit('setCurrentDate', response.headers?.date)
            } catch (e){
                if(e.response.status === 404){
                    //router.push({name: 'not_found'})
                } else {
                    alert("Ошибка получения данных с сервера о странице")
                }
            }
        },
        async fetchDistancePlaces({state, commit}, id){
            try{
                const response = await axios.get(process.env.VUE_APP_BASE_URL+'distances/'+id+'/getplaces')
                commit('setDistancePlaces', response)
                commit('setCurrentDate', response.headers?.date)
                return response.data
            } catch (e){
                console.log(e.response)
                alert("Ошибка получения данных с сервера о доступности мест")
            }
        },
        async fetchAgeLimits({state, commit}, event_stage_id) {
            try{
                const response = await axios.get(`${process.env.VUE_APP_BASE_URL}event-stage/${event_stage_id}/agelimits`)
                commit('setAgeLimits', response.data)
                commit('setCurrentDate', response.headers?.date)
            } catch (e){
                console.log(e.response)
                alert("Ошибка получения данных с сервера о доступности мест")
            }
        },
        //Устарело
        /* async fetchStageOrdersAthletes({state, commit}, id){
            try{
                const response = await axios.get(process.env.VUE_APP_BASE_URL+'event-stage/'+id+'/orders-athletes')
                commit('setStageOrdersAthletes', response.data)
                commit('setCurrentDate', response.headers?.date)
            } catch (e){
                if(e.response.status === 404){
                    router.push({name: 'not_found'})
                } else {
                    alert("Ошибка получения данных с сервера о странице")
                }
            }
        }, */
        async fetchEventResults({state, commit}){
            try{
                const response = await axios.get(process.env.VUE_APP_BASE_URL+'results/archive')
                commit('setEventResults', response.data)
                commit('setCurrentDate', response.headers?.date)
            } catch (e){
                if(e.response.status === 404){
                    //router.push({name: 'not_found'})
                } else {
                    alert("Ошибка получения данных с сервера о результатах")
                }
            }
        },
    },
    namespaced: true
}