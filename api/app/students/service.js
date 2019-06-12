'use strict'

const Service = require('../base/Service')

class StudentService extends Service {
  constructor(app) {
    super(StudentService.name, app, ['user.hashed_password'])
  }
}

module.exports = app => new StudentService(app)
