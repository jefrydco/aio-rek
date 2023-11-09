const ExtractJwt = require('passport-jwt').ExtractJwt
const errorCatcher = require('async-error-catcher').default
const Controller = require('../base/Controller')
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
}
module.exports = new UserController()
