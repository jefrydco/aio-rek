<template>
  <div id="slider" class="slider fill-height">
    <v-window v-model="current" class="fill-height">
      <v-window-item
        v-for="(slide, i) in slides"
        :key="`item_${slide.id}_${i}`"
        class="fill-height"
      >
        <v-card :color="slide.color" dark="" class="fill-height" flat="">
          <v-card-text class="fill-height text-xs-center">
            <v-img
              :src="slide.icon"
              aspect-ratio="1"
              width="130"
              style="margin-top: 10rem; margin-left: auto; margin-right: auto"
            >
              <template #placeholder="">
                <v-layout
                  fill-height=""
                  align-center=""
                  justify-center=""
                  ma-0=""
                >
                  <v-progress-circular
                    indeterminate=""
                    color="grey lighten-5"
                  />
                </v-layout>
              </template>
            </v-img>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>

    <div class="slider__action text-xs-center">
      <header class="pa-3 mb-5">
        <h1 class="title mb-3 white--text">{{ slides[current].title }}</h1>
        <h2 class="subheading white--text">
          {{ slides[current].subTitle }}
        </h2>
      </header>
      <v-layout justify-center="">
        <v-item-group v-model="current" mandatory="">
          <v-item
            v-for="(slide, i) in slides"
            :key="`indicator_${slide.id}_${i}`"
          >
            <template #default="{ active, toggle }">
              <v-btn :input-value="active" dark="" icon="" @click="toggle">
                <v-icon>mdi-record</v-icon>
              </v-btn>
            </template>
          </v-item>
        </v-item-group>
      </v-layout>
      <v-btn
        outline=""
        large=""
        class="mt-3 white--text"
        nuxt=""
        exact=""
        to="/register"
      >
        Aktivasi Akun
      </v-btn>
      <div class="account-available mt-3">
        <nuxt-link
          to="/"
          class="white--text"
          style="text-transform: uppercase; text-decoration: none"
        >
          Saya Telah Memiliki Akun
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      current: 0,
      interval: null,
      slides: [
        {
          id: "kehadiran",
          title: "Anti Titip Kehadiran",
          subTitle:
            "Sekarang kamu tidak akan bisa lagi melakukan titip kehandiran",
          icon: "/img/icons/cards.png",
          color: "primary"
        },
        {
          id: "verifikas",
          title: "Verifikasi Dengan Sidik Jari",
          subTitle: "Memastikan hanya kamu yang dapat menggunakan aplikasi ini",
          icon: "/img/icons/fingerprint-success-white.png",
          color: "info"
        },
        {
          id: "rekap",
          title: "Lihat Rekap Kehandiran",
          subTitle: "Tidak perlu lagi bingung melihat rekap kehandiran",
          icon: "/img/icons/book.png",
          color: "success"
        }
      ]
    };
  },
  mounted() {
    this.interval = setInterval(() => {
      if (this.current + 1 < 3) {
        this.current++;
      } else {
        this.current = 0;
      }
    }, 3000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>

<style lang="scss">
.v-window__container {
  height: 100%;
}
.slider {
  position: relative;
  &__action {
    position: absolute;
    bottom: 3%;
    width: 100%;
  }
}
</style>
