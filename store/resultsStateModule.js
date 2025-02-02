import axios from "axios"

export const resultsStateModule = {
    state: () => ({
        records: [],
        ratings: [],
        tournaments: []
    }),
    getters: {
        getRecords(state) {
            return state.records
        },
        getRatings(state) {
            return state.ratings
        },
        getTournaments(state) {
            return state.tournaments
        },
    },
    mutations: {
        setRecords(state, response) {
            state.records = response
        },
        setRatings(state, response) {
            state.ratings = response
        },
        setTournaments(state, response) {
            state.tournaments = response
        },
    },
    actions: {
        async fetchRecords({state, commit}){
            if(_.isEmpty(state.records)){
                try{
                    const response = await axios.get(process.env.VUE_APP_BASE_URL+'results/records')
                    commit('setRecords', response.data)
                } catch (e){
                    alert("Ошибка получения данных с сервера о категориях мероприятий")
                }
            }
        },
        async fetchRatings({state, commit}){
            if(_.isEmpty(state.ratings)){
                try{
                    const response = await axios.get(process.env.VUE_APP_BASE_URL+'results/ratings')
                    commit('setRatings', response.data)
                } catch (e){
                    alert("Ошибка получения данных с сервера о категориях мероприятий")
                }
            }
        },
        async fetchTournaments({state, commit}){
            if(_.isEmpty(state.tournaments)){
                try{
                    const response = await axios.get(process.env.VUE_APP_BASE_URL+'results/tournaments')
                    commit('setTournaments', response.data)
                } catch (e){
                    alert("Ошибка получения данных с сервера о категориях мероприятий")
                }
            }
        },
    },
    namespaced: true
}