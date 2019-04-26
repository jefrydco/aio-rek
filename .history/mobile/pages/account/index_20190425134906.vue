<template>
  
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

<style lang="scss">
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
