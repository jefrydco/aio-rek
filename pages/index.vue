<template>
  <form action="" @submit.prevent="onLogin">
    <v-card>
      <v-toolbar card="" dark="" color="primary">
        <v-toolbar-title>Login</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-layout row="" wrap="">
          <v-flex xs12="">
            <v-text-field
              v-model="credential.email"
              v-validate="'required|email'"
              :error-messages="errors.collect('email')"
              :disabled="isLoading"
              label="Email"
              type="email"
              data-vv-name="email"
              data-vv-as="email"
              required=""
              clearable=""
              outline=""
              name="email"
              autofocus=""
              data-vv-value-path="credential.email"
            />
          </v-flex>
        </v-layout>
        <v-layout row="" wrap="">
          <v-flex xs12="">
            <v-text-field
              v-model="credential.password"
              v-validate="'required'"
              :error-messages="errors.collect('password')"
              :disabled="isLoading"
              label="Password"
              :type="isPassword ? 'password' : 'text'"
              :append-icon="isPassword ? 'lock_open' : 'lock'"
              data-vv-name="password"
              data-vv-as="password"
              required=""
              clearable=""
              outline=""
              name="password"
              data-vv-value-path="credential.password"
              @click:append="() => (isPassword = !isPassword)"
            />
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="accent"
          :loading="isLoading"
          :disabled="isLoading"
          type="submit"
          @click="onLogin"
        >
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
    <app-notification />
  </form>
</template>

<script>
import AppNotification from '~/components/AppNotification'
const Cookie = process.client ? require('js-cookie') : null

export default {
  layout: 'login',
  $_veeValidate: {
    validator: 'new'
  },
  components: {
    AppNotification
  },
  head() {
    return {
      title: 'Login'
    }
  },
  data() {
    return {
      isPassword: true,
      isLoading: false,
      credential: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async onLogin() {
      try {
        this.isLoading = true
        const valid = await this.$validator.validate()
        if (valid) {
          const {
            user: { token }
          } = await this.$http.$post('users/login', {
            user: {
              email: this.credential.email,
              password: this.credential.password
            }
          })
          await Cookie.set('t', token, { expires: 1 / 12 })
          await window.location.reload(true)
        }
      } catch (error) {
        this.$handleError(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
