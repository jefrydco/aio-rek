'use strict'

const bodyParser = require('body-parser')
const router = require('express').Router()
const {
  createTransaction,
  jwtAuth,
  localAuth,
  handleRole
} = require('../middleware')
const { create, login, get, images, update } = require('./controller')

router.post(
  '/users',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  create
)
router.post(
  '/users/login',
  bodyParser.json(),
  createTransaction,
  localAuth,
  login
)
router.get('/user', jwtAuth.required, get)
router.get('/user/images', jwtAuth.required, images)
router.put(
  '/user',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  update
)

module.exports = router
