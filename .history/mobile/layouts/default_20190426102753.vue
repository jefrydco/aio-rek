<template>
  <div id="app" :style="style">
    <v-app>
      <nuxt />
    </v-app>
  </div>
</template>

<script>
import style from "~/mixins/style";

export default {
  mixins: [style],
  data() {
    return {};
  }
};
</script>

<style lang="stylus">
#app {
  margin: 0 auto;
}
</style>
