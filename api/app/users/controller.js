const ExtractJwt = require('passport-jwt').ExtractJwt;
const errorCatcher = require('async-error-catcher').default;
const Controller = require('../base/Controller');
class UserController extends Controller {
  constructor() {
    super(UserController.name);
  }
  // Existing code...
  getUserProgress(req, res, next) {
    return errorCatcher(async (req, res) => {
      const { id } = req.params;
      const service = this._getService(res);
      const progressDetails = await service.getUserProgress(id);
      return res.status(200).json(progressDetails);
    })(req, res, next);
  }
  resetPassword(req, res, next) {
    return errorCatcher(async (req, res) => {
      const { email } = req.body;
      const service = this._getService(res);
      const message = await service.resetPassword(email);
      return res.json({ message });
    })(req, res, next);
  }
  updateProgress(req, res, next) {
    return errorCatcher(async (req, res) => {
      const { id, progress } = req.body;
      const service = this._getService(res);
      const result = await service.updateUserProgress(id, progress);
      return res.json(result);
    })(req, res, next);
  }
  // Other existing methods...
}
module.exports = new UserController();
