'use strict'
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../../config')
const LoginAttempt = require('../login_attempts/model')
const Service = require('../base/Service')
class UserService extends Service {
  constructor(app) {
    super(UserService.name, app, ['hashed_password'])
  }
  generateJWT(user) {
    const role = user.get('role')
    return jwt.sign(
      {
        id: user.id,
        role: [role]
      },
      config.get('privateKey'),
      { algorithm: 'RS256', expiresIn: role === 'device' ? '10y' : '1h' }
    )
  }
  getAuthJSON(user, token) {
    return {
      ...this.toJSON(user, ['id']),
      token: token || this.generateJWT(user)
    }
  }
  async authenticateUser(username, password) {
    const user = await this.findOne({ username })
    if (!user) {
      throw new Error('User not found')
    }
    const match = await bcrypt.compare(password, user.hashed_password)
    if (!match) {
      throw new Error('Invalid password')
    }
    user.last_login = new Date()
    await user.save()
    const loginAttempt = new LoginAttempt({
      user_id: user.id,
      attempt_time: new Date(),
      successful: true
    })
    await loginAttempt.save()
    const token = this.generateJWT(user)
    return this.getAuthJSON(user, token)
  }
}
module.exports = (app) => new UserService(app)
