'use strict'

const bodyParser = require('body-parser')
const router = require('express').Router()
const {
  createTransaction,
  jwtAuth,
  handleRole,
  handleImage
} = require('../middleware')
const { create, fetchPage, fetch, update, destroy } = require('./controller')

router.post(
  '/students',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  handleImage('static/uploads/images/profiles').single('image'),
  create
)
router.get(
  '/students',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  fetchPage
)
router.get(
  '/students/:id',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  fetch
)
router.put(
  '/students/:id',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  handleImage('static/uploads/images/profiles').single('image'),
  update
)
router.delete(
  '/students/:id',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  destroy
)

module.exports = router
