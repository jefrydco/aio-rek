'use strict'

const Service = require('../base/Service')

class LecturerService extends Service {
  constructor(app) {
    super(LecturerService.name, app, ['user.hashed_password'])
  }
}

module.exports = app => new LecturerService(app)
