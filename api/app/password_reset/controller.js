const PasswordResetService = require('../services/PasswordResetService');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const handleError = require('../middleware/handle-error');
exports.requestPasswordReset = async (req, res) => {
    try {
        const email = req.body.email;
        await PasswordResetService.requestPasswordReset(email);
        return res.status(200).json({ status: 'success', message: 'Password reset link has been sent to your email.' });
    } catch (error) {
        handleError(error, req, res);
    }
};
exports.resetPasswordController = async (req, res) => {
    try {
        const { reset_link, new_password, new_password_confirmation } = req.body;
        const result = await PasswordResetService.resetPassword(reset_link, new_password, new_password_confirmation);
        if (result.success) {
            return res.status(200).json({ status: 'success', message: 'Password reset successfully.' });
        } else {
            return res.status(400).json({ status: 'error', message: result.message });
        }
    } catch (error) {
        handleError(error, req, res);
    }
};
