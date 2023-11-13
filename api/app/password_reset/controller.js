const PasswordReset = require('../models/PasswordReset');
const User = require('../models/User');
const nodemailer = require('nodemailer');
exports.resetPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ status: 'error', message: 'Email not found.' });
        }
        const resetLink = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 24);
        const passwordReset = new PasswordReset({
            user_id: user.id,
            reset_link: resetLink,
            expiry_date: expiryDate
        });
        await passwordReset.save();
        // Send email to user with reset link
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });
        let mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one day of receiving it:\n\nhttp://${req.headers.host}/reset-password/${resetLink}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
        };
        transporter.sendMail(mailOptions, function(err, response) {
            if (err) {
                console.error('there was an error: ', err);
            } else {
                console.log('here is the res: ', response);
                res.status(200).json('recovery email sent');
            }
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'An error occurred while resetting password.' });
    }
};
