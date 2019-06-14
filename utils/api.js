const qs = require('qs')

export default $http => resource => ({
  create(attributes, filter, options) {
    const queryString = qs.stringify(filter)
    return $http.$post(`${resource}?${queryString}`, attributes, options)
  },
  fetchPage(filter, options) {
    const queryString = qs.stringify(filter)
    return $http.$get(`${resource}?${queryString}`, options)
  },
  fetch(id, filter, options) {
    const queryString = qs.stringify(filter)
    return $http.$get(`${resource}/${id}?${queryString}`, options)
  },
  update(id, attributes, filter, options) {
    const queryString = qs.stringify(filter)
    return $http.$put(`${resource}/${id}?${queryString}`, attributes, options)
  },
  destroy(id, options) {
    return $http.delete(`${resource}/${id}`, options)
  }
})
