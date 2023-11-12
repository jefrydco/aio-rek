const ExtractJwt = require('passport-jwt').ExtractJwt;
const errorCatcher = require('async-error-catcher').default;
const Controller = require('../base/Controller');
class UserController extends Controller {
  constructor() {
    super(UserController.name);
  }
  checkKYCStatus = errorCatcher(async (req, res, next) => {
    const { id } = req.params;
    const service = this._getService(res);
    const user = await service.getUserById(id);
    if (user) {
      return res.status(200).json({ status: 200, KYCStatus: user.kyc_status });
    } else {
      return res.status(400).json({ error: 'User does not exist.' });
    }
  });
  getKYCDocuments = errorCatcher(async (req, res, next) => {
    const { user_id } = req.params;
    const service = this._getService(res);
    const documents = await service.retrieveKYCDocuments(user_id);
    return res.json(documents);
  });
}
module.exports = new UserController();
