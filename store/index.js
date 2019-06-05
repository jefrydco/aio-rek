import { types as userTypes } from './user'
const cookieparser = process.server ? require('cookieparser') : null

export const types = {}

export const state = () => ({})

export const getters = {}

export const mutations = {}

export const actions = {
  async nuxtServerInit({ commit }, { $http, $notify, req }) {
    if (req.headers.cookie) {
      const { t: token } = cookieparser.parse(req.headers.cookie)
      if (token) {
        $http.setToken(token, 'Bearer')
        try {
          const [{ user }, { user: userProfile }] = await Promise.all([
            $http.$get('user/auth'),
            $http.$get('user/profile')
          ])

          commit(`user/${userTypes.SET_USER}`, { ...user, ...userProfile })
        } catch ({ response }) {
          if (response.status === 403) {
            $notify({
              isError: true,
              message: 'Please login to continue'
            })
          }
        }
      }
    }
  }
}
