<template>
  <v-app>
    <v-content>
      <v-toolbar app="" color="primary" dark="">
        <v-toolbar-side-icon
          class="hidden-sm-and-up"
          @click="isSidebar = !isSidebar"
        />
        <v-toolbar-title
          class="mr-3"
          style="cursor: pointer"
          @click="$router.push('/dashboard')"
        >
          <v-img src="/icon.png" width="30">
            <template #placeholder="">
              <v-layout
                fill-height=""
                align-center=""
                justify-center=""
                ma-0=""
              >
                <v-progress-circular indeterminate="" color="grey lighten-5" />
              </v-layout>
            </template>
          </v-img>
        </v-toolbar-title>
        <v-toolbar-items class="hidden-xs-only">
          <v-btn
            v-for="(menu, i) in menus"
            :key="`menu_toolbar_${i}`"
            flat=""
            nuxt=""
            exact=""
            :to="menu.to"
          >
            {{ menu.text }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-navigation-drawer v-model="isSidebar" app="">
        <v-list>
          <v-list-tile
            v-for="(menu, i) in menus"
            :key="`menu_sidebar_${i}`"
            nuxt=""
            exact=""
            ripple=""
            :to="menu.to"
          >
            <v-list-tile-content>
              <v-list-tile-title>
                {{ menu.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      isSidebar: false,
      menus: [
        { text: 'Beranda', to: { name: 'admin' } },
        { text: 'Mahasiswa', to: { name: 'admin-mahasiswa' } }
      ]
    }
  }
}
</script>
