<template>
  <v-snackbar
    :value="message !== null"
    :color="kind"
    auto-height=""
    right=""
    @input="$notify"
  >
    {{ message }}
    <v-btn flat="" @click="$notify">
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('notification', ['isError', 'kind', 'message'])
  }
}
</script>
