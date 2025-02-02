import { defineStore } from 'pinia';
//import moment from "moment-timezone";

export const useGlobalStore = defineStore('globalStore', {
    state: () => ({
        offcanvas: {
            mobile_menu: false,
            add_club: false,
            search_box: false,
            add_athlet: false,
            edit_athlet: false,
            add_documents: false,
            check_documents: false,
            upsell_default: false,
            upsell_for_every: false,
            master_class: false,
            choose_event_form: false,
            camp_shift: false,
        },
        offcanvas_data_name: null,
        offcanvas_data: null,

        global: null,
        server_time: null,
        footer_top_padding: 30,
        main_menu: [],
        seo: null,
        social_links: {},
        offer_block: null,
        requisits: null,
        countries: [],
        athlete_categories: [
            // Разряды здесь...
        ],
        athlete_documents: [
            // Документы здесь...
        ],
        payment_methods: [],
    }),
    getters: {
        getOffcanvas: (state) => (el) => state.offcanvas[el],
        getOffcanvasData: (state) => state.offcanvas_data,
        getOffcanvasDataName: (state) => state.offcanvas_data_name,
        getBackgroundStatus: (state) =>
            Object.values(state.offcanvas).includes(true),
        getMainMenu: (state) => state.main_menu,
        getRawAthleteDocuments: (state) => [...state.athlete_documents].map(doc => ({
            id: doc.id,
            name: doc.name,
            description: doc.description,
            is_multiple: doc.is_multiple,
            files: [...(doc.files || [])]
        })),
        getClubs: (state) => state.clubs,
        PAGE_PRIVACY_POLICY: (state) => state?.global?.pages?.privacy_policy || null,
        /*getCountries: (state) => state.countries,
        getRussiaSubjects: (state) =>
            state.russia_subjects.sort((a, b) => a.name.localeCompare(b.name)),
        getRussiaCities: (state) => state.russia_cities,
        getRussiaCitiesBySubject: (state) => (el) => {
            if (!el) return [];
            const subject = state.russia_subjects.find(
                (item) => item.code === el
            );
            if (!subject) return [];
            return state.russia_cities.filter(
                (item) => item.subject === subject.name
            );
        },
        getCities: (state) =>
            [...state.russia_cities].sort((a, b) => b.population - a.population),*/
        getAthleteCategories: (state) => state.athlete_categories,
        getAthleteDocuments: (state) => state.athlete_documents,
        getSearchIndex: (state) => state.search_index,
        getFilterResultsIndex: (state) => state.filter_results_index,
        getPaymentMethods: (state) => state.payment_methods,
        getSocialLinks: (state) => state.social_links,
        getOfferBlock: (state) => state.offer_block,
        getFooterTopPadding: (state) => state.footer_top_padding,
    },
    actions: {
        setServerTime(time) {
            this.server_time = time;
        },
        toggleOffcanvas(el) {
            this.offcanvas[el] = !this.offcanvas[el];
        },
        closeOffcanvas(el) {
            this.offcanvas[el] = false;
        },
        setOffcanvasDataName(str) {
            this.offcanvas_data_name = str;
        },
        setOffcanvasData(data) {
            this.offcanvas_data = data;
        },
        openOffcanvas(el) {
            this.offcanvas[el] = true;
        },
        closeAllOffcanvas() {
            for (let index in this.offcanvas) {
                this.offcanvas[index] = false;
            }
        },
        setMenu(main_menu) {
            this.main_menu = main_menu.map((item) => ({
                ...item,
                isActive: false,
            }));
        },
        setFooterTopPadding(response) {
            this.footer_top_padding = response + 30;
        },
        async fetchSettings() {
            await fetchData('settings')
                .then((response) => {
                    this.setSettings(response);
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        setSettings(payload) {
            if(payload?.menus?.main?.menu_items) this.setMenu(payload?.menus?.main?.menu_items)
            if(payload?.event_categories) this.event_categories = payload?.event_categories
            if(payload?.seo) this.seo = payload?.seo
            if(payload?.social_links) this.social_links = payload?.social_links
            if(payload?.offer_block) this.offer_block = payload?.offer_block
            if(payload?.requisits) this.requisits = payload?.requisits
            if(payload?.countries) this.countries = payload?.countries
            if(payload?.athlete_categories) this.athlete_categories = payload?.athlete_categories
            if(payload?.athlete_documents) this.athlete_documents = payload?.athlete_documents
            if(payload?.global) this.global = payload?.global
        },
        async fetchDictionaryClubs(query) {
            return await fetchData(`dictionary/clubs`, {
                params: {query}
            }).catch((e) => {
                return Promise.reject(e);
            });
        },

        async fetchDictionaryRegions(query, country_id = null) {
            return await fetchData(`dictionary/regions`, {
                params: {query, country_id}
            }).catch((e) => {
                return Promise.reject(e);
            });
        },

        async fetchDictionaryCities(query, region_id = null, country_id = null) {
            return await fetchData(`dictionary/cities`, {
                params: {query, region_id, country_id}
            }).catch((e) => {
                return Promise.reject(e);
            });
        },
    },
});
