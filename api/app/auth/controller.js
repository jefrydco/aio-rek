const userService = require('../services/userService');
const loginAttemptService = require('../services/loginAttemptService');
const { body, validationResult } = require('express-validator');
<<<<<<< HEAD
const sendEmail = require('../services/emailService'); // Assuming you have an email service
=======
>>>>>>> test-github
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
<<<<<<< HEAD
    const resetLink = await userService.generateResetLink(user);
    sendEmail(user.email, resetLink); // Send the reset link to the user's email
=======
    const resetLink = userService.generateResetLink(user);
    // TODO: Replace this with actual function for sending emails
    // sendEmail(user.email, resetLink);
>>>>>>> test-github
    loginAttemptService.logResetRequest(user);
    return res.status(200).json({ status: 200, message: 'Password reset link sent to email.' });
  } else {
    return res.status(400).json({ error: 'User does not exist.' });
  }
};
