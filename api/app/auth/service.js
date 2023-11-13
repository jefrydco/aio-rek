const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
class AuthService {
  ...
  async getUserByEmail(email) {
    try {
      const user = await User.findOne({ where: { email } });
      return user;
    } catch (error) {
      throw error;
    }
  }
  async generateResetLink(userId) {
    try {
      const resetLink = crypto.randomBytes(20).toString('hex');
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 24); // Link expires after 24 hours
      const passwordReset = await PasswordReset.create({
        reset_link: resetLink,
        expiry_date: expiryDate,
        user_id: userId
      });
      return passwordReset;
    } catch (error) {
      throw error;
    }
  }
  async sendResetLink(email, resetLink) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'your-email@gmail.com',
          pass: 'your-password'
        }
      });
      const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\nhttp://${req.headers.host}/reset/${resetLink}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    } catch (error) {
      throw error;
    }
  }
  ...
}
module.exports = new AuthService();
