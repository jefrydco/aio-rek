'use strict'

// const apiFactory = require('../utils/api')
import apiFactory from '~/utils/api'

export default ({ $http }, inject) => {
  const api = apiFactory($http)

  const apiList = {
    users: api('users'),
    images: api('images')
  }

  inject('api', apiList)
}
