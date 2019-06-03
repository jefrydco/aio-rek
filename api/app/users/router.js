'use strict'

const bodyParser = require('body-parser')
const router = require('express').Router()
const {
  createTransaction,
  jwtAuth,
  localAuth,
  handleRole
} = require('../middleware')
const { handleId } = require('./middleware')
const {
  create,
  login,
  getAuth,
  getProfile,
  getAll,
  getImages,
  update,
  del
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
router.delete(
  '/users/:id',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  handleId,
  del
)
router.get(
  '/users',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  getAll
)
router.put(
  '/users',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleRole([['admin'], ['student']]),
  update
)

router.get(
  '/user/auth',
  createTransaction,
  jwtAuth.required,
  handleRole([['admin'], ['student']]),
  getAuth
)
router.get(
  '/user/profile',
  createTransaction,
  jwtAuth.required,
  handleRole([['admin'], ['student']]),
  getProfile
)
router.get(
  '/user/images',
  createTransaction,
  jwtAuth.required,
  handleRole([['admin'], ['student']]),
  getImages
)

module.exports = router
