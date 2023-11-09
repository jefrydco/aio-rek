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
  // Other functions...
  async login(username, password) {
    if (!username) {
      throw new Error('The username is required.')
    }
    if (!password) {
      throw new Error('The password is required.')
    }
    const user = await User.findOne({ where: { username } })
    if (!user) {
      throw new Error('Invalid username or password.')
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid username or password.')
    }
    return {
      status: 200,
      message: "User authenticated successfully."
    }
  }
  // Other functions...
}
module.exports = (app) => new UserService(app)
