<template>
  <v-snackbar :value="message !== null" :color="kind" right="" @input="$notify">
    {{ message }}
    <v-btn text="" @click="$notify"> Close </v-btn>
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
