import Vue from 'vue'
import LongPress from 'vue-directive-long-press'
import { VueMaskDirective } from 'v-mask'

Vue.directive('long-press', LongPress)
Vue.directive('mask', VueMaskDirective)
