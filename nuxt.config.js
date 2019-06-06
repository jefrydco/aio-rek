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
        return `${title} - Ayo Rek Admin`
      }
      return 'Ayo Rek Admin'
    }
  },

  // https://nuxtjs.org/api/configuration-modules
  modules: [
    // https://http.nuxtjs.org/
    '@nuxt/http',

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
    proxy: true,
    prefix: '/api/'
  },

  proxy: {
    '/api': 'http://localhost:3001'
  },

  loading: {
    color: '#FF5722',
    height: '3px',
    failedColor: '#F44336'
  },

  // https://nuxtjs.org/api/configuration-plugins
  plugins: [
    '~plugins/vuetify',
    '~plugins/vee-validate',
    '~plugins/api',
    '~plugins/notify',
    '~plugins/handle-error'
  ],

  // https://nuxtjs.org/api/configuration-css
  css: ['~assets/styles/app.styl'],

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
