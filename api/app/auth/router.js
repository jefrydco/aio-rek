const express = require('express');
const router = express.Router();
const authController = require('./authController');
const authValidation = require('./authValidation');
router.post('/forgot-password', authValidation.resetPasswordValidation, authController.resetPassword);
module.exports = router;
