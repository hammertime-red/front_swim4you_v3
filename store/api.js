import axios from "axios"

const api = axios.create()

api.interceptors.request.use(config => {
    if(localStorage.getItem('access_token')){
        config.headers = {
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
            'Accept': 'application/json',
            'authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    }

    return config
}, error => {
    if (error.response) {
		console.log(error.response.data)
    } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request)
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
    }

    if(error.response.status === 401){
        const router = useRouter()
        localStorage.removeItem('access_token')
        if(router.currentRoute.value.name == 'home'){
            return
        }
        router.push({name: 'login'})
    }
    else if(error.response.status === 404){
        router.push({name: 'not_found'})
    }
})

export default api