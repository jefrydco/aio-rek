<template>
  <v-app>
    <v-content>
      <v-container fluid="" grid-list-xl="" fill-height="">
        <v-layout fill-height="" align-center="" justify-center="">
          <v-flex xs12="" sm8="" md6="" lg4="">
            <nuxt />
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  middleware: 'auth'
}
</script>
