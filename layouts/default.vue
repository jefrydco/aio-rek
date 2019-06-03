<template>
  <v-app>
    <v-toolbar app="" color="primary" dark="">
      <v-toolbar-side-icon
        class="hidden-sm-and-up"
        @click="isSidebar = !isSidebar"
      />
      <v-toolbar-title>
        <v-img src="/icon.png" width="30">
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
    </v-toolbar>
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
export default {
  middleware: 'non-auth',
  data() {
    return {
      isSidebar: false,
      menus: [
        { text: 'Home', to: { name: 'admin' } },
        { text: 'Students', to: { name: 'admin-students' } }
      ]
    }
  }
}
</script>
