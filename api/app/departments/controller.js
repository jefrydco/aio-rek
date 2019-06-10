'use strict'

const Controller = require('../base/Controller')

class DepartmentController extends Controller {
  constructor() {
    super(DepartmentController.name)
  }
}

module.exports = new DepartmentController()
