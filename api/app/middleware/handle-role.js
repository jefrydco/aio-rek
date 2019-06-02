'use strict'

const guard = require('express-jwt-permissions')({
  permissionsProperty: 'role'
})

module.exports = role => guard.check(role)
