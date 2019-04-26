<template>
  <div id="account" class="account slider fill-height">
    <v-toolbar
      color="primary"
      dark=""
      :extended="!isListExpand"
      :extension-height="!isListExpand ? 200 : null"
    >
      <template v-if="!isListExpand" #extension="">
        <v-layout justify-center="">
          <app-profile />
        </v-layout>
      </template>

      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-logout-variant</v-icon>
      </v-btn>
    </v-toolbar>
    <v-toolbar
      app=""
      fixed=""
      :style="{ ...style, ...toolbarStyle }"
      color="primary"
      dark=""
      scroll-off-screen=""
      inverted-scroll=""
    >
      <v-toolbar-title>
        <v-avatar size="32" color="blue">
          <span class="white--text">J</span>
        </v-avatar>
        <span class="ml-2">Jefry Dewangga</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-logout-variant</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid="" grid-list-lg="">
        <v-layout wrap="">
          <v-flex
            v-for="(subject, i) in subjects"
            :key="`subject_${subject.id}_${i}`"
            xs12=""
          >
            <v-card
              nuxt=""
              exact=""
              :to="{
                name: 'account-subjectId',
                params: { subjectId: subject.id }
              }"
            >
              <v-card-text>
                <div class="d-flex justify-space-between">
                  <div>
                    {{ subject.name }}
                  </div>
                  <div class="text-xs-right">{{ subject.percentage }}%</div>
                </div>
                <div
                  class="item__background"
                  :style="
                    `background-color: ${getColor(
                      subject.percentage
                    )}; width: ${subject.percentage}%`
                  "
                ></div>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import AppProfile from "~/components/AppProfile";
import style from "~/mixins/style";
import colors from "~/mixins/colors";

export default {
  components: {
    AppProfile
  },
  mixins: [style, colors],
  data() {
    return {
      isListExpand: false,
      subjects: [
        { id: 1, name: "Konsep Pemrograman", percentage: 25 },
        { id: 2, name: "Pemrograman Lanjut", percentage: 50 },
        { id: 3, name: "Kecerdasan Buatan", percentage: 75 },
        { id: 4, name: "Rekayasa Perangkat Lunak", percentage: 100 },
        { id: 5, name: "Metode Numerik", percentage: 75 },
        { id: 6, name: "Statistika", percentage: 50 },
        { id: 7, name: "Pemrograman Web", percentage: 25 },
        { id: 8, name: "Pemrograman Android", percentage: 50 },
        { id: 9, name: "Konsep Pemrograman", percentage: 25 },
        { id: 10, name: "Pemrograman Lanjut", percentage: 50 },
        { id: 11, name: "Kecerdasan Buatan", percentage: 75 },
        { id: 12, name: "Rekayasa Perangkat Lunak", percentage: 100 },
        { id: 13, name: "Metode Numerik", percentage: 75 },
        { id: 14, name: "Statistika", percentage: 50 },
        { id: 15, name: "Pemrograman Web", percentage: 25 },
        { id: 16, name: "Pemrograman Android", percentage: 50 }
      ]
    };
  },
  methods: {
    onClick() {}
  }
};
</script>

<style lang="stylus">
.slider {
  position: relative;
  &__action {
    position: absolute;
    bottom: 3%;
    width: 100%;
  }
}
.item {
  &__background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
