<template>
  <div id="nrp" class="nrp slider fill-height">
    <v-card color="primary" dark="" class="fill-height" flat="">
      <v-card-text class="fill-height text-xs-center">
        <v-img
          src="/icon.png"
          width="70"
          style="margin-top: 1rem; margin-left: auto; margin-right: auto"
        >
          <template #placeholder="">
            <v-layout fill-height="" align-center="" justify-center="" ma-0="">
              <v-progress-circular indeterminate="" color="grey lighten-5" />
            </v-layout>
          </template>
        </v-img>
        <header class="pa-3 mb-5">
          <h1 class="title mb-3">Aktivasi Akun</h1>
          <h2 class="subheading">
            Sekarang, masukkan PIN kamu
          </h2>
        </header>
        <main class="pa-3">
          <v-text-field
            label="NRP"
            solo=""
            flat=""
            autofocus=""
            hint="PIN terdiri dari 6 digit angka"
            mask="#-#-#-#-#-#"
          />
        </main>
      </v-card-text>
    </v-card>
    <div class="slider__action text-xs-center">
      <div>
        <v-btn v-for="i in 3" :key="i" :input-value="i === 3" dark="" icon="">
          <v-icon>mdi-record</v-icon>
        </v-btn>
      </div>
      <div>
        <v-btn
          outline=""
          large=""
          dark=""
          class="mt-3"
          nuxt=""
          exact=""
          to="/account"
        >
          Selesai
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: ""
    };
  },
  methods: {}
};
</script>

<style lang="scss">
.slider {
  position: relative;
  &__action {
    position: absolute;
    bottom: 3%;
    width: 100%;
  }
}
</style>
