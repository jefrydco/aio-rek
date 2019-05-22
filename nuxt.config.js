import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin'

const isDev = process.env.NODE_ENV !== 'production'

export default {
  mode: 'universal',

  // https://nuxtjs.org/api/configuration-modern
  modern: !isDev,

  // https://nuxtjs.org/api/configuration-head
  head: {
    titleTemplate(title) {
      if (title) {
        return `${title} - Ayo Rek Dashboard`
      }
      return 'Ayo Rek Dashboard'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ]
  },

  // https://nuxtjs.org/api/configuration-modules
  modules: [
    // https://axios.nuxtjs.org/
    '@nuxtjs/axios',

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

  // https://pwa.nuxtjs.org/modules/meta.html
  meta: {
    name: 'Ayo Rek Dashboard',
    description: 'Face recognition based attendance system.',
    lang: 'id',
    twitterCard: 'summary_large_image',
    twitterSite: '@jefrydco',
    twitterCreator: '@jefrydco'
  },

  // https://pwa.nuxtjs.org/modules/manifest.html
  manifest: {
    name: 'Ayo Rek Dashboard',
    short_name: 'Ayo Rek Dashboard',
    start_url: '/?utm_source=homescreen',
    description: 'Face recognition based attendance system.',
    lang: 'id',
    background_color: '#00BCD4'
  },

  // https://nuxtjs.org/api/configuration-loading
  loading: {
    color: '#FF5722',
    failedColor: '#F44336'
  },

  // https://nuxtjs.org/api/configuration-plugins
  plugins: ['~/plugins/vuetify', '~/plugins/vee-validate'],

  // https://nuxtjs.org/api/configuration-css
  css: ['@mdi/font/css/materialdesignicons.css', '~/assets/styles/app.styl'],

  serverMiddleware: ['~/api/index'],

  watch: ['~/api/**/*'],

  // https://nuxtjs.org/api/configuration-build
  build: {
    extractCSS: !isDev,
    parallel: isDev,
    cache: isDev,
    hardSource: isDev,
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~assets/styles/variables.styl']
      }
    },
    extend(config, { isDev, isClient }) {
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
