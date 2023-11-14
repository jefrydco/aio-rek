// PATH: /api/app/auth/service.js
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const LoginAttempt = require('../models/LoginAttempt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
class AuthService {
  ...
  async getUserByUsername(username) {
    try {
      const user = await User.findOne({ where: { username } });
      return user;
    } catch (error) {
      throw error;
    }
  }
  async comparePassword(enteredPassword, storedPassword) {
    try {
      return await bcrypt.compare(enteredPassword, storedPassword);
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
  async createLoginAttempt(userId, successful) {
    try {
      const loginAttempt = await LoginAttempt.create({
        attempt_time: new Date(),
        successful: successful,
        user_id: userId
      });
      return loginAttempt;
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
      const user = await this.getUserByUsername(username);
      if (!user) {
        throw new Error('User not found');
      }
      const isValidPassword = await this.comparePassword(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }
      await this.updateLastLogin(user.id);
      await this.createLoginAttempt(user.id, true);
      const token = await this.generateToken(user);
      return { user, token };
    } catch (error) {
      throw error;
    }
  }
  ...
}
module.exports = new AuthService();
