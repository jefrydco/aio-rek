'use strict'

const jwt = require('jsonwebtoken')
const config = require('../../config')

const Service = require('../base/Service')

class UserService extends Service {
  constructor(app) {
    super(UserService.name, app, ['hashed_password'])
  }
  generateJWT(user) {
    const role = user.get('role')
    let expiresIn = '1h'
    if (role === 'device') {
      expiresIn = '10y'
    }
    return jwt.sign(
      {
        id: user.id,
        role: [role]
      },
      config.get('privateKey'),
      { algorithm: 'RS256', expiresIn }
    )
  }
  getAuthJSON(user, token) {
    return {
      ...this.toJSON(user, ['id']),
      token: token || this.generateJWT(user)
    }
  }
}

module.exports = app => new UserService(app)
