import appConfig from './config/app.config'
import apiConfig from './config/api.config'
import {isDevMode} from './environment'

const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  ssr: true,
  /*
  ** Render configuration
  */
  render: {
    csp: false
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
    'element-ui/lib/theme-chalk/index.css',
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    {src: '~/plugins/avataaars/generator/generateAvatar'},
    {src: '~/plugins/extend'},
    {src: '~/plugins/axios'},
    {src: '~/plugins/element-ui'},
    {src: '~/plugins/vditor', ssr: false}
    // {src: '~/plugins/vue-cropper', ssr: false}
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    'js-cookie',
    'cookieparser'
  ],
  axios: {
    proxy: true  // 开启proxy
  },
  proxy: [  //proxy配置
    ['/api', {
      target: apiConfig.BASE,  //api请求路径
      pathRewrite: {'^/api': isDevMode ? '/api' : '/api'}  //重定向请求路径，防止路由、api路径的冲突
    }],
    ['/ws', {
      target: apiConfig.BASE  //api请求路径
    }]
  ],
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    transpile: [/^element-ui/],
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000
      }
    },
    extend(config, ctx) {
      config.plugins.unshift(new LodashModuleReplacementPlugin())
      // rules[2].use[0] is babel-loader
      config.module.rules.push({test: /\.txt$/, use: 'raw-loader'})
      config.module.rules[2].use[0].options.plugins = ['lodash']
    },
    babel: {
      presets({ envName }) {
        return [
          [
            '@nuxt/babel-preset-app',
            {
              loose: true
            }
          ]
        ]
      }
    }
  }
}
