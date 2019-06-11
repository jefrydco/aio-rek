'use strict'

const Service = require('../base/Service')

class PresenceService extends Service {
  constructor(app) {
    super(PresenceService.name, app)
  }
}

module.exports = app => new PresenceService(app)
