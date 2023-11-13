const nodemailer = require('nodemailer');
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
class EmailService {
  async sendEmail(userEmail) {
    let user = await User.findOne({ email: userEmail });
    if (!user) {
      return { status: 'failure', message: 'Email does not exist' };
    }
    let resetLink = await PasswordReset.create({ userId: user.id, expiresAt: Date.now() + 24*60*60*1000 });
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    let mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: userEmail,
      subject: 'Password Reset Link',
      text: `You requested for a password reset, kindly use this ${resetLink} to reset your password.`
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        return { status: 'failure', message: 'Error sending email' };
      } else {
        console.log('Email sent: ' + info.response);
        return { status: 'success', message: 'Email sent successfully' };
      }
    });
  }
}
module.exports = new EmailService();
