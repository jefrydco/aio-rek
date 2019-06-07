'use strict'

const bodyParser = require('body-parser')
const router = require('express').Router()

const { createTransaction, jwtAuth, handleRole } = require('../middleware')
const { handleId } = require('./middleware')
const { create, destroy } = require('./controller')

router.post(
  '/descriptors',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  create
)

router.delete(
  '/descriptors/:id',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  handleId,
  destroy
)

module.exports = router
