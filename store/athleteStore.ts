import {defineStore} from "pinia";

export const useAthleteStore = defineStore('athleteStore', {
    state: () => ({
        athletes: [],
    }),
    getters: {
        userAthletes: (state) => {
            const userStore = useUserStore()
            return state.athletes.filter(item => item?.client_id === userStore.userdata?.id)
        },
    },
    actions: {
        setAthletes(payload: any) {
            payload.forEach((athlete) => {
                if (!this.athletes.some((originalItem) => originalItem.id === athlete.id)) {
                    this.athletes.push(athlete);
                }
            });
        },
        addOrChangeAthlete(athlete) {
            const index = this.athletes.findIndex((item) => item.id === athlete.id);
            if (index > -1) {
                this.athletes[index] = athlete;
            } else {
                this.athletes.push(athlete);
            }
        },
        setDocuments(athlete_id, documents) {
            const index = this.athletes.findIndex((item) => item.id === athlete_id);
            if (index > -1) {
                this.athletes[index].documents = documents;
            }
        },
        async createAthlete(payload: any) {
            let request = payload
            if(payload.avatar){
                request = getFormdata(request)
            }
            await fetchAuth('athletes', {
                method: 'POST',
                body: request
            }).then((response) => {
                this.addOrChangeAthlete(response)
            }).catch((e) => {
                return Promise.reject(e);
            })
        },
        async updateAthlete(payload: any, athlete_id: number) {
            let request = payload
            if(payload.avatar){
                request = getFormdata(request)
                request['_method'] = 'PUT';
            }
            await fetchAuth(`athletes/${athlete_id}`, {
                method: payload.avatar ? 'POST' : 'PUT',
                body: request
            }).then((response) => {
                this.addOrChangeAthlete(response)
            }).catch((e) => {
                return Promise.reject(e);
            })
        },
        async getDocuments(athlete_id) {
            return await fetchAuth(`athletes/${athlete_id}/documents`)
                .then((response) => {
                    this.setDocuments(athlete_id, response)
                }).catch((e) => {
                    return Promise.reject(e);
                })
        },
        async uploadDocuments(documents: [], athlete_id: number) {
            await fetchAuth(`athletes/${athlete_id}/documents`, {
                method: 'POST',
                body: getFormdata(documents)
            }).then((response) => {
                this.setDocuments(athlete_id, response)
            }).catch((e) => {
                return Promise.reject(e);
            })
        },
        async fetchSingleAthlete(athlete_id) {
            return await fetchData(`athletes/${athlete_id}`)
                .then((response) => {
                    return response;
                }).catch((e) => {
                    return Promise.reject(e);
                })
        },
        async searchAthletes(search: string) {
            return await fetchData(`athletes/search`, {
                method: 'GET',
                query: {
                    search
                },
            })
            .then((response) => {
                return response;
            }).catch((e) => {
                return Promise.reject(e);
            })
        },
        async deleteAthlete(id){
            return await fetchAuth(`athletes/${id}`, {
                method: 'DELETE'
            }).then((response) => {
                this.athletes = this.athletes.filter((item) => item.id !== id);
            })
        }
    },
})