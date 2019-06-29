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
  '/presences',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleRole([['admin'], ['device']]),
  handleImage('static/uploads/images/presences').single('image'),
  create
)
router.get(
  '/presences',
  createTransaction,
  jwtAuth.required,
  handleRole([['admin'], ['device']]),
  fetchPage
)
router.get(
  '/presences/:id',
  createTransaction,
  jwtAuth.required,
  handleRole([['admin'], ['device']]),
  fetch
)
router.put(
  '/presences/:id',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleRole([['admin'], ['device']]),
  handleImage('static/uploads/images/presences').single('image'),
  update
)
router.delete(
  '/presences/:id',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  destroy
)

module.exports = router
