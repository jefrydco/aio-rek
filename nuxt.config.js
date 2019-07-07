/* eslint-disable nuxt/no-cjs-in-config */
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  // https://nuxtjs.org/api/configuration-modern
  modern: !isDev,

  // https://nuxtjs.org/api/configuration-head
  head: {
    titleTemplate(title) {
      if (title) {
        return `${title} - AIO Rek`
      }
      return 'AIO Rek'
    }
  },

  // https://nuxtjs.org/api/configuration-modules
  modules: [
    // https://http.nuxtjs.org/
    '@nuxt/http',

    '@nuxtjs/moment',

    // https://pwa.nuxtjs.org/
    '@nuxtjs/pwa',

    // https://github.com/Developmint/nuxt-webfontloader
    'nuxt-webfontloader'
  ],

  webfontloader: {
    google: {
      families: ['Roboto:100,300,400,500,700,900', 'Material+Icons']
    }
  },

  http: {
    // proxy: true
    baseURL: 'http://localhost:3001/api'
  },

  proxy: {
    // '/api': 'http://localhost:3001'
  },

  loading: {
    color: '#FF5722',
    height: '3px',
    failedColor: '#F44336'
  },

  // https://nuxtjs.org/api/configuration-plugins
  plugins: [
    '~plugins/components',
    '~plugins/vuetify',
    '~plugins/vee-validate',
    '~plugins/api',
    '~plugins/notify',
    '~plugins/handle-error',
    '~plugins/vue-directive.client',
    '~plugins/vuex-persist.client'
  ],

  // https://nuxtjs.org/api/configuration-css
  css: ['~assets/styles/app', '~/assets/styles/main'],

  // https://pwa.nuxtjs.org/modules/workbox.html
  workbox: {
    preCaching: [
      '/models/ssd_mobilenetv1_model-weights_manifest.json',
      '/models/face_recognition_model-weights_manifest.json',
      '/models/face_landmark_68_model-weights_manifest.json',
      '/models/face_expression_model-weights_manifest.json',
      '/models/age_gender_model-weights_manifest.json',
      '/models/ssd_mobilenetv1_model-shard1',
      '/models/ssd_mobilenetv1_model-shard2',
      '/models/face_recognition_model-shard1',
      '/models/face_recognition_model-shard2',
      '/models/face_landmark_68_model-shard1',
      '/models/face_expression_model-shard1',
      '/models/age_gender_model-shard1'
    ]
  },

  // serverMiddleware: ['~/api/index'],

  // https://nuxtjs.org/api/configuration-build
  build: {
    extractCSS: !isDev,
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~assets/styles/variables.styl']
      }
    },
    extend(config, { isDev, isClient }) {
      if (isClient) {
        config.node = {
          fs: 'empty'
        }
      }
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            fix: true
          }
        })
      }
    }
  }
}
