// ~/plugins/vuex-persist.js
import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  window.onNuxtReady(() => {
    new VuexPersistence({
      /* your options */
      key: 'ayo-rek',
      modules: ['device']
    }).plugin(store)
  })
}
