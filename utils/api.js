'use strict'

const qs = require('qs')

module.exports = $http => resource => ({
  create(attributes, options) {
    return $http.$post(`${resource}`, attributes, options)
  },
  getAll(filter, options) {
    const queryString = qs.stringify(filter)
    return $http.$get(`${resource}?${queryString}`, options)
  },
  getOnce(id, options) {
    return $http.$get(`${resource}/${id}`, options)
  },
  update(id, attributes, options) {
    return $http.$put(`${resource}/${id}`, attributes, options)
  },
  destroy(id, options) {
    return $http.$delete(`${resource}/${id}`, options)
  }
})
