'use strict'

const Controller = require('../base/Controller')

class StudentController extends Controller {
  constructor() {
    super(StudentController.name)
  }
}

module.exports = new StudentController()
