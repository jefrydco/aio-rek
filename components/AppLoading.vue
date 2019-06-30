<template>
  <v-dialog :value="value" width="350" persistent="" scrollable="" lazy="">
    <v-card>
      <v-card-text>
        <div class="body-2">
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
