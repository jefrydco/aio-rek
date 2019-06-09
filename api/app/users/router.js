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
  handleRole,
  handleId
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
  name,
  login,
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
  handleId(name),
  fetch
)
router.put(
  '/users/:id',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  handleId(name),
  update
)
router.delete(
  '/users/:id',
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  handleId(name),
  destroy
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
