const userService = require('../services/userService');
const loginAttemptService = require('../services/loginAttemptService');
const emailService = require('../services/emailService');
const { body, validationResult } = require('express-validator');
exports.validate = (method) => {
  switch (method) {
    case 'authenticateUser': {
      return [
        body('username', 'The username is required.').exists(),
        body('password', 'The password is required.').exists(),
      ]
    }
    case 'lockAccount': {
      return [
        body('username', 'The username is required.').exists(),
      ]
    }
    case 'resetPassword': {
      return [
        body('email', 'The email is required.').exists(),
        body('email', 'The email is not valid.').isEmail(),
      ]
    }
  }
}
exports.authenticateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { username, password } = req.body;
  try {
    const user = await userService.authenticateUser(username, password);
    return res.status(200).json({ status: 200, message: 'Authentication successful.', user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
exports.lockAccount = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { username } = req.body;
  const user = await userService.getUserByUsername(username);
  if (user) {
    const failedAttempts = await loginAttemptService.incrementFailedAttempts(user);
    if (failedAttempts > 3) {
      await userService.lockAccount(user);
      setTimeout(() => userService.unlockAccount(user), 6 * 60 * 60 * 1000);
      emailService.sendAccountLockEmail(user.email);
      return res.status(200).json({ status: 200, message: 'Account has been locked.' });
    } else {
      return res.status(200).json({ status: 200, message: 'Failed login attempt recorded.' });
    }
  } else {
    return res.status(400).json({ error: 'User does not exist.' });
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
    emailService.sendResetEmail(user.email, resetLink);
    return res.status(200).json({ status: 200, message: 'Password reset link sent to email.' });
  } else {
    return res.status(400).json({ error: 'User does not exist.' });
  }
};
