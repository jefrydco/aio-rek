const PasswordReset = require('../models/PasswordReset');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const uuid = require('uuid');
const validateResetLink = async (resetLink) => {
  const passwordReset = await PasswordReset.findOne({ reset_link: resetLink });
  if (!passwordReset) {
    throw new Error('Invalid reset link');
  }
  if (new Date() > passwordReset.expiry_date) {
    throw new Error('Reset link has expired');
  }
  return passwordReset;
};
const validateNewPassword = (newPassword, newPasswordConfirmation) => {
  if (newPassword !== newPasswordConfirmation) {
    throw new Error('Password confirmation does not match');
  }
  if (newPassword.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
};
const resetPassword = async (resetLink, newPassword, newPasswordConfirmation) => {
  const passwordReset = await validateResetLink(resetLink);
  validateNewPassword(newPassword, newPasswordConfirmation);
  const user = await User.findById(passwordReset.user_id);
  if (!user) {
    throw new Error('User not found');
  }
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  await passwordReset.remove();
  return { message: 'Password has been reset successfully' };
};
const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error('Email not found');
  }
  const resetLink = uuid.v4();
  const requestTime = new Date();
  const passwordReset = new PasswordReset({
    user_id: user._id,
    reset_link: resetLink,
    request_time: requestTime
  });
  await passwordReset.save();
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-password'
    }
  });
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: user.email,
    subject: 'Password Reset Link',
    text: `Here is your password reset link: ${resetLink}`
  };
  await transporter.sendMail(mailOptions);
  return "A password reset link has been sent to your email address.";
};
module.exports = {
  validateResetLink,
  resetPassword,
  requestPasswordReset,
  validateNewPassword
};
