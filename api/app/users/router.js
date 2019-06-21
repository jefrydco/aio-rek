'use strict'

const bodyParser = require('body-parser')
const router = require('express').Router()
// const {
//   createTransaction,
//   jwtAuth,
//   localAuth,
//   handleRole,
//   handleImage
// } = require('../middleware')
// const { handleId } = require('./middleware')
const {
  createTransaction,
  jwtAuth,
  localAuth,
  handleRole
} = require('../middleware')
// const {
//   login,
//   create,
//   getAll,
//   getOnce,
//   update,
//   destroy,
//   updateSelf,
//   getAuth,
//   getProfile,
//   getImages
// } = require('./controller')
const {
  login,
  fetchAuth,
  fetchProfile,
  create,
  fetchPage,
  fetch,
  update,
  destroy
} = require('./controller')

router.post(
  '/users/login',
  bodyParser.json(),
  createTransaction,
  localAuth,
  login
)
router.post(
  '/users',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  create
)
router.get(
  '/users',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  fetchPage
)
router.get(
  '/users/:id',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  fetch
)
router.put(
  '/users/:id',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  update
)
router.delete(
  '/users/:id',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  destroy
)

router.get(
  '/user/auth',
  createTransaction,
  jwtAuth.required,
  handleRole([['admin'], ['room']]),
  fetchAuth
)
router.get(
  '/user/profile',
  createTransaction,
  jwtAuth.required,
  handleRole([['admin'], ['room']]),
  fetchProfile
)

// router.put(
//   '/user/update',
//   createTransaction,
//   jwtAuth.required,
//   handleRole('student'),
//   handleImage('static/uploads/images/profiles').single('image'),
//   updateSelf
// )
// router.get(
//   '/user/auth',
//   createTransaction,
//   jwtAuth.required,
//   handleRole([['admin'], ['lecturer'], ['room'], ['student']]),
//   getAuth
// )
// router.get(
//   '/user/profile',
//   createTransaction,
//   jwtAuth.required,
//   handleRole([['admin'], ['lecturer'], ['room'], ['student']]),
//   getProfile
// )
// router.get(
//   '/user/images',
//   createTransaction,
//   jwtAuth.required,
//   handleRole('student'),
//   getImages
// )

module.exports = router
