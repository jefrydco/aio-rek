// PATH: /api/app/users/router.js
const bodyParser = require('body-parser')
const router = require('express').Router()
const {
  createTransaction,
  jwtAuth,
  localAuth,
  handleRole
} = require('../middleware')
const {
  login,
  fetchAuth,
  fetchProfile,
  create,
  fetchPage,
  fetch,
  update,
  destroy,
  forgotPassword,
  resetPassword,
  getKYCDocuments
} = require('./controller')
const { resetPasswordRules } = require('./validation');
// Existing routes...
router.get(
  '/users/:id/kyc-documents',
  createTransaction,
  jwtAuth.required,
  getKYCDocuments
)
module.exports = router
