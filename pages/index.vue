<template>
  <v-card>
    <v-toolbar card="" dark="" color="primary">
      <v-toolbar-title>Login</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-text-field
        v-model="credential.email"
        v-validate="'required|email'"
        :error-messages="errors.collect('email')"
        label="Email"
        type="email"
        data-vv-name="email"
        data-vv-as="email"
        required=""
        clearable=""
        box=""
        data-vv-value-path="credential.email"
      />
      <v-text-field
        v-model="credential.password"
        v-validate="'required'"
        :error-messages="errors.collect('password')"
        label="Password"
        :type="isPassword ? 'text' : 'password'"
        :append-icon="isPassword ? 'mdi-eye-off' : 'mdi-eye'"
        data-vv-name="password"
        data-vv-as="password"
        required=""
        clearable=""
        box=""
        data-vv-value-path="credential.password"
        @click:append="() => (isPassword = !isPassword)"
      />
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn color="accent" @click="onLogin">Login</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  layout: 'login',
  $_veeValidate: {
    validator: 'new'
  },
  head() {
    return {
      title: 'Login'
    }
  },
  data() {
    return {
      isPassword: false,
      credential: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    onLogin() {
      this.$router.push({ name: 'admin' })
    }
  }
}
</script>
