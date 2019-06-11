'use strict'

const Service = require('../base/Service')

class SubjectService extends Service {
  constructor(app) {
    super(SubjectService.name, app)
  }
}

module.exports = app => new SubjectService(app)
