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
  // ... existing methods ...
  async getKYCStatus(id) {
    if (typeof id !== 'number') {
      throw new Error('Wrong format')
    }
    const user = await this.app.models.User.findOne({ where: { id } })
    if (!user) {
      throw new Error('This user is not found')
    }
    return user.kyc_status
  }
}
module.exports = (app) => new UserService(app)
