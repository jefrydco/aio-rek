'use strict'

const bodyParser = require('body-parser')
const router = require('express').Router()
const { createTransaction, jwtAuth, handleRole } = require('../middleware')
const { create, fetchPage, fetch, update, destroy } = require('./controller')

router.post(
  '/majors',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  create
)
router.get(
  '/majors',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  fetchPage
)
router.get(
  '/majors/:id',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  fetch
)
router.put(
  '/majors/:id',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  update
)
router.delete(
  '/majors/:id',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  destroy
)

module.exports = router
