// plugins/alert.ts
import { defineNuxtPlugin } from '#imports'
import { createApp } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
    let alertComponent: any = null
    let isInitialized = false

    if (process.client) {
        const initAlert = async () => {
            const CustomAlert = await import('~/components/UI/CustomAlert.vue')
            const alertContainer = document.createElement('div')
            alertContainer.id = 'alert-container'
            document.body.appendChild(alertContainer)

            const app = createApp(CustomAlert.default)
            app.component('Icon', nuxtApp.vueApp._context.components.Icon)

            alertComponent = app.mount('#alert-container')
            isInitialized = true
        }

        initAlert()
    }

    const waitForInit = async () => {
        let attempts = 0
        const maxAttempts = 50

        while (!isInitialized && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100))
            attempts++
        }

        if (!isInitialized) {
            throw new Error('Alert initialization timeout')
        }
    }

    const swal = {
        fire: async (options: any) => {
            if (!isInitialized) {
                await waitForInit()
            }
            return alertComponent.showAlert(options)
        },

        success: async (title: string) => {
            return swal.fire({ title, icon: 'success' })
        },

        error: async (title: string) => {
            return swal.fire({ title, icon: 'error' })
        },

        warning: async (title: string) => {
            return swal.fire({ title, icon: 'warning' })
        },

        info: async (title: string) => {
            return swal.fire({ title, icon: 'info' })
        },

        loading: (title: string, text: string = null) => {
            if (!isInitialized) {
                waitForInit()
            }
            alertComponent.showAlert({
                title,
                text,
                icon: 'loading',
                isLoading: true
            })
            return {
                close: () => {
                    if (alertComponent) {
                        alertComponent.closeAlert()
                    }
                }
            }
        }
    }

    return {
        provide: {
            swal
        }
    }
})