const LoginAttempt = require('../models/LoginAttempt');
const User = require('../models/User');
const mailer = require('../utils/mailer');
const logResetRequest = async (email) => {
    // existing code
}
const incrementFailedLoginAttempt = async (username) => {
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        const loginAttempt = new LoginAttempt({
            user_id: user._id,
            successful: false,
            attempt_time: new Date()
        });
        await loginAttempt.save();
        user.failed_login_attempts += 1;
        if (user.failed_login_attempts >= 3) {
            user.account_locked = true;
            user.locked_until = new Date(Date.now() + 6 * 60 * 60 * 1000); // 6 hours from now
            await mailer.sendMail({
                to: user.email,
                subject: 'Your account has been locked',
                text: 'Your account has been locked due to too many failed login attempts. It will be unlocked after 6 hours.'
            });
        }
        await user.save();
        return { success: true, message: 'Failed login attempt has been recorded', account_locked: user.account_locked };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An error occurred while processing your request' };
    }
}
module.exports = {
    logResetRequest,
    incrementFailedLoginAttempt
}
