const ExtractJwt = require('passport-jwt').ExtractJwt;
const errorCatcher = require('async-error-catcher').default;
const Controller = require('../base/Controller');
class UserController extends Controller {
  constructor() {
    super(UserController.name);
  }
  // Existing code...
  resetPassword(req, res, next) {
    return errorCatcher(async (req, res) => {
      const { email } = req.body;
      const service = this._getService(res);
      const message = await service.resetPassword(email);
      return res.json({ message });
    })(req, res, next);
  }
}
module.exports = new UserController();
