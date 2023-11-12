'use strict'
const jwt = require('jsonwebtoken')
const config = require('../../config')
const uuid = require('uuid')
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')
const LoginAttempt = require('../login_attempts/model')
const Service = require('../base/Service')
const PasswordReset = require('../password_reset/model') // Assuming this model exists
class UserService extends Service {
  constructor(app) {
    super(UserService.name, app, ['hashed_password'])
  }
  //...
  // Existing code
  //...
  // Function to check if email exists in the users table
  async checkEmailExists(email) {
    const user = await this.app.models.User.findOne({ where: { email } })
    if (user) {
      return true
    }
    return false
  }
  // Function to reset password
  async resetPassword(email) {
    const user = await this.app.models.User.findOne({ where: { email } })
    if (!user) {
      return { message: 'Email does not exist' }
    }
    const resetLink = uuid.v4()
    const expiryDate = new Date()
    expiryDate.setHours(expiryDate.getHours() + 1) // Link expires in 1 hour
    await this.app.models.PasswordReset.create({
      userId: user.id,
      resetLink,
      expiryDate
    })
    // Assuming a mailer service exists
    await this.app.services.MailerService.sendMail({
      to: email,
      subject: 'Password Reset',
      text: `Please use the following link to reset your password: ${resetLink}`
    })
    return { message: 'Reset link sent successfully' }
  }
}
module.exports = (app) => new UserService(app)
