'use strict'

const ExtractJwt = require('passport-jwt').ExtractJwt
const errorCatcher = require('async-error-catcher').default
const Controller = require('../base/Controller')

class UserController extends Controller {
  constructor() {
    super(UserController.name)
  }
  login(req, res, next) {
    return errorCatcher((req, res) => {
      const { user } = req
      const service = this._getService(res)
      return res.json({ [this.name]: service.getAuthJSON(user) })
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
}

module.exports = new UserController()
