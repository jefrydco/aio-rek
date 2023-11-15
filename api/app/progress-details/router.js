const bodyParser = require('body-parser')
const router = require('express').Router()
const { check } = require('express-validator')
const {
  createTransaction,
  jwtAuth,
  handleRole
} = require('../middleware')
const {
  addProgressDetail
} = require('./controller')
router.post(
  '/api/users/:id/progress_details',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleRole('admin'),
  [
    check('id').isNumeric().withMessage('Wrong format.'),
    check('progress_meaning').notEmpty().withMessage('The progress meaning is required.')
  ],
  addProgressDetail
)
module.exports = router
