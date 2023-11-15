const ExtractJwt = require('passport-jwt').ExtractJwt;
const errorCatcher = require('async-error-catcher').default;
const Controller = require('../base/Controller');
class UserController extends Controller {
  constructor() {
    super(UserController.name);
  }
  // Existing code...
  updateUserProgress(req, res, next) {
    return errorCatcher(async (req, res) => {
      const { id } = req.params;
      const { progress } = req.body;
      const service = this._getService(res);
      if (isNaN(id)) {
        return res.status(422).json({ message: "Wrong format." });
      }
      if (isNaN(progress)) {
        return res.status(422).json({ message: "Wrong format." });
      }
      try {
        const updatedUser = await service.updateUserProgress(id, progress);
        if (!updatedUser) {
          return res.status(404).json({ message: "This user is not found." });
        }
        return res.status(200).json({
          status: 200,
          user: updatedUser
        });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    })(req, res, next);
  }
  // Other existing methods...
}
module.exports = new UserController();
