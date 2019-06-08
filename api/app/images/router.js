'use strict'

const bodyParser = require('body-parser')
const router = require('express').Router()

const {
  createTransaction,
  jwtAuth,
  handleRole,
  handleImage
} = require('../middleware')
const { handleId } = require('./middleware')
const { create, getAll, getOnce, update, destroy } = require('./controller')

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
  handleRole([['admin'], ['room']]),
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
router.put(
  '/images/:id',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  handleId,
  update
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
