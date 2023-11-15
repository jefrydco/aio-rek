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
  getUserProgress, // import the getUserProgress function
  updateProgress // import the updateProgress function
} = require('./controller')
const { resetPasswordRules } = require('./validation');
// Existing routes...
// Add new route for getting user progress details
router.get(
  '/users/:id/progress',
  createTransaction,
  jwtAuth.required,
  handleRole('user'),
  getUserProgress
)
// Add new route for updating user progress details
router.put(
  '/users/:id/progress',
  createTransaction,
  jwtAuth.required,
  handleRole('user'),
  updateProgress
)
module.exports = router
