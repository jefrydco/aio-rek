'use strict'

const bodyParser = require('body-parser')
const router = require('express').Router()
const { createTransaction, jwtAuth, handleRole } = require('../middleware')
const { create, fetchPage, fetch, update, destroy } = require('./controller')

router.post(
  '/departments',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  create
)
router.get(
  '/departments',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  fetchPage
)
router.get(
  '/departments/:id',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  fetch
)
router.put(
  '/departments/:id',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  update
)
router.delete(
  '/departments/:id',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  destroy
)

module.exports = router
