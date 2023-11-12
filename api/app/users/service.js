// PATH: /api/app/users/service.js
'use strict'
const jwt = require('jsonwebtoken')
const config = require('../../config')
const uuid = require('uuid')
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')
const LoginAttempt = require('../login_attempts/model')
const Service = require('../base/Service')
const KycDocument = require('../kyc_documents/model') // Import the KycDocument model
class UserService extends Service {
  constructor(app) {
    super(UserService.name, app, ['hashed_password'])
  }
  // ... existing methods ...
  async checkKYCStatus(id) {
    const user = await this.app.models.User.findOne({ where: { id } })
    if (!user) {
      throw new Error('User not found')
    }
    return user.kyc_status
  }
  async retrieveKYCDocuments(user_id) {
    // Validate user_id
    if (!user_id) {
      throw new Error('User ID is required')
    }
    // Fetch the KYC documents related to the provided user_id from the 'kyc_documents' table
    const kycDocuments = await KycDocument.findAll({ where: { user_id } })
    // Return the retrieved documents
    return kycDocuments
  }
}
module.exports = (app) => new UserService(app)
