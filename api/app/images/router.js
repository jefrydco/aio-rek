'use strict'

const bodyParser = require('body-parser')
const router = require('express').Router()

const { createTransaction, jwtAuth } = require('../middleware')
const { create } = require('./controller')

router.post(
  '/images',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  create
)

module.exports = router
