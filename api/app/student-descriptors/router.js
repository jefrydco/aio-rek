'use strict'

const bodyParser = require('body-parser')
const router = require('express').Router()
const { createTransaction, jwtAuth, handleRole } = require('../middleware')
const { create, fetchPage, fetch, update, destroy } = require('./controller')

router.post(
  '/student-descriptors',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  create
)
router.get(
  '/student-descriptors',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  fetchPage
)
router.get(
  '/student-descriptors/:id',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  fetch
)
router.put(
  '/student-descriptors/:id',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  update
)
router.delete(
  '/student-descriptors/:id',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  destroy
)

module.exports = router
