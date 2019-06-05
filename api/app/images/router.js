'use strict'

// const bodyParser = require('body-parser')
const router = require('express').Router()

const {
  createTransaction,
  jwtAuth,
  handleRole,
  handleImage
} = require('../middleware')
const { handleId, handleDescriptor } = require('./middleware')
const { create, destroy } = require('./controller')

router.post(
  '/images',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  handleImage('static/uploads/images/datasets').array('images'),
  handleDescriptor,
  create
)
router.delete(
  '/images/:id',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  handleId,
  destroy
)

module.exports = router
