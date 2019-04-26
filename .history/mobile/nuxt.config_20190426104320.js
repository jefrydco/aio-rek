import nodeExternals from "webpack-node-externals";
import VuetifyLoaderPlugin from "vuetify-loader/lib/plugin";
import { isDev } from "./helpers";
require("dotenv").config();

export default {
  // https://nuxtjs.org/api/configuration-modern
  // modern: !isDev,

  // https://nuxtjs.org/api/configuration-head
  head: {
    titleTemplate(title) {
      if (title) {
        return `${title} - Ayo Rek`;
      }
      return "Ayo Rek";
    }
  },

  // https://nuxtjs.org/api/configuration-modules
  modules: [
    // https://axios.nuxtjs.org/
    "@nuxtjs/axios",

    // https://nuxtjs.org/faq/cached-components/
    "@nuxtjs/component-cache",

    // https://github.com/nuxt-community/dotenv-module
    "@nuxtjs/dotenv",

    // https://pwa.nuxtjs.org/
    "@nuxtjs/pwa",

    // https://github.com/nuxt-community/moment-module
    ["@nuxtjs/moment", ["id"]],

    // https://github.com/Developmint/nuxt-webfontloader
    "nuxt-webfontloader"
  ],

  webfontloader: {
    google: {
      families: ["Roboto:100,300,400,500,700,900", "Material+Icons"]
    }
  },

  // https://nuxtjs.org/api/configuration-plugins
  plugins: ["~/plugins/vuetify", "~/plugins/vee-validate"],

  // https://nuxtjs.org/api/configuration-css
  css: ["@mdi/font/css/materialdesignicons.css", "~/assets/styles/vuetify"],

  watch: ["~/helpers/**/*", "~/mixins/**/*"],

  // https://nuxtjs.org/api/configuration-build
  build: {
    extractCSS: !isDev,
    parallel: isDev,
    cache: isDev,
    // hardSource: isDev,
    transpile: [/^vuetify/],
    plugins: [new VuetifyLoaderPlugin()],
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /node_modules/,
          options: {
            fix: true
          }
        });
      }
      if (process.server) {
        config.externals = [
          nodeExternals({
            whitelist: [/^vuetify/]
          })
        ];
      }
    }
  }
};
