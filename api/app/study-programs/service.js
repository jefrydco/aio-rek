'use strict'

const Service = require('../base/Service')

class StudyProgramService extends Service {
  constructor(app) {
    super(StudyProgramService.name, app)
  }
}

module.exports = (app) => new StudyProgramService(app)
