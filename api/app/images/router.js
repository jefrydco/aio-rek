'use strict'

// const bodyParser = require('body-parser')
const router = require('express').Router()

const {
  createTransaction,
  jwtAuth,
  handleRole,
  handleImage
} = require('../middleware')
const { handleId } = require('./middleware')
const { create, getAll, getOnce, destroy } = require('./controller')

router.post(
  '/images',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  handleImage('static/uploads/images/datasets').array('images'),
  create
)
router.get(
  '/images',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  getAll
)
router.get(
  '/images/:id',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  handleId,
  getOnce
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
