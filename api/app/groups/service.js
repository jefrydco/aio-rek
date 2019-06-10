'use strict'

const Service = require('../base/Service')

class GroupService extends Service {
  constructor(app) {
    super(GroupService.name, app)
  }
}

module.exports = app => new GroupService(app)
