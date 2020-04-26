'use strict'

const Service = require('../base/Service')

class StudentImageService extends Service {
  constructor(app) {
    super(StudentImageService.name, app)
  }
}

module.exports = (app) => new StudentImageService(app)
