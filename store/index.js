import { types as userTypes } from './user'
const cookieparser = process.server ? require('cookieparser') : null

export const types = {}

export const state = () => ({})

export const getters = {}

export const mutations = {}

export const actions = {
  async nuxtServerInit(
    { commit },
    {
      $http,
      app: { $api, $handleError },
      req
    }
  ) {
    if (req.headers.cookie) {
      const { t: token } = cookieparser.parse(req.headers.cookie)
      if (token) {
        $http.setToken(token, 'Bearer')
        try {
          const { user } = await $http.$get('user/profile')

          let profile
          if (user.role !== 'admin') {
            if (user.role === 'student') {
              profile = await $api.students
                .fetchPage({ user_id: user.id })
                .then(({ students }) => students[0])
            }
            if (user.role === 'lecturer') {
              profile = await $api.lecturers
                .fetchPage({ user_id: user.id })
                .then(({ rooms }) => rooms[0])
            }
          }
          let payload = { ...user }
          if (profile) {
            payload = {
              ...user,
              profile
            }
          }

          commit(`user/${userTypes.SET_USER}`, payload)
        } catch (error) {
          $handleError(error)
        }
      }
    }
  }
}
