'use strict'

const Service = require('../base/Service')

class LecturerDescriptorService extends Service {
  constructor(app) {
    super(LecturerDescriptorService.name, app)
  }
}

module.exports = app => new LecturerDescriptorService(app)
