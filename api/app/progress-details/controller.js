// PATH: /api/app/progress-details/controller.js
const errorCatcher = require('async-error-catcher').default;
const Controller = require('../base/Controller');
const UserService = require('../user/UserService'); // Assuming UserService exists for user validation
class ProgressDetailController extends Controller {
  constructor() {
    super(ProgressDetailController.name);
  }
  addProgressDetail(req, res, next) {
    return errorCatcher(async (req, res) => {
      const { id, progress_meaning } = req.body;
      // Validate user
      const userService = new UserService();
      const user = await userService.getUserById(id);
      if (!user) {
        return res.status(400).json({ error: 'This user is not found.' });
      }
      // Validate id
      if (typeof id !== 'number') {
        return res.status(422).json({ error: 'Wrong format.' });
      }
      // Validate progress_meaning
      if (!progress_meaning || progress_meaning.trim() === '') {
        return res.status(400).json({ error: 'The progress meaning is required.' });
      }
      const service = this._getService(res);
      const progressDetail = await service.addProgressDetail(id, progress_meaning);
      return res.json({
        status: 200,
        progress_detail: progressDetail
      });
    })(req, res, next);
  }
  // Existing code...
}
module.exports = new ProgressDetailController();
