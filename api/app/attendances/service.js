'use strict'

const Service = require('../base/Service')

class AttendanceService extends Service {
  constructor(app) {
    super(AttendanceService.name, app)
  }
}

module.exports = app => new AttendanceService(app)
