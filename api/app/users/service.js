// PATH: /api/app/users/service.js
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
  // Function to get user progress
  async getUserProgress(id) {
    const user = await this.app.models.User.findOne({ where: { id } })
    if (!user) {
      throw new Error('User not found')
    }
    const progressValue = user.progress;
    const progressDetail = await this.app.models.ProgressDetail.findOne({ where: { user_id: id } })
    if (!progressDetail) {
      throw new Error('Progress detail not found')
    }
    const progressMeaning = progressDetail.progress_meaning;
    return { progressValue, progressMeaning };
  }
  // Function to update user progress
  async updateUserProgress(id, progress) {
    // Validate input parameters
    if (typeof id !== 'number') {
      throw new Error('Wrong format.')
    }
    if (typeof progress !== 'number') {
      throw new Error('Wrong format.')
    }
    // Validate user ID
    const user = await this.app.models.User.findOne({ where: { id } })
    if (!user) {
      throw new Error('This user is not found.')
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
      status: 200,
      user: {
        id: user.id,
        name: user.name,
        progress: user.progress
      }
    }
  }
  // Rest of the code
  //...
}
module.exports = (app) => new UserService(app)
