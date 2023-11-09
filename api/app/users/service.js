'use strict'
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../../config')
const User = require('../models/User')
const LoginAttempt = require('../models/LoginAttempt')
const Service = require('../base/Service')
const knex = require('knex')(config.get('db'))
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
    const user = await User.findOne({ where: { username } })
    if (!user) {
      throw new Error('User not found')
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      await LoginAttempt.create({ user_id: user.id, timestamp: new Date(), status: 'failed' })
      throw new Error('Invalid password')
    }
    const token = this.generateJWT(user)
    await LoginAttempt.create({ user_id: user.id, timestamp: new Date(), status: 'successful' })
    return this.getAuthJSON(user, token)
  }
  async resetPassword(email) {
    const user = await this.getUserByEmail(email)
    if (!user) {
      throw new Error('User not found')
    }
    const resetLink = this.generateResetLink(email)
    await LoginAttempt.create({ user_id: user.id, timestamp: new Date(), status: 'password reset requested' })
    // TODO: Send email with resetLink
    return 'Password reset link has been sent to your email'
  }
  generateResetLink(email) {
    const resetToken = jwt.sign(
      { email },
      config.get('privateKey'),
      { expiresIn: '1h' }
    )
    return `${config.get('clientUrl')}/reset-password/${resetToken}`
  }
  async updatePassword(email, newPassword, passwordConfirmation) {
    const user = await knex('users').where({ email }).first()
    if (!user) {
      throw new Error('User not found')
    }
    if (newPassword !== passwordConfirmation) {
      throw new Error('Password and confirmation do not match')
    }
    await knex('users').where({ id: user.id }).update({ password: newPassword })
    await knex('login_attempts').insert({
      user_id: user.id,
      timestamp: new Date(),
      status: 'password updated'
    })
    return { message: 'Password updated successfully' }
  }
}
module.exports = (app) => new UserService(app)
