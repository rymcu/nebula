import appConfig from './config/app.config'
import apiConfig from './config/api.config'
import {isProdMode, isDevMode} from './environment'


export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'universal',
  /*
  ** Render configuration
  */
  render: {
    csp: true
  },
  modern: true,
  dev: isDevMode,
  env: {
    BASE: apiConfig.BASE,
    HOST_URL: apiConfig.SOCKET
  },
  cache: {
    max: 100,
    maxAge: 1000 * 60 * 15
  },
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: appConfig.meta.title,
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'keywords', name: 'keywords', content: appConfig.meta.keywords},
      {hid: 'description', name: 'description', content: appConfig.meta.description}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    {src: '@/plugins/axios'},
    {src: '@/plugins/element-ui'},
    {src: '@/plugins/vditor', ssr: false}
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [],
  /*
  ** Nuxt.js modules
  */
  modules: [
    ['@nuxtjs/axios', {baseURL: apiConfig.BASE}],
    'js-cookie',
    'cookieparser'
  ],
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    transpile: [/^element-ui/],
  }
}
