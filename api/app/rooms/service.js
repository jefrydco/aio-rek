'use strict'

const Service = require('../base/Service')

class RoomService extends Service {
  constructor(app) {
    super(RoomService.name, app)
  }
}

module.exports = app => new RoomService(app)
