const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
// Function to generate a unique reset link and expiry date
function generateResetLink() {
  const resetLink = crypto.randomBytes(20).toString('hex');
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 1); // Link expires after 1 hour
  return { resetLink, expiryDate };
}
// Function to create a new record in the "password_reset" table
async function createPasswordResetRecord(userId) {
  const { resetLink, expiryDate } = generateResetLink();
  const passwordReset = new PasswordReset({
    userId,
    resetLink,
    expiryDate
  });
  await passwordReset.save();
  return resetLink;
}
// Function to send an email to the user with the reset link
async function sendResetLinkEmail(userEmail, resetLink) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-password'
    }
  });
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: userEmail,
    subject: 'Password Reset Link',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\nhttp://${req.headers.host}/reset/${resetLink}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
  };
  await transporter.sendMail(mailOptions);
}
// Function to handle password reset request
async function handlePasswordResetRequest(email) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Email does not exist');
  }
  const resetLink = await createPasswordResetRecord(user.id);
  await sendResetLinkEmail(email, resetLink);
  return 'Reset link sent successfully';
}
module.exports = {
  generateResetLink,
  createPasswordResetRecord,
  sendResetLinkEmail,
  handlePasswordResetRequest
};
