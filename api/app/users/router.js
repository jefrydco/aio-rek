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
  updatePassword // import the updatePassword function
} = require('./controller')
const { resetPasswordRules, updatePasswordRules } = require('./validation'); // import the updatePasswordRules function
router.post(
  '/users/login',
  bodyParser.json(),
  createTransaction,
  localAuth,
  login
)
router.post(
  '/users',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  create
)
router.get(
  '/users',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  fetchPage
)
router.get(
  '/users/:id',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  fetch
)
router.put(
  '/users/:id',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  update
)
router.delete(
  '/users/:id',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  destroy
)
router.get(
  '/user/auth',
  createTransaction,
  jwtAuth.required,
  handleRole([['admin'], ['device']]),
  fetchAuth
)
router.get(
  '/user/profile',
  createTransaction,
  jwtAuth.required,
  handleRole([['admin'], ['device']]),
  fetchProfile
)
router.post(
  '/users/forgot-password',
  bodyParser.json(),
  createTransaction,
  forgotPassword
)
router.post(
  '/users/reset-password',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleRole('user'),
  resetPasswordRules,
  resetPassword
)
router.post(
  '/users/update-password',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleRole('user'),
  updatePasswordRules,
  updatePassword
);
module.exports = router
