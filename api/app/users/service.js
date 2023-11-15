// PATH: /api/app/users/service.js
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
  //...
  // Existing code
  //...
  // Function to update user progress
  async updateUserProgress(id, progress) {
    // Validate user ID
    const user = await this.app.models.User.findOne({ where: { id } })
    if (!user) {
      throw new Error('User not found')
    }
    // Update progress
    user.progress = progress
    await user.save()
    // Fetch updated progress and progress meaning
    const progressDetails = await this.app.models.ProgressDetail.findOne({ where: { user_id: id } })
    if (!progressDetails) {
      throw new Error('Progress details not found')
    }
    // Combine progress and progress meaning into a single response
    return {
      progress: user.progress,
      progress_meaning: progressDetails.progress_meaning
    }
  }
}
module.exports = (app) => new UserService(app)
