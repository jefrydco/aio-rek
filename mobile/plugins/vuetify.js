import LRUCache from "lru-cache";
import Vue from "vue";
import Vuetify, { VCard } from "vuetify/lib";
import { Ripple } from "vuetify/lib/directives";

Vue.use(Vuetify, {
  options: {
    minifyTheme: css =>
      process.env.NODE_ENV === "production"
        ? css.replace(/[\s|\r\n|\r|\n]/g, "")
        : css,
    themeCache: new LRUCache({
      max: 10,
      maxAge: 1000 * 60 * 60 // 1 hour
    }),
    cspNonce: "dQw4w9WgXcQ"
  },
  directives: {
    Ripple
  },
  components: {
    VCard
  },
  theme: {
    primary: "#00BCD4",
    secondary: "#0097A7",
    accent: "#FF5722",
    error: "#F44336",
    warning: "#FFC107",
    info: "#2196F3",
    success: "#4CAF50"
  }
});
