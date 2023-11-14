const userService = require('../services/userService');
const loginAttemptService = require('../services/loginAttemptService');
const authService = require('../services/authService');
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
exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const { user, token } = await authService.authenticateUser(username, password);
    return res.status(200).json({ status: 200, user, token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
exports.resetPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { email } = req.body;
  const user = await userService.getUserByEmail(email);
  if (user) {
    const resetLink = userService.generateResetLink(user);
    loginAttemptService.logResetRequest(user);
    return res.status(200).json({ status: 200, message: 'Password reset link sent to email.' });
  } else {
    return res.status(400).json({ error: 'User does not exist.' });
  }
};
