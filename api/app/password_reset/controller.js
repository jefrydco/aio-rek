const PasswordResetService = require('../services/PasswordResetService');
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
