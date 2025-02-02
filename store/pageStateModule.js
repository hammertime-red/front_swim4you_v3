import axios from "axios"

export const pageStateModule = {
    state: () => ({
        page: {},
        contacts: {}
    }),
    getters: {
        getPage(state) {
            return state.page
        },
        getContacts(state) {
            return state.contacts
        },
    },
    mutations: {
        setPage(state, response) {
            state.page = response
        },
        setContacts(state, response) {
            state.contacts = response
        },
    },
    actions: {
        async fetchPage({state, commit}, id){
            try{
                const response = await axios.get(process.env.VUE_APP_BASE_URL+'page/'+id)
                commit('setPage', response.data)
            } catch (e){
                alert("Ошибка получения данных с сервера о новостных записях")
            }
        },
        async fetchContacts({state, commit}, id){
            try{
                const response = await axios.get(process.env.VUE_APP_BASE_URL+'contacts')
                commit('setContacts', response.data)
            } catch (e){
                alert("Ошибка получения данных с сервера о контактах")
            }
        },
    },
    namespaced: true
}