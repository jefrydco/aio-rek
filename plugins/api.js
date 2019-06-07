'use strict'

// const apiFactory = require('../utils/api')
import apiFactory from '~/utils/api'

export default ({ $http }, inject) => {
  const createApi = apiFactory($http)

  const apiList = {
    users: createApi('users'),
    images: createApi('images'),
    descriptors: createApi('descriptors')
  }

  inject('api', apiList)
}
