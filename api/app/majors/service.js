'use strict'

const Service = require('../base/Service')

class MajorService extends Service {
  constructor(app) {
    super(MajorService.name, app)
  }
}

module.exports = (app) => new MajorService(app)
