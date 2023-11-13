const PasswordReset = require('../models/PasswordReset');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
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
const resetPassword = async (resetLink, newPassword) => {
  const passwordReset = await validateResetLink(resetLink);
  const user = await User.findById(passwordReset.user_id);
  if (!user) {
    throw new Error('User not found');
  }
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  await passwordReset.remove();
};
const sendResetLink = async (email) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error('Email not found');
  }
  const resetLink = await bcrypt.hash(user._id.toString(), 10);
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 24);
  const passwordReset = new PasswordReset({
    user_id: user._id,
    reset_link: resetLink,
    expiry_date: expiryDate
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
};
module.exports = {
  validateResetLink,
  resetPassword,
  sendResetLink
};
