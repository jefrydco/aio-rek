<<<<<<< HEAD
const ExtractJwt = require('passport-jwt').ExtractJwt;
const errorCatcher = require('async-error-catcher').default;
const Controller = require('../base/Controller');
=======
const ExtractJwt = require('passport-jwt').ExtractJwt
const errorCatcher = require('async-error-catcher').default
const Controller = require('../base/Controller')
>>>>>>> test-github
class UserController extends Controller {
  constructor() {
    super(UserController.name);
  }
<<<<<<< HEAD
  // Existing code...
  resetPassword(req, res, next) {
    return errorCatcher(async (req, res) => {
      const { email } = req.body;
      const service = this._getService(res);
      const message = await service.resetPassword(email);
      return res.json({ message });
    })(req, res, next);
=======
  login(req, res, next) {
    return errorCatcher(async (req, res) => {
      const { username, password } = req.body
      const service = this._getService(res)
      const { token, user } = await service.authenticateUser(username, password)
      return res.json({ token, user })
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
>>>>>>> test-github
  }
  forgotPassword(req, res, next) {
    return errorCatcher(async (req, res) => {
      const { email } = req.body
      const service = this._getService(res)
      const result = await service.forgotPassword(email)
      if (result) {
        return res.json({ message: 'A password reset email has been sent.' })
      } else {
        return res.status(400).json({ message: 'Failed to send password reset email.' })
      }
    })(req, res, next)
  }
  resetPassword(req, res, next) {
    return errorCatcher(async (req, res) => {
      const { reset_link, new_password } = req.body
      const service = this._getService(res)
      const result = await service.resetPassword(reset_link, new_password)
      return res.json(result)
    })(req, res, next)
  }
}
<<<<<<< HEAD
module.exports = new UserController();
=======
module.exports = new UserController()
>>>>>>> test-github
