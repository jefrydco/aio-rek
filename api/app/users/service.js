'use strict'

const jwt = require('jsonwebtoken')
const config = require('../../config')

const Service = require('../base/Service')

class UserService extends Service {
  constructor(app) {
    super(UserService.name, app, ['hashed_password'])
  }
  generateJWT(user) {
    return jwt.sign(
      {
        id: user.id,
        role: [user.get('role')]
      },
      config.get('privateKey'),
      { algorithm: 'RS256', expiresIn: '1h' }
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
