<template>
  <form action="" @submit.prevent="onLogin">
    <v-card>
      <v-toolbar card="" dark="" color="primary">
        <v-toolbar-title>Login</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
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
          box=""
          data-vv-value-path="credential.email"
        />
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
          box=""
          data-vv-value-path="credential.password"
          @click:append="() => (isPassword = !isPassword)"
        />
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
    <v-snackbar v-model="isNotify" color="error" auto-height="" right="">
      {{ message }}
      <v-btn flat="" @click="isNotify = false">
        Close
      </v-btn>
    </v-snackbar>
  </form>
</template>

<script>
import { mapState } from 'vuex'
import { types as errorTypes } from '~/store/error'
const Cookie = process.client ? require('js-cookie') : null

export default {
  layout: 'login',
  head() {
    return {
      title: 'Login'
    }
  },
  $_veeValidate: {
    validator: 'new'
  },
  data() {
    return {
      isPassword: true,
      isLoading: false,
      isNotify: false,
      credential: {
        email: '',
        password: ''
      }
    }
  },
  computed: {
    ...mapState('error', ['isError', 'message'])
  },
  watch: {
    isError: {
      handler(value) {
        if (value) {
          this.isNotify = value
        }
      },
      immediate: true
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
          await Cookie.set('token', token, { expires: 1 / 12 })
          await window.location.reload(true)
        }
      } catch ({ response }) {
        if (response.status === 422) {
          this.isNotify = true
          this.$store.commit(`error/${errorTypes.SET_ERROR}`, {
            message:
              'Please check your email address and password and try again'
          })
        }
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
