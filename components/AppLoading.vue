<template>
  <v-dialog :value="value" width="300" persistent="">
    <v-card>
      <v-card-text>
        <v-layout>
          <v-progress-circular indeterminate="" color="accent" class="mr-3" />
          <div class="body-2">
            <slot />
          </div>
        </v-layout>
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
