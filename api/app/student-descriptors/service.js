'use strict'

const Service = require('../base/Service')

class StudentDescriptorService extends Service {
  constructor(app) {
    super(StudentDescriptorService.name, app)
  }
}

module.exports = app => new StudentDescriptorService(app)
