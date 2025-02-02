import {useApi} from "~/composables/useApi";
import {useAuthApi} from "~/composables/useAuthApi";

export default defineNuxtPlugin(() => {
    const apiClient = useApi();
    const apiAuthClient = useAuthApi();
    return {
        provide: {
            apiClient,
            apiAuthClient
        }
    };
});