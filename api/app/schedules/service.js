'use strict'

const Service = require('../base/Service')

class ScheduleService extends Service {
  constructor(app) {
    super(ScheduleService.name, app)
  }
}

module.exports = (app) => new ScheduleService(app)
