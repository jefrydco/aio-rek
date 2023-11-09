// PATH: /api/app/users/router.js
'use strict'
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
  resetPassword // import the resetPassword function from the controller
} = require('./controller')
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
// Add a new route for the password reset request
router.post(
  '/users/reset-password',
  bodyParser.json(),
  createTransaction,
  resetPassword
)
module.exports = router
