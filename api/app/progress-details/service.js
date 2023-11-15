// PATH: /api/app/progress-details/service.js
'use strict'
const Service = require('../base/Service')
class ProgressDetailService extends Service {
  constructor(app) {
    super(ProgressDetailService.name, app)
  }
  async addProgressDetail(userId, progressMeaning) {
    // Validate the inputs
    if (typeof userId !== 'number' || !Number.isInteger(userId)) {
      throw new Error('Wrong format.')
    }
    if (!progressMeaning || typeof progressMeaning !== 'string') {
      throw new Error('The progress meaning is required.')
    }
    // Validate the existence of the user
    const user = await this.app.models.User.findOne({ where: { id: userId } })
    if (!user) {
      throw new Error('This user is not found.')
    }
    // Add the new progress detail
    let progressDetail
    try {
      progressDetail = await this.app.models.ProgressDetail.create({
        user_id: userId,
        progress_meaning: progressMeaning
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
