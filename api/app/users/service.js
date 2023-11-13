'use strict'
const jwt = require('jsonwebtoken')
const config = require('../../config')
const uuid = require('uuid')
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')
const LoginAttempt = require('../login_attempts/model')
const Service = require('../base/Service')
class UserService extends Service {
  constructor(app) {
    super(UserService.name, app, ['hashed_password'])
    this.failedAttempts = {}
  }
  async getUserByUsername(username) {
    const user = await this.findOne({ username })
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }
  async incrementFailedLoginAttempt(username) {
    if (!this.failedAttempts[username]) {
      this.failedAttempts[username] = 0
    }
    this.failedAttempts[username]++
    if (this.failedAttempts[username] >= 3) {
      const user = await this.getUserByUsername(username)
      await this.lockAccount(user)
      await this.sendLockNotification(user)
    }
  }
  async lockAccount(user) {
    user.account_locked = true
    await user.save()
    setTimeout(async () => {
      user.account_locked = false
      await user.save()
    }, 6 * 60 * 60 * 1000) // 6 hours
  }
  async sendLockNotification(user) {
    // Assuming we have user's email in user.email
    const transporter = nodemailer.createTransport(config.email)
    const mailOptions = {
      from: 'no-reply@yourdomain.com',
      to: user.email,
      subject: 'Account Locked',
      text: 'Your account has been locked due to multiple failed login attempts.'
    }
    await transporter.sendMail(mailOptions)
  }
}
module.exports = (app) => new UserService(app)
