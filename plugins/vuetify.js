import LRUCache from 'lru-cache'
import Vue from 'vue'
import Vuetify, { VLayout } from 'vuetify/lib'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  options: {
    minifyTheme: css =>
      process.env.NODE_ENV === 'production'
        ? css.replace(/[\s|\r\n|\r|\n]/g, '')
        : css,
    themeCache: new LRUCache({
      max: 10,
      maxAge: 1000 * 60 * 60 // 1 hour
    }),
    cspNonce: 'dQw4w9WgXcQ'
  },
  components: {
    VLayout
  },
  theme: {
    primary: colors.cyan.base,
    secondary: colors.cyan.darken2,
    accent: colors.deepOrange.base,
    error: colors.red.base,
    info: colors.blue.base,
    success: colors.green.base,
    warning: colors.amber.base
  }
})
