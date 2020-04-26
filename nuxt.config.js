const colors = require('vuetify/es5/util/colors').default

const isDev = process.env.NODE_ENV !== 'production'

// eslint-disable-next-line
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
    baseURL: 'http://0.0.0.0:3001/api'
  },

  proxy: {
    // '/api': 'http://0.0.0.0:3001'
  },

  loading: {
    color: '#FF5722',
    height: '3px',
    failedColor: '#F44336'
  },

  buildModules: [
    // Simple usage
    '@nuxtjs/vuetify'
  ],

  vuetify: {
    theme: {
      themes: {
        light: {
          primary: colors.cyan.base,
          secondary: colors.cyan.darken2,
          accent: colors.deepOrange.base,
          error: colors.red.base,
          info: colors.blue.base,
          success: colors.green.base,
          warning: colors.amber.base
        }
      }
    }
  },

  // https://nuxtjs.org/api/configuration-plugins
  plugins: [
    '~plugins/components',
    // '~plugins/vuetify',
    '~plugins/vee-validate',
    '~plugins/api',
    '~plugins/notify',
    '~plugins/handle-error',
    '~plugins/vue-directive.client',
    '~plugins/vuex-persist.client'
  ],

  // https://nuxtjs.org/api/configuration-css
  css: ['~assets/styles/app', '~/assets/styles/main'],

  // https://pwa.nuxtjs.org/modules/meta.html
  meta: {
    name: 'AIO Rek',
    description: 'Face recognition based attendance system',
    twitterCard: 'summary_large_image',
    twitterSite: '@jefrydco',
    twitterCreator: '@jefrydco'
  },

  // https://pwa.nuxtjs.org/modules/manifest.html
  manifest: {
    name: 'AIO Rek',
    short_name: 'AIO Rek',
    start_url: '/?utm_source=homescreen',
    description: 'Face recognition based attendance system',
    background_color: '#2D3748',
    theme_color: '#2D3748'
  },

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
    ],
    runtimeCaching: [
      {
        urlPattern: 'https://fonts.gstatic.com/.*',
        handler: 'staleWhileRevalidate'
      }
    ]
  },

  // serverMiddleware: ['~/api/index'],

  // https://nuxtjs.org/api/configuration-build
  build: {
    extractCSS: !isDev,
    transpile: ['vee-validate/dist/rules'],
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
