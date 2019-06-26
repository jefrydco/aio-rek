'use strict'
import { HTTPError } from 'ky-universal'
import { types as userTypes } from '~/store/user'
import { types as notificationTypes } from '~/store/notification'

export default ({ app: { $http }, store: { commit }, redirect }, inject) => {
  const handleError = async error => {
    if (error instanceof HTTPError) {
      console.log(await error.response.json())
      const {
        response: { status }
      } = error
      if (status === 422 || status === 401) {
        $http.setToken(false)
        commit(`user/${userTypes.SET_USER}`, null)
        commit(`notification/${notificationTypes.SET_NOTIFICATION}`, {
          isError: true,
          message: 'Please check your email address and password then try again'
        })
        return redirect({ name: 'index' })
      }
      if (status === 429) {
        commit(`notification/${notificationTypes.SET_NOTIFICATION}`, {
          isError: true,
          message: `You're making too many requests, please wait a moment`
        })
      }
    } else {
      console.log(error)
    }
  }
  inject('handleError', handleError)
}
