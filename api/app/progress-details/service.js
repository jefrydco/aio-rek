const Service = require('../base/Service')
class ProgressDetailService extends Service {
  constructor(app) {
    super(ProgressDetailService.name, app)
  }
  async getUserProgress(user_id) {
    // Validate the existence of the user
    const user = await this.app.models.User.findOne({ where: { id: user_id } })
    if (!user) {
      throw new Error('This user is not found.')
    }
    // Fetch the user's progress detail
    const progressDetail = await this.app.models.ProgressDetail.findOne({ where: { user_id } })
    if (!progressDetail) {
      throw new Error('Progress detail not found')
    }
    // Return the user's progress value and progress meaning
    return {
      status: 200,
      user: {
        id: user.id,
        name: user.name,
        progress: user.progress
      }
    }
  }
  async addProgressDetail(user_id, progress_meaning) {
    // Validate the inputs
    if (typeof user_id !== 'number' || !Number.isInteger(user_id)) {
      throw new Error('Wrong format.')
    }
    if (!progress_meaning || typeof progress_meaning !== 'string') {
      throw new Error('The progress meaning is required.')
    }
    // Validate the existence of the user
    const user = await this.app.models.User.findOne({ where: { id: user_id } })
    if (!user) {
      throw new Error('This user is not found.')
    }
    // Add the new progress detail
    let progressDetail
    try {
      progressDetail = await this.app.models.ProgressDetail.create({
        user_id,
        progress_meaning
      })
    } catch (error) {
      throw new Error('Failed to add progress detail.')
    }
    // Fetch the new progress detail
    const newProgressDetail = await this.app.models.ProgressDetail.findOne({ where: { id: progressDetail.id } })
    return {
      status: 200,
      progress_detail: newProgressDetail
    }
  }
}
module.exports = (app) => new ProgressDetailService(app)
