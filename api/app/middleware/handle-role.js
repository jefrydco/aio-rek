'use strict'

const errorCatcher = require('async-error-catcher').default

const guard = require('express-jwt-permissions')({
  permissionsProperty: 'role'
})

module.exports = role => errorCatcher(guard.check(role))
