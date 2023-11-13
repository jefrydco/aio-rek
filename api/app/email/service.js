const nodemailer = require('nodemailer');
const User = require('../models/user'); // Assuming the User model is in this path
async function sendAccountLockedEmail(user) {
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
        subject: 'Account Locked',
        text: `Dear ${user.username},\n\nYour account has been locked due to multiple unsuccessful login attempts. Please contact our support team to unlock your account.\n\nBest Regards,\nYour Team`
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
async function lockUserAccount(username) {
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            throw new Error('User not found');
        }
        user.failedLoginAttempts += 1;
        if (user.failedLoginAttempts >= 3) {
            user.accountLocked = true;
            user.lockedUntil = Date.now() + 6 * 60 * 60 * 1000; // 6 hours from now
            await sendAccountLockedEmail(user);
        }
        await user.save();
        return { accountLocked: user.accountLocked };
    } catch (error) {
        console.error(error);
        return { error: error.message };
    }
}
module.exports = {
    sendAccountLockedEmail,
    lockUserAccount
};
