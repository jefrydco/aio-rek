const { check } = require('express-validator');
router.post(
  '/api/auth/login',
  [
    check('username').not().isEmpty().withMessage('The username is required.'),
    check('password').not().isEmpty().withMessage('The password is required.')
  ],
  bodyParser.json(),
  createTransaction,
  localAuth,
  login
);
