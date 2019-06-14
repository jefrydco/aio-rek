<template>
  <v-app>
    <v-toolbar app="" color="primary" dark="">
      <v-toolbar-side-icon
        class="hidden-sm-and-up"
        @click="isSidebar = !isSidebar"
      />
      <v-toolbar-title>
        <v-img src="/icon.png" width="30" alt="Ayo Rek Admin">
          <template #placeholder="">
            <v-layout fill-height="" align-center="" justify-center="" ma-0="">
              <v-progress-circular indeterminate="" color="grey lighten-5" />
            </v-layout>
          </template>
        </v-img>
      </v-toolbar-title>
      <v-toolbar-items class="hidden-xs-only ml-4">
        <v-btn
          v-for="(menu, i) in menus"
          :key="`menu_sidebar_${i}`"
          flat=""
          nuxt=""
          exact=""
          :to="menu.to"
        >
          {{ menu.text }}
        </v-btn>
      </v-toolbar-items>
      <v-spacer />
      <v-toolbar-items>
        <v-menu offset-y="">
          <template #activator="{ on }">
            <v-btn flat="" v-on="on">
              <app-avatar
                :name="user.email"
                :image="user.image"
                size="36"
                class="mr-3"
              />
              <span>{{ user.email }}</span>
              <v-icon right="">arrow_drop_down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-tile ripple="" @click="onLogout">
              <v-list-tile-content>
                <v-list-tile-title>Logout</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid="" grid-list-xl="">
        <v-layout>
          <v-flex xs12="">
            <nuxt />
            <app-notification />
            <app-loading :value="isModelsLoading">
              Loading face recognition models
            </app-loading>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import AppNotification from '~/components/AppNotification'
import AppAvatar from '~/components/AppAvatar'
import AppLoading from '~/components/AppLoading'

const Cookie = process.client ? require('js-cookie') : null

export default {
  middleware: 'non-auth',
  components: {
    AppNotification,
    AppAvatar,
    AppLoading
  },
  data() {
    return {
      isSidebar: false
    }
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapState('face', {
      isModelsLoading: 'isLoading'
    }),
    menus() {
      if (this.user.role === 'room') {
        return [{ text: 'Home', to: { name: 'room' } }]
      }
      return [
        { text: 'Home', to: { name: 'admin' } },
        { text: 'Students', to: { name: 'admin-students' } }
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions('face', ['getModels']),
    init() {
      this.initToken()
      this.getModels()
    },
    initToken() {
      const token = Cookie.get('t')
      if (token) {
        this.$http.setToken(token, 'Bearer')
      }
    },
    onLogout() {
      Cookie.remove('t')
      this.$http.setToken(false)
      window.location.reload(true)
    }
  }
}
</script>
