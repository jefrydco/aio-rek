'use strict'

// const bodyParser = require('body-parser')
const router = require('express').Router()

const { createTransaction, jwtAuth, handleRole } = require('../middleware')
const { handleId, handleImage, handleDescriptor } = require('./middleware')
const { create, del } = require('./controller')

router.post(
  '/images',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  handleImage,
  handleDescriptor,
  create
)
router.delete(
  '/images/:id',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  handleId,
  del
)

module.exports = router
