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
  async forgotPassword(email) {
    const user = await this.app.models.User.findOne({ where: { email } })
    if (!user) {
      throw new Error('User not found')
    }
    const resetLink = uuid.v4()
    await this.app.models.PasswordReset.create({
      user_id: user.id,
      request_time: new Date(),
      reset_link: resetLink
    })
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.get('email'),
        pass: config.get('password')
      }
    })
    const mailOptions = {
      from: config.get('email'),
      to: email,
      subject: 'Password Reset',
      text: `You requested for a password reset, kindly use this ${resetLink} to reset your password`
    }
    await transporter.sendMail(mailOptions)
    return 'Password reset email has been sent.'
  }
  async resetPassword(reset_link, new_password) {
    const passwordReset = await this.app.models.PasswordReset.findOne({ where: { reset_link } })
    if (!passwordReset) {
      throw new Error('Invalid reset link')
    }
    const user = await this.app.models.User.findOne({ where: { id: passwordReset.user_id } })
    if (!user) {
      throw new Error('User not found')
    }
    // Validate the new password
    if (new_password.length < 8) {
      throw new Error('Password must be at least 8 characters long')
    }
    // Hash the new password
    const hashedPassword = bcrypt.hashSync(new_password, 8)
    // Update the user's password
    user.password = hashedPassword
    await user.save()
    // Delete the password reset record
    await passwordReset.destroy()
    return 'Password has been successfully reset'
  }
}
module.exports = (app) => new UserService(app)
