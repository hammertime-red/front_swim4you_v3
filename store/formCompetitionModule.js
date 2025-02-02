import axios from "axios"

export const formCompetitionModule = {
    state: () => ({
        formCompetition: {
            current_step: 0,
            video_instructions: null,
            upsell_id_for_modal: 0,
        }
    }),
    getters: {
        getCurrentStep(state){
            return state.formCompetition.current_step
        },
        getathletesFieldgroups(state) {
            return state.formCompetition.athletes_fieldgroups
        },
        getOfflineRequestText(state) {
            return state.formCompetition.offline_request_text
        },
        getVideoInstructions(state) {
            return state.formCompetition.video_instructions
        },
        getEstafetas(state) {
            return state.formCompetition.estafetas
        },
        getUpsellModalId(state) {
            return state.formCompetition.upsell_id_for_modal
        },
        getUpsells(state) {
            return state.formCompetition.upsells
        },
        getUpsellsSummary(state) {
            let summ = 0
            for(let i = 0; i < state.formCompetition.upsells.length; i++){
                let item = state.formCompetition.upsells[i]
                let item_summ = item.price * item.count
                summ = summ + item_summ
            }
            return summ
        }
    },
    mutations: {
        setCurrentStep(state, value) {
            state.formCompetition.current_step = value
        },
        addAthletFieldgroup(state) {
            const emptyObj = {
                athlet: null,
                online_request: true,
                documents: null,
                distances: [
                    {
                        name: null,
                        time_edit: false,
                        time: null
                    }
                ]
            }
            state.formCompetition.athletes_fieldgroups.push(emptyObj)
        },
        removeAthletFieldGroup(state, index) {
            state.formCompetition.athletes_fieldgroups.splice(index, 1)
        },
        addAthletDistance(state, index) {
            const emptyObj = {
                name: null,
                time_edit: false,
                time: null
            }
            state.formCompetition.athletes_fieldgroups[index].distances.push(emptyObj)
        },
        removeAthletDistance(state, index) {
            state.formCompetition.athletes_fieldgroups[index.parent].distances.splice(index.child, 1)
        },
        setEstafetaCount(state, obj) {
            if(obj.value > 0){
                state.formCompetition.estafetas[obj.index].count = obj.value
            }
        },
        setUpsellCount(state, obj) {
            if(obj.value >= 0){
                state.formCompetition.upsells[obj.index].count = obj.value
            }
        },
        setIdForModal(state, index) {
            state.formCompetition.upsell_id_for_modal = index
        },
    },
    namespaced: true
}