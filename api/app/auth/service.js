const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const LoginAttempt = require('../models/LoginAttempt');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const userService = require('../users/service');
const loginAttemptService = require('../login_attempts/service');
const emailService = require('../email/service');
const errorUtil = require('../utils/error');
class AuthService {
  ...
  async validateCredentials(username, password) {
    try {
      const user = await userService.findUserByUsername(username);
      if (!user) {
        throw errorUtil.createError('Invalid credentials');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        await loginAttemptService.recordFailedLoginAttempt(user.id);
        const failedAttempts = await loginAttemptService.countFailedLoginAttempts(user.id);
        if (failedAttempts > 5) {
          const lockExpiry = new Date();
          lockExpiry.setHours(lockExpiry.getHours() + 6);
          await userService.lockUserAccount(user.id, lockExpiry);
          await emailService.sendAccountLockedEmail(user.email);
        }
        throw errorUtil.createError('Invalid credentials');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
  async updateLastLogin(userId) {
    try {
      const user = await User.update({ last_login: new Date() }, { where: { id: userId } });
      return user;
    } catch (error) {
      throw error;
    }
  }
  async generateToken(user) {
    try {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return token;
    } catch (error) {
      throw error;
    }
  }
  async authenticateUser(username, password) {
    try {
      const user = await this.validateCredentials(username, password);
      if (!user) {
        throw new Error('User not found');
      }
      await this.updateLastLogin(user.id);
      await loginAttemptService.recordSuccessfulLoginAttempt(user.id);
      const token = await this.generateToken(user);
      return { user, token };
    } catch (error) {
      throw error;
    }
  }
  ...
}
module.exports = new AuthService();
