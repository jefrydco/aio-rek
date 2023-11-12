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
  checkKYCStatus
} = require('./controller')
const { resetPasswordRules } = require('./validation');
// Existing routes...
router.get(
  '/api/users/:id/kyc',
  createTransaction,
  jwtAuth.required,
  handleRole('user'),
  checkKYCStatus
);
module.exports = router
