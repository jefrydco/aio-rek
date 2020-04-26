<template>
  <v-dialog :value="value" width="350" persistent="" scrollable="">
    <v-card>
      <v-card-text class="pt-5">
        <div class="body-2 mb-3">
          <slot />
        </div>
        <v-progress-linear indeterminate="" height="5" color="accent" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  }
}
</script>
