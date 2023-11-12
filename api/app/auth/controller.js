// PATH: /api/app/auth/controller.js
const userService = require('../services/userService');
const loginAttemptService = require('../services/loginAttemptService');
const { body, validationResult } = require('express-validator');
exports.validate = (method) => {
  switch (method) {
    case 'resetPassword': {
      return [
        body('email', 'The email is required.').exists(),
        body('email', 'The email is not valid.').isEmail(),
      ]
    }
  }
}
exports.resetPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { email } = req.body;
  const user = await userService.getUserByEmail(email);
  if (user) {
    const resetLink = await userService.generateResetLink(user);
    const expiryDate = await userService.setExpiryDate();
    await userService.saveResetLink(user, resetLink, expiryDate);
    // TODO: Replace this with actual function for sending emails
    // sendEmail(user.email, resetLink);
    loginAttemptService.logResetRequest(user);
    return res.status(200).json({ status: 200, message: 'Password reset link sent to email.' });
  } else {
    return res.status(400).json({ error: 'User does not exist.' });
  }
};
