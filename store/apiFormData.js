import axios from "axios"
import router from "@/router"

const api = axios.create()

api.interceptors.request.use(config => {
    if(localStorage.getItem('access_token')){
        config.headers = {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
            'authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    }
    return config
}, error => {
    console.log('Ошибка отправки данных')
})

api.interceptors.response.use(config => {
    if(localStorage.getItem('access_token')){
        config.headers = {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
            'authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    }

    return config
}, error => {
    if(error.response.status === 401){
        localStorage.removeItem('access_token')
        router.push({name: 'login'})
    }
})

export default api