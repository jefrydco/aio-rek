<template>
  <form action="" @submit.prevent="onLogin">
    <v-card>
      <v-app-bar flat="" dark="" color="primary">
        <v-toolbar-title>Login</v-toolbar-title>
      </v-app-bar>
      <v-card-text>
        <v-row class="flex-wrap">
          <v-col cols="12">
            <validation-observer>
              <validation-provider
                #default="{ errors }"
                name="Email"
                rules="required|email"
              >
                <v-text-field
                  v-model="credential.email"
                  :error-messages="errors"
                  :disabled="isLoading"
                  label="Email"
                  type="email"
                  required=""
                  clearable=""
                  outlined=""
                  name="email"
                  autofocus=""
                />
              </validation-provider>
            </validation-observer>
          </v-col>
        </v-row>
        <v-row class="flex-wrap">
          <v-col cols="12">
            <validation-observer>
              <validation-provider
                #default="{ errors }"
                name="Password"
                rules="required"
              >
                <v-text-field
                  v-model="credential.password"
                  :error-messages="errors"
                  :disabled="isLoading"
                  label="Password"
                  :type="isPassword ? 'password' : 'text'"
                  :append-icon="isPassword ? 'lock_open' : 'lock'"
                  required=""
                  clearable=""
                  outlined=""
                  name="password"
                  @click:append="() => (isPassword = !isPassword)"
                />
              </validation-provider>
            </validation-observer>
          </v-col>
        </v-row>
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
import { validate } from 'vee-validate'
import AppNotification from '~/components/AppNotification'
const Cookie = process.client ? require('js-cookie') : null

export default {
  layout: 'login',
  components: {
    AppNotification
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
        const valids = await Promise.all([
          validate(this.credential.email, 'required|email'),
          validate(this.credential.password, 'required')
        ])
        if (valids.every(({ valid }) => valid)) {
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
  },
  head() {
    return {
      title: 'Login'
    }
  }
}
</script>
