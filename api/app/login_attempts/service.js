const LoginAttempt = require('../models/LoginAttempt');
const User = require('../models/User');
const mailer = require('../utils/mailer');
const logResetRequest = async (email) => {
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        const loginAttempt = new LoginAttempt({
            user_id: user._id,
            status: 'password_reset_requested',
            timestamp: new Date()
        });
        await loginAttempt.save();
        const resetLink = `http://yourwebsite.com/reset-password?token=${user._id}`;
        await mailer.sendMail({
            from: 'no-reply@yourwebsite.com',
            to: email,
            subject: 'Password Reset Request',
            text: `You have requested to reset your password. Please click on the following link to reset your password: ${resetLink}`
        });
        return { success: true, message: 'Password reset link has been sent to your email' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An error occurred while processing your request' };
    }
}
module.exports = {
    logResetRequest
}
