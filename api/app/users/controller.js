const ExtractJwt = require('passport-jwt').ExtractJwt
const errorCatcher = require('async-error-catcher').default
const Controller = require('../base/Controller')
const UserService = require('../services/UserService')
class UserController extends Controller {
  constructor() {
    super(UserController.name)
  }
  // Existing methods...
  checkKYCStatus(req, res, next) {
    return errorCatcher(async (req, res) => {
      const { id } = req.params;
      if (!Number.isInteger(Number(id))) {
        return res.status(422).json({ message: "Wrong format" });
      }
      const service = new UserService();
      const user = await service.getUserById(id);
      if (!user) {
        return res.status(404).json({ message: "This user is not found" });
      }
      const kyc_status = await service.getKYCStatus(id);
      return res.json({ status: 200, kyc_status });
    })(req, res, next);
  }
}
module.exports = new UserController()
