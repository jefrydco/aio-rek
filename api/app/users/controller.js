const ExtractJwt = require('passport-jwt').ExtractJwt;
const errorCatcher = require('async-error-catcher').default;
const Controller = require('../base/Controller');
class UserController extends Controller {
  constructor() {
    super(UserController.name);
  }
  getKYCDocuments(req, res, next) {
    return errorCatcher(async (req, res) => {
      const { user_id } = req.params;
      const service = this._getService(res);
      const documents = await service.retrieveKYCDocuments(user_id);
      return res.json(documents);
    })(req, res, next);
  }
}
module.exports = new UserController();
