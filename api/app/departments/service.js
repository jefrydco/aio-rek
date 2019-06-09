'use strict'

const Service = require('../../base/Service')

class DepartmentService extends Service {
  constructor(name, app) {
    super(DepartmentService.name, app)
  }
}

module.exports = app => new DepartmentService(app)
