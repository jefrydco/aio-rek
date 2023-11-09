'use strict'
const ExtractJwt = require('passport-jwt').ExtractJwt
const errorCatcher = require('async-error-catcher').default
const Controller = require('../base/Controller')
const userService = require('./service')
const loginAttemptService = require('../login_attempts/service')
class UserController extends Controller {
  constructor() {
    super(UserController.name)
  }
  login(req, res, next) {
    return errorCatcher(async (req, res) => {
      const { username, password } = req.body
      const service = this._getService(res)
      const result = await service.authenticateUser(username, password)
      if (result.token) {
        // Log successful login attempt
        await service.logLoginAttempt(username, 'successful')
        return res.json({ token: result.token })
      } else {
        // Log failed login attempt
        await service.logLoginAttempt(username, 'failed')
        return res.status(400).json({ error: result.error })
      }
    })(req, res, next)
  }
  fetchAuth(req, res, next) {
    return errorCatcher((req, res) => {
      const { user } = req
      const service = this._getService(res)
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req)
      return res.json({ [this.name]: service.getAuthJSON(user, token) })
    })(req, res, next)
  }
  fetchProfile(req, res, next) {
    return errorCatcher((req, res) => {
      const { user } = req
      const service = this._getService(res)
      return res.json({ [this.name]: service.toJSON(user) })
    })(req, res, next)
  }
  updatePassword(req, res, next) {
    return errorCatcher(async (req, res) => {
      const { email, new_password: newPassword, password_confirmation: passwordConfirmation } = req.body
      const service = this._getService(res)
      try {
        await service.updatePassword(email, newPassword, passwordConfirmation)
        return res.status(200).json({ message: 'Password updated successfully' })
      } catch (error) {
        return res.status(400).json({ message: error.message })
      }
    })(req, res, next)
  }
  resetPassword(req, res, next) {
    return errorCatcher(async (req, res, next) => {
      const { email } = req.body
      const user = await userService.getUserByEmail(email)
      if (user) {
        const resetLink = await userService.generateResetLink(user)
        // Send the email with the reset link
        // This is a placeholder, replace with your actual email sending function
        await sendEmail(email, resetLink)
        await loginAttemptService.logResetRequest(user.id)
        return res.json({ message: 'Password reset link has been sent to your email.' })
      } else {
        return res.status(400).json({ error: 'User does not exist.' })
      }
    })(req, res, next)
  }
}
module.exports = new UserController()
