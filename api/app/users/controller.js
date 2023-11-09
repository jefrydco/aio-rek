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
      if (!username) {
        return res.status(400).json({ message: 'The username is required.' })
      }
      if (!password) {
        return res.status(400).json({ message: 'The password is required.' })
      }
      const service = this._getService(res)
      const result = await service.authenticateUser(username, password)
      if (result.token) {
        // Log successful login attempt
        await service.logLoginAttempt(username, 'successful')
        return res.status(200).json({ status: 200, message: 'User authenticated successfully.' })
      } else {
        // Log failed login attempt
        await service.logLoginAttempt(username, 'failed')
        return res.status(400).json({ error: result.error })
      }
    })(req, res, next)
  }
  // ... other methods ...
}
module.exports = new UserController()
