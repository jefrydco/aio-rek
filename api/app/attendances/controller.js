'use strict'

const Controller = require('../base/Controller')

class AttendanceController extends Controller {
  constructor() {
    super(AttendanceController.name)
  }
}

module.exports = new AttendanceController()
