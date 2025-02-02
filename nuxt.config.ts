import 'dotenv/config';
import {PrimePreset} from "./primevue-themes/PrimePreset";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'ru'
      },
      title: 'Технология спорта | Swim4you',
      meta: [
        {
          name: 'description',
          content: 'Соревнования, тренировочные сборы, мастер-классы, методическое обеспечение подготовки'
        },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Технология спорта | Swim4you' },
        {
          property: 'og:description',
          content: 'Соревнования, тренировочные сборы, мастер-классы, методическое обеспечение подготовки'
        },
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  runtimeConfig: {
    apiSecret: '',
    public: {
      baseURL: process.env.MODE_PRODUCTION ? 'https://api.swim4you.ru/api/v2/' : 'http://swim4you-v3.loc/api/v2/',
    }
  },
  css: ['~/assets/styles/main.scss'],
  components: false,
  devtools: { enabled: process.env.DEVTOOLS === 'true' || true },
  ssr: process.env.SSR_MODE ? process.env.SSR_MODE === 'true' : false,

  plugins: [
    '~/plugins/api.client.ts',
    //'~/plugins/vee-validate.ts',
    //'~/plugins/v-viewer.client.ts',
  ],

  modules: ['@nuxt/image', '@nuxtjs/tailwindcss', 'shadcn-nuxt', '@pinia/nuxt', ['@nuxtjs/google-fonts', {
    families: {
      'Nunito Sans': [400, 500, 700],
      Oswald: [400, 500, 700],
    }
  }], 'nuxt-svgo', '@nuxtjs/color-mode', '@nuxt/icon', '@primevue/nuxt-module', "nuxt-lodash"],

  primevue: {
    autoImport: false,
    components: {
      prefix: 'Prime',
      include: ['DataTable']
    },
    directives: {
      prefix: 'Prime'
    },
    options: {
      theme: {
        preset: PrimePreset,
        options: {
          prefix: 'p',
          darkModeSelector: false,
          cssLayer: false
        }
      },
    }
  },

  colorMode: {
    preference: 'light',
    fallback: 'light',
  },

  shadcn: {
    prefix: 'Ui',
    componentDir: './components/ui'
  },

  pinia: {
    storesDirs: ['./store/**']
  },

  vite: {
    plugins: [
      import('vite-svg-loader').then(({ default: svgLoader }) => svgLoader())
    ],
    build: {
      sourcemap: true,  // Включение исходных карт для Vite
    },
  },

  sourcemap: true,

  typescript: {
    tsConfig: {
      compilerOptions: {
        types: [
          "@nuxt/types",
        ]
      }
    },
  },

  /*aliases: {
  },*/

  /*alias: {
    '@': "/"
  },*/

  /* vue: {
      compilerOptions: {
          isCustomElement: tagName => {
              return tagName === 'vue-advanced-chat' || tagName === 'emoji-picker'
          }
      }
  }, */

  compatibilityDate: '2024-08-27'
})