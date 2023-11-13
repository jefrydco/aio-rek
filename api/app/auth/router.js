<<<<<<< HEAD
// PATH: /api/app/auth/router.js
=======
>>>>>>> test-github
const express = require('express');
const router = express.Router();
const authController = require('./authController');
const authValidation = require('./authValidation');
<<<<<<< HEAD
router.post('/forgot-password', authValidation.resetPasswordValidation, authController.forgotPassword);
router.post('/reset-password', authValidation.resetPasswordValidation, authController.resetPassword);
=======
router.post('/forgot-password', authValidation.resetPasswordValidation, authController.resetPassword);
>>>>>>> test-github
module.exports = router;
