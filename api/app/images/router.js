'use strict'

const bodyParser = require('body-parser')
const router = require('express').Router()

const { createTransaction, jwtAuth } = require('../middleware')
const { handleId } = require('./middleware')
const { create, del } = require('./controller')

router.post(
  '/images',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  create
)
router.delete('/images/:id', createTransaction, jwtAuth.required, handleId, del)

module.exports = router
