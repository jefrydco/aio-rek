'use strict'
import { HTTPError } from 'ky-universal'
import { types as userTypes } from '~/store/user'

export default (
  { app: { $http, $notify }, store: { commit }, redirect },
  inject
) => {
  const handleError = error => {
    if (error instanceof HTTPError) {
      const {
        response: { status }
      } = error
      if (status === 422 || status === 401) {
        $http.setToken(false)
        commit(`user/${userTypes.SET_USER}`, null)
        $notify({
          isError: true,
          message: 'Please check your email address and password then try again'
        })
        return redirect({ name: 'index' })
      }
      if (status === 429) {
        $notify({
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
