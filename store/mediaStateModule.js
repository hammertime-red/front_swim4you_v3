import axios from "axios"

export const mediaStateModule = {
    state: () => ({
        posts: {},
        post: {},
    }),
    getters: {
        getPosts(state) {
            return state.posts
        },
        getPost(state) {
            return state.post
        },
    },
    mutations: {
        setPosts(state, response) {
            state.posts = response
        },
        setPost(state, response) {
            state.post = response
        },
    },
    actions: {
        async fetchPosts({state, commit}){
            try{
                const response = await axios.get(process.env.VUE_APP_BASE_URL+'media')
                commit('setPosts', response.data)
            } catch (e){
                alert("Ошибка получения данных с сервера о медиа записях")
            }
        },
        async fetchPost({state, commit}, id){
            try{
                const response = await axios.get(process.env.VUE_APP_BASE_URL+'media/'+id)
                commit('setPost', response.data)
            } catch (e){
                alert("Ошибка получения данных с сервера о медиа записи")
            }
        },
    },
    namespaced: true
}