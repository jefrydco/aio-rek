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
  '/attendances',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleRole([['admin'], ['device']]),
  handleImage('static/uploads/images/attendances').single('image'),
  create
)
router.get(
  '/attendances',
  createTransaction,
  jwtAuth.required,
  handleRole([['admin'], ['device']]),
  fetchPage
)
router.get(
  '/attendances/:id',
  createTransaction,
  jwtAuth.required,
  handleRole([['admin'], ['device']]),
  fetch
)
router.put(
  '/attendances/:id',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleRole([['admin'], ['device']]),
  handleImage('static/uploads/images/attendances').single('image'),
  update
)
router.delete(
  '/attendances/:id',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  destroy
)

module.exports = router
