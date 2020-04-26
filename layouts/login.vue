<template>
  <v-app>
    <v-content>
      <v-container fluid="" class="fill-height">
        <v-row class="fill-height" align="center" justify="center">
          <v-col cols="12" sm="8" md="6" lg="4">
            <nuxt />
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  middleware: 'auth'
}
</script>
