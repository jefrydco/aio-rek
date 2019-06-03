import { types as errorTypes } from './error'
import { types as userTypes } from './user'
const cookieparser = process.server ? require('cookieparser') : null

export const types = {}

export const state = () => ({})

export const getters = {}

export const mutations = {}

export const actions = {
  async nuxtServerInit({ commit }, { $http, req }) {
    if (req.headers.cookie) {
      const { t: token } = cookieparser.parse(req.headers.cookie)
      if (token) {
        $http.setToken(token, 'Bearer')
        try {
          const { user } = await $http.$get('user/auth')
          commit(`user/${userTypes.SET_USER}`, user)
        } catch ({ response }) {
          if (response.status === 403) {
            commit(`error/${errorTypes.SET_ERROR}`, {
              message: 'Please login to continue'
            })
          }
        }
      }
    }
  }
}
